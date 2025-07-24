const express = require('express');
const { MongoClient } = require('mongodb');
const router = express.Router();
require('dotenv').config();

// Test MongoDB connection endpoint
router.get('/test-mongodb', async (req, res) => {
  console.log('Testing MongoDB connection...');
  
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    return res.status(500).json({
      success: false,
      error: 'DATABASE_URL is not defined in .env file'
    });
  }
  
  // Create a new MongoClient with connection options
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000, // 5 second timeout
    socketTimeoutMS: 45000, // 45 second socket timeout
    connectTimeoutMS: 10000, // 10 second connection timeout
  });
  
  try {
    console.log('Attempting to connect to MongoDB...');
    
    // Try to connect
    await client.connect();
    console.log('✅ Successfully connected to MongoDB');
    
    // Test the connection with a ping command
    const pingResult = await client.db().command({ ping: 1 });
    
    // Get database info
    const adminDb = client.db().admin();
    const dbInfo = await adminDb.listDatabases();
    
    // Get the current database name from the connection string
    const dbName = new URL(uri).pathname.substring(1) || 'test';
    const db = client.db(dbName);
    
    // List collections
    const collections = await db.listCollections().toArray();
    
    // Prepare response
    const response = {
      success: true,
      message: 'Successfully connected to MongoDB',
      ping: pingResult,
      database: dbName,
      collections: collections.map(c => c.name),
      stats: {}
    };
    
    // If employees collection exists, get some stats
    if (collections.some(c => c.name === 'employees')) {
      const employeesCount = await db.collection('employees').countDocuments();
      response.stats.employeesCount = employeesCount;
    }
    
    res.json(response);
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    // Prepare error response
    const errorResponse = {
      success: false,
      error: {
        name: error.name,
        message: error.message,
        code: error.code,
        codeName: error.codeName
      }
    };
    
    res.status(500).json(errorResponse);
    
  } finally {
    // Close the connection
    if (client) {
      await client.close().catch(console.error);
      console.log('MongoDB connection closed');
    }
  }
});

module.exports = router;
