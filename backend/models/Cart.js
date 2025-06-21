import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  }
}, {
  _id: false
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0
  },
  totalItems: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate totals before saving
cartSchema.pre('save', async function(next) {
  if (this.items.length === 0) {
    this.totalAmount = 0;
    this.totalItems = 0;
    return next();
  }

  // Populate products to calculate total
  await this.populate('items.product');
  
  this.totalAmount = this.items.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
  
  this.totalItems = this.items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
  
  next();
});

export default mongoose.model('Cart', cartSchema);