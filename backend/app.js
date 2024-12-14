const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');
const reportRoutes = require('./routes/reports');
const roleRoutes = require('./routes/roles');
const rtpRoutes = require('./routes/rtp');
const connectDB = require('./config/db');

connectDB();

// Import error handling middleware
const errorHandler = require('./middleware/errorHandler');

// Create Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/rtp',rtpRoutes);
// Error Handling Middleware (should be after all routes)
app.use(errorHandler);

// Export the app for use in server.js or testing
module.exports = app;
