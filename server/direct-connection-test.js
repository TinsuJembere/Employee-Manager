const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testConnection() {
  console.log('Starting MongoDB connection test...');
  
  // Get the connection string from environment variables
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    console.error('❌ ERROR: DATABASE_URL is not defined in .env file');
    return;
  }
  
  // Log a masked version of the connection string (hides credentials)
  const maskedUri = uri.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://***:***@');
  console.log(`Connecting to: ${maskedUri}`);
  
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
    console.log('Ping result:', pingResult);
    
    // List databases
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    console.log('\nAvailable databases:');
    dbs.databases.forEach(db => console.log(`- ${db.name}`));
    
    // Get the current database name from the connection string
    const dbName = new URL(uri).pathname.substring(1) || 'test';
    console.log(`\nUsing database: ${dbName}`);
    
    // List collections in the current database
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    console.log('\nCollections in current database:');
    collections.forEach(collection => console.log(`- ${collection.name}`));
    
    // Try to find some employees if the collection exists
    if (collections.some(c => c.name === 'employees')) {
      console.log('\nFetching sample employees...');
      const employees = await db.collection('employees').find({}).limit(2).toArray();
      console.log('Sample employees:', JSON.stringify(employees, null, 2));
    } else {
      console.log('\n⚠️ "employees" collection not found in the database');
    }
    
  } catch (error) {
    console.error('\n❌ MongoDB connection error:', error.name);
    console.error('Error message:', error.message);
    
    // Detailed error information
    if (error.name === 'MongoServerError') {
      console.log('\nMongoDB Server Error Details:');
      console.log('- Error Code:', error.code);
      console.log('- Error Code Name:', error.codeName);
      console.log('- Error Message:', error.errmsg);
    }
    
    // Network-related errors
    if (error.name === 'MongoNetworkError') {
      console.log('\nNetwork-related error detected. Please check:');
      console.log('1. Is your internet connection working?');
      console.log('2. Is the MongoDB server running and accessible?');
      console.log('3. Is MongoDB Atlas IP whitelist configured correctly?');
      console.log('4. Is there a firewall or proxy blocking the connection?');
    }
    
    // Authentication errors
    if (error.code === 18 || error.codeName === 'AuthenticationFailed') {
      console.log('\nAuthentication failed. Please check:');
      console.log('1. Is the username and password correct?');
      console.log('2. Does the user have the correct permissions?');
      console.log('3. Is the authentication database correct?');
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
