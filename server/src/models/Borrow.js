import mongoose from "mongoose";
const borrowSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  lender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["requested", "approved", "borrowed", "returned", "rejected"],
    default: "requested",
  },
  requestedAt: { type: Date, default: Date.now },
  dueAt: Date,
  returnedAt: Date,
});
export default mongoose.model("Borrow", borrowSchema);
