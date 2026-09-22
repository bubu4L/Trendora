import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import authRoutes from './routes/authRoutes.js';

// Load Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health Check Route
app.get('/api/health', (_, res) => 
  res.json({ ok: true, service: 'Trendora API', timestamp: new Date().toISOString() })
);

// Root Route
app.get('/', (req, res) => {
  res.json({ message: 'Trendora API is running' });
});

// Fallback Data Catalog
export const memoryProducts = [
  { id: 'p1', name: 'Aster Knit Set', category: 'Fashion', price: 68000, oldPrice: 82000, rating: 4.9, badge: 'Bestseller', image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=85', description: 'A relaxed knit co-ord designed for effortless everyday styling.' },
  { id: 'p2', name: 'Noir Mini Bag', category: 'Accessories', price: 54000, rating: 4.8, badge: 'New', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85', description: 'A compact statement bag with a clean silhouette and premium finish.' },
  { id: 'p3', name: 'Sculpt Candle', category: 'Lifestyle', price: 29000, oldPrice: 35000, rating: 4.7, badge: 'Trending', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=85', description: 'A sculptural candle made to bring a warm, modern mood to your space.' },
  { id: 'p4', name: 'Everyday Runner', category: 'Footwear', price: 75000, rating: 4.9, badge: 'Popular', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85', description: 'Lightweight everyday sneakers built around comfort and clean street style.' }
];

// Start Server & DB Connection
async function start() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (mongoUri) {
      await mongoose.connect(mongoUri);
      console.log('Successfully connected to MongoDB Atlas!');
    } else {
      console.log('No MONGODB_URI supplied — using memory catalog');
    }
  } catch (error) {
    console.error('MongoDB connection error — using memory catalog:', error.message);
  }

  app.listen(PORT, () => {
    console.log(`Trendora API running on http://localhost:${PORT}`);
  });
}

start();