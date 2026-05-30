const mongoose = require('mongoose');
const dns = require('dns');

// ─── Override DNS servers ─────────────────────────────────────────────────────
// Fixes ECONNREFUSED on Windows where the default DNS server cannot resolve
// MongoDB Atlas SRV records (_mongodb._tcp.<host>.mongodb.net)
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4, // Force IPv4 — avoids local DNS SRV issues on some Windows configs
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Connection events
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
