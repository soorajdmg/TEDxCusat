const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: ['https://tedxcusat-sooraj.onrender.com', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log('Request headers:', req.headers);
  next();
});

// Add this to your server.js file, right after your imports
console.log('🚀 Starting server...');
console.log('MongoDB URI exists:', !!process.env.MONGO_URI);
console.log('MongoDB URI preview:', process.env.MONGO_URI?.substring(0, 20) + '...');

// Replace your current mongoose.connect with this:
const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 20000, // 20 seconds
      maxPoolSize: 5,
      minPoolSize: 1,
    });

    console.log('✅ MongoDB Connected Successfully!');
    console.log('Database:', conn.connection.db.databaseName);
    console.log('Host:', conn.connection.host);
    console.log('Ready State:', conn.connection.readyState);

    // Test a simple operation
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('📚 Available collections:', collections.map(c => c.name));

  } catch (error) {
    console.error('❌ MongoDB Connection Failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);

    // Exit the process if we can't connect to the database
    process.exit(1);
  }
};

// Call the connection function
connectDB();

// Add connection event listeners
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose connected');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Mongoose error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose disconnected');
});

// Add a test route to check database status
app.get('/api/db-status', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const stateNames = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    console.log('DB Status check - Ready State:', dbState, stateNames[dbState]);

    if (dbState === 1) {
      // Try a simple query
      const testQuery = await mongoose.connection.db.admin().ping();
      console.log('DB Ping successful:', testQuery);

      res.json({
        status: 'connected',
        readyState: dbState,
        stateName: stateNames[dbState],
        ping: testQuery
      });
    } else {
      res.status(500).json({
        status: 'not connected',
        readyState: dbState,
        stateName: stateNames[dbState]
      });
    }
  } catch (error) {
    console.error('DB Status error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

const listEndpoints = () => {
  if (!app._router || !app._router.stack) {
    console.log('No routes have been registered yet.');
    return;
  }

  console.log('REGISTERED ROUTES:');
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      console.log(`${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      const path = middleware.regexp.toString().split('?')[0].slice(3, -1);
      console.log(`BASE PATH: ${path}`);

      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          const routePath = handler.route.path;
          const methods = Object.keys(handler.route.methods);
          console.log(`  ${methods} ${routePath}`);
        }
      });
    }
  });
};

app.use('/api/auth', authRoutes);

listEndpoints();

// ❌ REMOVED: Duplicate MongoDB connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => console.log('MongoDB Connected'))
//   .catch(err => console.log(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).send("Route not found");
});