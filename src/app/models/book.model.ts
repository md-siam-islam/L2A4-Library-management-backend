import mongoose, {Schema } from 'mongoose';
import { IBook } from '../interface/book.interface';

const BookSchema = new mongoose.Schema ({
title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  description: { type: String },
  copies: { type: Number, required: true, min: 0 },
  available: { type: Boolean, default: true }
})

const Book = mongoose.model<IBook>('Book', BookSchema);

export default Book;