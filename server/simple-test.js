const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testConnection() {
  console.log('Testing MongoDB connection...');
  
  // Log the connection string (with credentials hidden)
  const displayUrl = process.env.DATABASE_URL.replace(
    /mongodb\+srv:\/\/([^:]+):([^@]+)@/, 
    'mongodb+srv://***:***@'
  );
  console.log('Connection string:', displayUrl);
  
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    console.log('Attempting to connect...');
    await client.connect();
    console.log('✅ Successfully connected to MongoDB');
    
    // Test a simple command
    const result = await client.db().command({ ping: 1 });
    console.log('Ping response:', result);
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

testConnection().catch(console.error);
