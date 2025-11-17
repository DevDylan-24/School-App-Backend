const router = require('express').Router();
const { connectToMongoDB } = require('../database/database');
const { ObjectId } = require('mongodb');
const protect = require('../middleware/auth');

// Fetch all lessons from database
router.get('/', async (req, res) => {
    const db = await connectToMongoDB();
    const lessonsCollection = db.collection('lessons');
    const lessons = await lessonsCollection.find({}).toArray();
    res.status(200).json(lessons);
});

// Get lesson details by ID
router.get('/:id', async (req, res) => {
    const lessonId = req.params.id;
    const db = await connectToMongoDB();
    const lessonsCollection = db.collection('lessons');
    const lesson = await lessonsCollection.findOne({ _id: new ObjectId(lessonId) });
    res.status(200).json({ lesson : lesson });

});

// Create a new lesson protected route by JWT middleware
router.post('/', protect, async (req, res) => {
    try {

        req.body.createdAt = new Date();
        req.body.reviews = 0;
        req.body.rating = 0;

        const db = await connectToMongoDB();
        const lessonsCollection = db.collection('lessons');

        const newLesson = req.body;
        const result = await lessonsCollection.insertOne(newLesson);
        res.status(201).json({ message: 'Lesson created successfully', lessonId: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

// Delete lesson by ID protected route by JWT middleware
router.delete('/:id', protect, async (req, res) => {
    const lessonId = req.params.id;
    try {
        const db = await connectToMongoDB();
        const lessonsCollection = db.collection('lessons');
        const result = await lessonsCollection.deleteOne({ _id: new ObjectId(lessonId) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        res.status(200).json({ message: 'Lesson deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

// Get lessons by tutor ID protected route by JWT middleware
router.get('/tutor/:tutorId', protect, async (req, res) => {
    const tutorId = req.params.tutorId;
    const db = await connectToMongoDB();
    const lessonsCollection = db.collection('lessons');
    const lessons = await lessonsCollection.find({ tutorId: tutorId }).toArray();
    res.status(200).json(lessons);
});

// Update lesson by ID protected route by JWT middleware
router.put('/:id', protect, async (req, res) => {
    const lessonId = req.params.id;
    const updatedData = req.body;
    try {
        const db = await connectToMongoDB();
        const lessonsCollection = db.collection('lessons');
        const result = await lessonsCollection.updateOne(
            { _id: new ObjectId(lessonId) },
            { $set: updatedData }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Lesson not found' });
        }
        res.status(200).json({ message: 'Lesson updated successfully' , updatedResult: result.modifiedCount});
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});


module.exports = router;