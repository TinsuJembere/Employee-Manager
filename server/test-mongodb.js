const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testConnection() {
  console.log('Attempting to connect to MongoDB...');
  console.log('Connection string:', process.env.DATABASE_URL.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
  
  let client;
  
  try {
    // Create a new MongoClient
    client = new MongoClient(process.env.DATABASE_URL);
    
    // Connect to the MongoDB cluster
    await client.connect();
    console.log('✅ Successfully connected to MongoDB');
    
    // List all databases
    const adminDb = client.db().admin();
    const databases = await adminDb.listDatabases();
    console.log('\nAvailable databases:');
    databases.databases.forEach(db => console.log(`- ${db.name}`));
    
    // Get the current database
    const db = client.db();
    console.log('\nCurrent database:', db.databaseName);
    
    // List collections in the current database
    try {
      const collections = await db.listCollections().toArray();
      console.log('\nCollections in current database:');
      collections.forEach(collection => console.log(`- ${collection.name}`));
      
      // Try to find some employees
      if (collections.some(c => c.name === 'employees')) {
        const employees = await db.collection('employees').find({}).limit(2).toArray();
        console.log('\nSample employees:', JSON.stringify(employees, null, 2));
      } else {
        console.log('\n⚠️ "employees" collection not found in the database');
      }
    } catch (err) {
      console.error('\nError accessing database:', err);
    }
    
  } catch (error) {
    console.error('\n❌ MongoDB connection error:', error.name);
    console.error('Error message:', error.message);
    
    // More detailed error information
    if (error.name === 'MongoServerError') {
      console.log('\nMongoDB Server Error Details:');
      console.log('- Error Code:', error.code);
      console.log('- Error Code Name:', error.codeName);
    }
    
    // Check if it's a network-related error
    if (error.name === 'MongoNetworkError') {
      console.log('\nNetwork-related error detected. Please check:');
      console.log('1. Is your internet connection working?');
      console.log('2. Is the MongoDB server running and accessible?');
      console.log('3. Is there a firewall blocking the connection?');
      console.log('4. If using MongoDB Atlas, is your IP whitelisted?');
    }
    
    // Check if it's an authentication error
    if (error.code === 18 || error.codeName === 'AuthenticationFailed') {
      console.log('\nAuthentication failed. Please check:');
      console.log('1. Is the username and password correct?');
      console.log('2. Does the user have the correct permissions?');
    }
    
  } finally {
    // Close the connection
    if (client) {
      await client.close();
      console.log('\nConnection closed');
    }
  }
}

// Run the test
testConnection().catch(console.error);
