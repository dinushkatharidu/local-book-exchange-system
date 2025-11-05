import Borrow from '../models/Borrow.js';
import Book from '../models/Book.js';


export async function requestBorrow(req,res){
const { bookId } = req.body;
const book = await Book.findById(bookId);
if(!book || book.status !== 'available') return res.status(400).json({error:'Not available'});
if(String(book.owner) === req.user.id) return res.status(400).json({error:'Cannot borrow your own book'});
const borrow = await Borrow.create({ book: bookId, lender: book.owner, borrower: req.user.id, status:'requested' });
res.json(borrow);
}


export async function approveBorrow(req,res){
const { id } = req.params; // borrow id
const br = await Borrow.findById(id).populate('book');
if(!br || String(br.lender) !== req.user.id) return res.status(403).json({error:'Not allowed'});
br.status = 'approved';
await br.save();
res.json(br);
}


export async function markBorrowed(req,res){
const { id } = req.params; // borrow id
const br = await Borrow.findById(id).populate('book');
if(!br || String(br.lender) !== req.user.id) return res.status(403).json({error:'Not allowed'});
br.status = 'borrowed';
br.book.status = 'borrowed';
await br.book.save();
await br.save();
res.json(br);
}


export async function markReturned(req,res){
const { id } = req.params; // borrow id
const br = await Borrow.findById(id).populate('book');
if(!br || !['borrowed','approved'].includes(br.status)) return res.status(400).json({error:'Invalid state'});
if(String(br.lender) !== req.user.id && String(br.borrower) !== req.user.id) return res.status(403).json({error:'Not allowed'});
br.status = 'returned';
br.returnedAt = new Date();
br.book.status = 'available';
await br.book.save();
await br.save();
res.json(br);
}


export async function myBorrows(req,res){
const data = await Borrow.find({ $or: [{ borrower:req.user.id }, { lender:req.user.id }] })
.populate('book','title author')
.populate('borrower','name')
.populate('lender','name')
.sort('-requestedAt');
res.json(data);
}