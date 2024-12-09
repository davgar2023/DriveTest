const dotenv = require('dotenv');
const mongoose = require('mongoose');
const debug = require('debug')('app:db'); // Namespace for database logs

// get variables to .env
dotenv.config();

// Connect to MongoDB
const connectDB = async () =>{
  debug('Attempting to connect to database...');

  console.log(process.env.MONGO_URI);
  
     mongoose
  .connect(process.env.MONGO_URI, {
   // useNewUrlParser: true,
   // useUnifiedTopology: true,
  })
  .then(() => {console.log('✅ MongoDB connected');  debug('Connected to database successfully.');})
  .catch((err) => {console.error('❌ MongoDB connection error:', err); debug('Database connection failed:', err.message);})
  ;
}

module.exports = connectDB;