const router = require('express').Router();
const { connectToMongoDB } = require('../database/database');
const { ObjectId } = require('mongodb');
const protect = require('../middleware/auth');

// Change number of spaces for lesson when an order is created


// Fetch all orders from database
router.get('/', async (req, res) => {
    const db = await connectToMongoDB();
    const ordersCollection = db.collection('orders');
    const orders = await ordersCollection.find({}).toArray();
    res.status(200).json(orders);
});

// Get order details by ID
router.get('/:id', async (req, res) => {
    const orderId = req.params.id;
    const db = await connectToMongoDB();
    const ordersCollection = db.collection('orders');
    const order = await ordersCollection.findOne({ _id: new ObjectId(orderId) });
    res.status(200).json({ order : order });
});

// Create a new order protected route by JWT middleware
router.post('/', protect, async (req, res) => {
    try {
        req.body.createdAt = new Date();

        const db = await connectToMongoDB();
        const ordersCollection = db.collection('orders');
        const lessonCollection = db.collection('lessons');

        // Updating number of spaces for each lesson booked in lessons collection
        for(const lesson of req.body.lessons){
            const result = await lessonCollection.updateOne(   
                {_id : new ObjectId(lesson._id)},
                {$set: { spaces: lesson.spaces }}
            );

             console.log(`Updated lesson ${lesson._id}:`, result.modifiedCount);
            
            if (result.modifiedCount === 0) {
                console.warn(`No lesson found with _id: ${lesson._id}`);
            }
        }

        const newOrder = req.body;
        const result = await ordersCollection.insertOne(newOrder);


        res.status(201).json({ message: 'Order created successfully', orderId: result.insertedId });

    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

// Delete order by ID protected route by JWT middleware
router.delete('/:id', protect, async (req, res) => {
    const orderId = req.params.id;
    try {
        const db = await connectToMongoDB();
        const ordersCollection = db.collection('orders');
        const result = await ordersCollection.deleteOne({ _id: new ObjectId(orderId) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
});

// Get orders by userID protected route by JWT middleware
router.get('/student/:studentId', protect, async (req, res) => {
    const userId = req.params.studentId;
    const db = await connectToMongoDB();
    const ordersCollection = db.collection('orders');
    const orders = await ordersCollection.find({ userId: userId }).toArray();
    res.status(200).json(orders);
});

module.exports = router;