import Book from '../models/Book.js'; // ← include .js

export const listBooks = async (_req, res) => {
  try {
    const books = await Book.find().populate('owner', 'name email').sort({ createdAt: -1 });
    res.json(books);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to fetch books' });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('owner', 'name email');
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to fetch book' });
  }
};

export const createBook = async (req, res) => {
  try {
    const bookData = {
      ...req.body,
      owner: req.user.id // Set owner from authenticated user
    };
    const book = await Book.create(bookData);
    res.status(201).json(book);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Failed to create book', error: e.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Check ownership
    if (String(book.owner) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to update this book' });
    }

    // Update allowed fields
    const allowedUpdates = ['title', 'author', 'condition', 'location', 'description'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        book[field] = req.body[field];
      }
    });

    await book.save();
    res.json(book);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Failed to update book', error: e.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Check ownership
    if (String(book.owner) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to delete this book' });
    }

    // Check if book is currently borrowed
    if (book.status === 'borrowed') {
      return res.status(400).json({ message: 'Cannot delete a book that is currently borrowed' });
    }

    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to delete book', error: e.message });
  }
};

export const getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(books);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to fetch your books' });
  }
};
