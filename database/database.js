const mongodb = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const MongoClient = mongodb.MongoClient;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/schoolapp';
const DBName = 'School_App';


async function connectToMongoDB() {
    const client = new MongoClient(mongoURI);

    try {
        await client.connect();
        console.log("Connected to MongoDB!");

        const database = client.db(DBName);
        if (!database) {
            throw new Error('Database not initialized');
        }else{
            console.log('Database instance retrieved. Returing database: ' + DBName);
        }
        return database;


    } catch (e) {
        console.error("Error connecting to MongoDB:", e);
    } 
}

module.exports = { connectToMongoDB };