const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const protect = require('./middleware/auth');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const usersRouter = require('./routes/users');
const lessonsRouter = require('./routes/lessons');
const ordersRouter = require('./routes/orders');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(cors());

// Mount routers
app.use('/api/users', usersRouter);
app.use('/api/lessons', lessonsRouter);
app.use('/api/orders', ordersRouter);


app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});