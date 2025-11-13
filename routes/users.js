const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { connectToMongoDB } = require('../database/database');
const { ObjectId } = require('mongodb');

// Get user details by ID
router.get('/:id', async (req, res) => {
    const userId = req.params.id;
    const db = await connectToMongoDB();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    res.status(200).json({ user : user});

});

// Fetch all users from database later here
router.get('/', async (req, res) => {
    const db = await connectToMongoDB();
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}).toArray();
    res.status(200).json(users);
});

// User login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const db = await connectToMongoDB();
        const usersCollection = db.collection('users');
        // Check if user email exists in database
        const loginUser = await usersCollection.findOne({ email: email });
        if (!loginUser) {
            return res.status(401).json({ message: 'User does not exist. Please create an account' });
        }else{
            // Compare hashed password in db with entered password
            const isMatch = await bcrypt.compare(password, loginUser.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign({ email, password }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ token: token });
        }
        
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

// User registration route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Check if user already exists
        const db = await connectToMongoDB();
        const usersCollection = db.collection('users');
        const existingUser = await usersCollection.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });

        }else{
            // Hash password before storing
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            // Create new user object
            let newUser = { name: name, email: email, password: hashedPassword, role: role };
            await usersCollection.insertOne(newUser);
            return res.status(201).json({ message: 'User registered successfully with Id: ' + newUser._id });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
 
});

module.exports = router;

