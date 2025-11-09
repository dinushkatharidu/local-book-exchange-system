import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Book from '../models/Book.js';
import Borrow from '../models/Borrow.js';

export const getAllUsers = async (_req, res) => {
  try {
    const users = await User.find().select('_id name email role createdAt');
    res.json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('_id name email role createdAt');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update allowed fields
    const allowedUpdates = ['name', 'email'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // Handle password change separately
    if (req.body.password) {
      user.passwordHash = await bcrypt.hash(req.body.password, 10);
    }

    await user.save();
    
    // Return user without password hash
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };
    
    res.json(userResponse);
  } catch (e) {
    console.error(e);
    if (e.code === 11000) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    res.status(400).json({ message: 'Failed to update profile', error: e.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if user has any active borrows
    const activeBorrows = await Borrow.find({
      $or: [{ borrower: userId }, { lender: userId }],
      status: { $in: ['requested', 'approved', 'borrowed'] }
    });

    if (activeBorrows.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete account with active borrow transactions. Please complete or cancel them first.' 
      });
    }

    // Update books owned by user to mark them as deleted or transfer ownership
    // For now, we'll just delete the books that aren't borrowed
    await Book.deleteMany({ owner: userId, status: 'available' });

    // Delete the user
    await User.findByIdAndDelete(userId);
    
    res.json({ message: 'Account deleted successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to delete account', error: e.message });
  }
};
