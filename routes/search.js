const express = require('express');
const router = express.Router();
const { connectToMongoDB } = require('../database/database');


// GET /api/search?q=searchTerm
router.get('/', async (req, res) => {
  try {
    
    const { q } = req.query;
    const db = await connectToMongoDB();
    const lessonsCollection = db.collection('lessons');
    
    if (!q || q.trim() === '') {
        // If no search term, return all lessons
        const allLessons = await lessonsCollection.find({}).toArray();
        res.status(200).json(allLessons);
    }else{

    const searchTerm = q.trim();
    
    // Create a case-insensitive regex for partial matching
    const searchRegex = new RegExp(searchTerm, 'i');

     // Check if search term is a number for price/spaces search
    const isNumeric = !isNaN(searchTerm) && !isNaN(parseFloat(searchTerm));
    const numericValue = isNumeric ? parseFloat(searchTerm) : null;

     let searchQuery = {
      $or: [
        { title: { $regex: searchRegex }},
        { subject: { $regex: searchRegex }},
        { location: { $regex: searchRegex }},
        { tutor: {$regex: searchRegex }}
      ]
    };

    if (isNumeric) {
      searchQuery.$or.push(
        { price: numericValue },
        { spaces: numericValue }
      );
    }

    // Search across multiple fields
    const lessons = await lessonsCollection.find(searchQuery).toArray();

    res.json(lessons);
    
  }

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;