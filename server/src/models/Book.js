import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    condition: { type: String, enum: ['new', 'good', 'used'], default: 'used' },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    location: { type: String, trim: true },
    description: { type: String, trim: true }
  },
  { timestamps: true }
);

const Book = mongoose.model('Book', bookSchema);
export default Book;
