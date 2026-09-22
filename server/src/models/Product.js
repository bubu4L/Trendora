import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  oldPrice: Number,
  rating: { type: Number, default: 5 },
  badge: String,
  image: { type: String, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Product', productSchema);