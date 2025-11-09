import Book from '../models/Book.js';
import Borrow from '../models/Borrow.js';

export async function checkBookOwnership(req, res, next) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    if (String(book.owner) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to perform this action on this book' });
    }
    
    req.book = book;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to verify ownership' });
  }
}

export async function checkBorrowAccess(req, res, next) {
  try {
    const borrow = await Borrow.findById(req.params.id).populate('book');
    if (!borrow) {
      return res.status(404).json({ message: 'Borrow record not found' });
    }
    
    const isLender = String(borrow.lender) === String(req.user.id);
    const isBorrower = String(borrow.borrower) === String(req.user.id);
    
    if (!isLender && !isBorrower) {
      return res.status(403).json({ message: 'Not authorized to access this borrow record' });
    }
    
    req.borrow = borrow;
    req.isLender = isLender;
    req.isBorrower = isBorrower;
    next();
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to verify access' });
  }
}
