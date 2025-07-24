// Simple script to check environment variables
require('dotenv').config();

console.log('Environment Variables Check:');
console.log('----------------------------');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'Not set'}`);
console.log(`PORT: ${process.env.PORT || 'Not set'}`);
console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? '*** (hidden for security) ***' : 'Not set'}`);
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? '*** (hidden for security) ***' : 'Not set'}`);

// Check if .env file is being read
console.log('\nChecking .env file location:');
const path = require('path');
const fs = require('fs');
const envPath = path.join(__dirname, '.env');
console.log(`Looking for .env at: ${envPath}`);
console.log(`File exists: ${fs.existsSync(envPath) ? '✅ Yes' : '❌ No'}`);

if (fs.existsSync(envPath)) {
  console.log('\nContents of .env (first 3 lines):');
  const content = fs.readFileSync(envPath, 'utf8').split('\n').slice(0, 3);
  console.log(content.join('\n'));
  console.log('...');
}
