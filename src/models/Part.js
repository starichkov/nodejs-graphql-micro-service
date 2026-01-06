import mongoose from 'mongoose';

/**
 * Mongoose Schema for the Part model (Computer Parts).
 * This represents a product in our computer parts shop.
 */
const partSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name for the part'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Please specify a category (e.g., CPU, GPU, RAM)'],
    enum: [
      'CPU',
      'GPU',
      'RAM',
      'Motherboard',
      'Storage',
      'Power Supply',
      'Case',
      'Cooling',
      'Peripherals',
    ],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative'],
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Part = mongoose.model('Part', partSchema);

export default Part;
