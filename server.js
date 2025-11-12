const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const protect = require('./middleware/auth');
const jwt = require('jsonwebtoken');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

app.get('/api/users', (req, res) => {
  res.status(200).send('Users route!');
});

// Protected route example
app.get('/api/orders', protect, (req, res) => {

  res.status(200).json({ message: 'This is a protected orders route', user: req.user, token: req.token });
});

// Temporary login route for testing
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    // Verify username and password later here
    
    const token = jwt.sign({ email, password }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token: token });
  
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});