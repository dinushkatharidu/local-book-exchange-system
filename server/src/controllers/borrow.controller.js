import Borrow from "../models/Borrow.js";
import Book from "../models/Book.js";

export async function requestBorrow(req, res) {
  const { bookId } = req.body;
  const book = await Book.findById(bookId);
  if (!book || book.status !== "available")
    return res.status(400).json({ error: "Not available" });
  if (String(book.owner) === req.user.id)
    return res.status(400).json({ error: "Cannot borrow your own book" });
  const borrow = await Borrow.create({
    book: bookId,
    lender: book.owner,
    borrower: req.user.id,
    status: "requested",
  });
  res.json(borrow);
}

export async function approveBorrow(req, res) {
  const { id } = req.params; // borrow id
  const br = await Borrow.findById(id).populate("book");
  if (!br || String(br.lender) !== req.user.id)
    return res.status(403).json({ error: "Not allowed" });
  br.status = "approved";
  await br.save();
  res.json(br);
}

export async function markBorrowed(req, res) {
  const { id } = req.params; // borrow id
  const br = await Borrow.findById(id).populate("book");
  if (!br || String(br.lender) !== req.user.id)
    return res.status(403).json({ error: "Not allowed" });
  br.status = "borrowed";
  br.book.status = "borrowed";
  await br.book.save();
  await br.save();
  res.json(br);
}

export async function markReturned(req, res) {
  const { id } = req.params; // borrow id
  const br = await Borrow.findById(id).populate("book");
  if (!br || !["borrowed", "approved"].includes(br.status))
    return res.status(400).json({ error: "Invalid state" });
  if (String(br.lender) !== req.user.id && String(br.borrower) !== req.user.id)
    return res.status(403).json({ error: "Not allowed" });
  br.status = "returned";
  br.returnedAt = new Date();
  br.book.status = "available";
  await br.book.save();
  await br.save();
  res.json(br);
}

export async function myBorrows(req, res) {
  const data = await Borrow.find({
    $or: [{ borrower: req.user.id }, { lender: req.user.id }],
  })
    .populate("book", "title author")
    .populate("borrower", "name")
    .populate("lender", "name")
    .sort("-requestedAt");
  res.json(data);
}

export async function getBorrowById(req, res) {
  try {
    const borrow = await Borrow.findById(req.params.id)
      .populate("book", "title author")
      .populate("borrower", "name email")
      .populate("lender", "name email");
    
    if (!borrow) {
      return res.status(404).json({ error: "Borrow record not found" });
    }

    // Check if user is part of this transaction
    if (String(borrow.lender._id) !== req.user.id && String(borrow.borrower._id) !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to view this borrow record" });
    }

    res.json(borrow);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch borrow record" });
  }
}

export async function cancelBorrow(req, res) {
  try {
    const { id } = req.params;
    const borrow = await Borrow.findById(id).populate("book");
    
    if (!borrow) {
      return res.status(404).json({ error: "Borrow record not found" });
    }

    // Only borrower can cancel, and only if status is 'requested'
    if (String(borrow.borrower) !== req.user.id) {
      return res.status(403).json({ error: "Only the borrower can cancel the request" });
    }

    if (borrow.status !== "requested") {
      return res.status(400).json({ error: "Can only cancel requests that haven't been approved" });
    }

    borrow.status = "rejected";
    await borrow.save();
    
    res.json(borrow);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to cancel borrow request" });
  }
}

export async function rejectBorrow(req, res) {
  try {
    const { id } = req.params;
    const borrow = await Borrow.findById(id).populate("book");
    
    if (!borrow) {
      return res.status(404).json({ error: "Borrow record not found" });
    }

    // Only lender can reject
    if (String(borrow.lender) !== req.user.id) {
      return res.status(403).json({ error: "Only the lender can reject the request" });
    }

    if (borrow.status !== "requested") {
      return res.status(400).json({ error: "Can only reject pending requests" });
    }

    borrow.status = "rejected";
    await borrow.save();
    
    res.json(borrow);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to reject borrow request" });
  }
}

export async function updateBorrowDueDate(req, res) {
  try {
    const { id } = req.params;
    const { dueAt } = req.body;
    
    if (!dueAt) {
      return res.status(400).json({ error: "Due date is required" });
    }

    const borrow = await Borrow.findById(id);
    
    if (!borrow) {
      return res.status(404).json({ error: "Borrow record not found" });
    }

    // Only lender can update due date
    if (String(borrow.lender) !== req.user.id) {
      return res.status(403).json({ error: "Only the lender can update due date" });
    }

    // Can only update if borrowed
    if (borrow.status !== "borrowed" && borrow.status !== "approved") {
      return res.status(400).json({ error: "Can only update due date for approved or borrowed books" });
    }

    borrow.dueAt = new Date(dueAt);
    await borrow.save();
    
    res.json(borrow);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: "Failed to update due date" });
  }
}

