import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    condition: { type: String, enum: ['new', 'good', 'used'], default: 'used' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: ['available', 'borrowed'], default: 'available' }
  },
  { timestamps: true }
);

const Book = mongoose.model('Book', bookSchema);
export default Book;
