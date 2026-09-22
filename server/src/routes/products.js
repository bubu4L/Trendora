import express from 'express';
import Product from '../models/Product.js';
import { memoryProducts } from '../server.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { category, search } = req.query;
  try {
    if (Product.db.readyState === 1) {
      const filter = {};
      if (category && category !== 'All') filter.category = category;
      if (search) filter.name = { $regex: search, $options: 'i' };
      const products = await Product.find(filter).sort({ createdAt: -1 });
      return res.json({ products });
    }
  } catch (_) {}
  let products = [...memoryProducts];
  if (category && category !== 'All') products = products.filter(p => p.category === category);
  if (search) products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  res.json({ products });
});

router.get('/categories', async (_, res) => {
  res.json({ categories: ['Fashion','Accessories','Footwear','Home','Lifestyle'] });
});

router.get('/:id', async (req, res) => {
  try {
    if (Product.db.readyState === 1) {
      const product = await Product.findById(req.params.id);
      if (product) return res.json(product);
    }
  } catch (_) {}
  const product = memoryProducts.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

router.post('/', async (req, res) => {
  if (Product.db.readyState !== 1) return res.status(503).json({ message: 'Connect MongoDB before creating persistent products.' });
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

router.put('/:id', async (req, res) => {
  if (Product.db.readyState !== 1) return res.status(503).json({ message: 'Connect MongoDB before updating persistent products.' });
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

router.delete('/:id', async (req, res) => {
  if (Product.db.readyState !== 1) return res.status(503).json({ message: 'Connect MongoDB before deleting persistent products.' });
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
});

export default router;