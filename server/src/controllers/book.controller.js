import Book from '../models/Book.js'; // ← include .js

export const listBooks = async (_req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to fetch books' });
  }
};

export const createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: 'Failed to create book', error: e.message });
  }
};
