import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
router.put('/profile', protect, [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please enter a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const allowedUpdates = [
      'firstName', 'lastName', 'email', 'phone', 
      'address', 'city', 'state', 'zipCode', 'country'
    ];
    
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Check if email is being updated and if it's already taken
    if (updates.email && updates.email !== req.user.email) {
      const existingUser = await User.findOne({ email: updates.email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already in use'
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

// @desc    Add product to recently viewed
// @route   POST /api/user/recently-viewed
// @access  Private
router.post('/recently-viewed', protect, async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const user = await User.findById(req.user._id);
    
    // Remove if already exists
    user.recentlyViewed = user.recentlyViewed.filter(
      item => item.product.toString() !== productId
    );

    // Add to beginning
    user.recentlyViewed.unshift({
      product: productId,
      viewedAt: new Date()
    });

    // Keep only last 10 items
    user.recentlyViewed = user.recentlyViewed.slice(0, 10);

    await user.save();

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding to recently viewed'
    });
  }
});

// @desc    Get recently viewed products
// @route   GET /api/user/recently-viewed
// @access  Private
router.get('/recently-viewed', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('recentlyViewed.product', 'title artist price images category')
      .exec();

    const recentlyViewed = user.recentlyViewed
      .filter(item => item.product) // Filter out deleted products
      .map(item => item.product);

    res.json(recentlyViewed);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recently viewed products'
    });
  }
});

// @desc    Clear recently viewed
// @route   DELETE /api/user/recently-viewed
// @access  Private
router.delete('/recently-viewed', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { recentlyViewed: [] }
    );

    res.json({
      success: true,
      message: 'Recently viewed cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing recently viewed'
    });
  }
});

export default router;