const mongoose = require('mongoose');

class Database {
  constructor() {
    this.connection = null;
    this.isConnected = false;
  }

  async connect(uri, options = {}) {
    try {
      const defaultOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferMaxEntries: 0,
        bufferCommands: false,
        ...options
      };

      console.log('Connecting to MongoDB...');

      this.connection = await mongoose.connect(uri, defaultOptions);
      this.isConnected = true;

      console.log('MongoDB connected successfully');

      mongoose.connection.on('error', this.handleError.bind(this));
      mongoose.connection.on('disconnected', this.handleDisconnect.bind(this));
      mongoose.connection.on('reconnected', this.handleReconnect.bind(this));

      process.on('SIGINT', this.gracefulShutdown.bind(this));
      process.on('SIGTERM', this.gracefulShutdown.bind(this));

      return this.connection;
    } catch (error) {
      console.error('MongoDB connection error:', error.message);
      this.isConnected = false;
      throw error;
    }
  }

  handleError(error) {
    console.error('MongoDB error:', error);
    this.isConnected = false;
  }

  handleDisconnect() {
    console.warn('MongoDB disconnected');
    this.isConnected = false;
  }

  handleReconnect() {
    console.log('MongoDB reconnected');
    this.isConnected = true;
  }

  async gracefulShutdown() {
    console.log('Closing MongoDB connection...');
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
      process.exit(0);
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
      process.exit(1);
    }
  }

  async disconnect() {
    if (this.isConnected) {
      await mongoose.connection.close();
      this.isConnected = false;
      console.log('✅ MongoDB disconnected');
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    };
  }
}

module.exports = new Database();