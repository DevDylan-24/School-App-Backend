const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { connectToMongoDB } = require('../database/database');

// Get user details by ID
router.get('/:id', async (req, res) => {
    const userId = req.params.id;

    // Fetch user details from database later here
    res.status(200).json({ id: userId, name: 'John Doe', email: '' });
});

router.get('/', async (req, res) => {
    // Fetch all users from database later here
    const db = await connectToMongoDB();
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}).toArray();
    res.status(200).json(users);
});

// User login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Verify username and password later here
    
    // provide a token when login is successful
    const token = jwt.sign({ email, password }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token: token });
});

// User registration route
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    // Add user registration logic here (e.g., save to database)
    res.status(201).json({ message: 'User registered successfully' });
});

module.exports = router;

