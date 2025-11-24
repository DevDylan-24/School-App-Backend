const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const protect = require('./middleware/auth');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const usersRouter = require('./routes/users');
const lessonsRouter = require('./routes/lessons');
const ordersRouter = require('./routes/orders');
const searchRouter = require('./routes/search');


// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(cors());

// Static file middleware for lesson images
app.use('/images/lessons', express.static(path.join(__dirname, 'public/images/lessons'), {
    // Custom middleware to handle missing images
    // This will make Express throw error for missing files
    fallthrough: false 
}));

// Mount routers
app.use('/api/users', usersRouter);
app.use('/api/lessons', lessonsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/search', searchRouter)

app.get('/api/images/lessons/:imageName', async (req,res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'public/images/lessons', imageName);
    console.log(imagePath);
    
    // Check if file exists
    fs.access(imagePath, fs.constants.F_OK, async (err) => {
        if (err) {
            console.log(`Image not found: ${imageName}`);
            return res.status(404).json({
                error: 'Image not found',
                message: `The lesson image '${imageName}' does not exist`
            });
        }
        
        // File exists, send it
        res.sendFile(imagePath);
    });
});


app.listen(port, () => {
    // Call this when your server starts
    console.log(`Static images served from: ${path.join(__dirname, 'public/images/lessons')}`);
    console.log(`Server is running at http://localhost:${port}`);
});