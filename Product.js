import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: String,
  media: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Product', productSchema);