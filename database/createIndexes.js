// File which creates indexes for searching - Run once using node:
//  database/createIndexes.js

const { connectToMongoDB } = require('../database/database');

async function createSearchIndexes() {    
    try {

        const db = await connectToMongoDB();
        const lessonsCollection = db.collection('lessons');

        
        console.log('Creating search indexes...');
        
        // Create indexes for text fields (for regex searches)
        await lessonsCollection.createIndex({ subject: 1 });
        console.log('Created index on: subject');
        
        await lessonsCollection.createIndex({ location: 1 });
        console.log('Created index on: location');
        
        await lessonsCollection.createIndex({ title: 1 });
        console.log('Created index on: title');
        
        await lessonsCollection.createIndex({ tutor: 1 });
        console.log('Created index on: tutor');
        
        // Create indexes for numeric fields
        await lessonsCollection.createIndex({ price: 1 });
        console.log('Created index on: price');
        
        await lessonsCollection.createIndex({ spaces: 1 });
        console.log('Created index on: spaces');
        
        console.log('All search indexes created successfully!');
        
        // Display current indexes
        const indexes = await lessonsCollection.indexes();
        console.log('\nCurrent indexes:');
        indexes.forEach((index, i) => {
            console.log(`${i + 1}. ${index.name}:`, index.key);
        });
        
    } catch (error) {
        console.error('Error creating indexes:', error);
    } 
}

// Run the function
createSearchIndexes();