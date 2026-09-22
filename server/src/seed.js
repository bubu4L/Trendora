import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
dotenv.config();

const products = [
  {name:'Aster Knit Set',category:'Fashion',price:68000,oldPrice:82000,rating:4.9,badge:'Bestseller',image:'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=85',description:'A relaxed knit co-ord designed for effortless everyday styling.'},
  {name:'Noir Mini Bag',category:'Accessories',price:54000,rating:4.8,badge:'New',image:'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85',description:'A compact statement bag with a clean silhouette and premium finish.'},
  {name:'Sculpt Candle',category:'Lifestyle',price:29000,oldPrice:35000,rating:4.7,badge:'Trending',image:'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=85',description:'A sculptural candle made to bring a warm, modern mood to your space.'},
  {name:'Everyday Runner',category:'Footwear',price:75000,rating:4.9,badge:'Popular',image:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85',description:'Lightweight everyday sneakers built around comfort and clean street style.'},
  {name:'Luna Sunglasses',category:'Accessories',price:32000,oldPrice:39000,rating:4.6,badge:'20% Off',image:'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85',description:'Minimal sunglasses with a timeless frame for everyday looks.'},
  {name:'Cloud Lounge Chair',category:'Home',price:165000,rating:4.8,badge:"Editor's Pick",image:'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=85',description:'A soft, sculptural lounge chair that makes a quiet statement.'}
];

await mongoose.connect(process.env.MONGODB_URI);
await Product.deleteMany({});
await Product.insertMany(products);
console.log('Trendora products seeded');
await mongoose.disconnect();