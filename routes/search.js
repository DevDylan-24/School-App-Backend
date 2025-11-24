const express = require('express');
const router = express.Router();
const { connectToMongoDB } = require('../database/database');


// Regex with indexes
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
        const db = await connectToMongoDB();
        const lessonsCollection = db.collection('lessons');
        const allLessons = await lessonsCollection.find({}).limit(100).toArray();
        return res.json(allLessons);
    }

    const searchTerm = q.trim();
    const db = await connectToMongoDB();
    const lessonsCollection = db.collection('lessons');
    
    // Check if search term is numeric
    const isNumeric = !isNaN(searchTerm) && !isNaN(parseFloat(searchTerm));
    const numericValue = isNumeric ? parseFloat(searchTerm) : null;

    let searchQuery = {};
    
    if (isNumeric) {
        searchQuery = {
            $or: [
                { price: numericValue },
                { spaces: numericValue }
            ]
        };
    } else {
        // Use anchored regex for partial matching that can use indexes
        searchQuery = {
            $or: [
                { subject: { $regex: `^${searchTerm}`, $options: 'i' } }, 
                { location: { $regex: `^${searchTerm}`, $options: 'i' } },
                { title: { $regex: `^${searchTerm}`, $options: 'i' } },
                { tutor: { $regex: `^${searchTerm}`, $options: 'i' } }
            ]
        };
        
        // For very short queries, also search anywhere in string
        if (searchTerm.length <= 3) {
            searchQuery.$or.push(
                { subject: { $regex: searchTerm, $options: 'i' } },
                { location: { $regex: searchTerm, $options: 'i' } },
                { title: { $regex: searchTerm, $options: 'i' } },
                { tutor: { $regex: searchTerm, $options: 'i' } }
            );
        }
    }

    const lessons = await lessonsCollection.find(searchQuery)
        .limit(50)
        .toArray();

    res.json(lessons);

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;