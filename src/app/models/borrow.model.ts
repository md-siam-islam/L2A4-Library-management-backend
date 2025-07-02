import mongoose, { Document, Schema, Model } from 'mongoose';
import { IBorrow } from '../interface/borrow.interface';


// Define the Borrow schema
const BorrowSchema: Schema = new Schema(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book reference is required'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
      validate: {
        validator: function (value: Date) {
          // Due date must be in the future
          return value > new Date();
        },
        message: 'Due date must be in the future',
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add a virtual field to populate book details
BorrowSchema.virtual('bookDetails', {
  ref: 'Book',
  localField: 'book',
  foreignField: '_id',
  justOne: true,
});

// Pre-save hook to validate book availability
BorrowSchema.pre<IBorrow>('save', async function (next) {
  try {
    const book = await mongoose.model('Book').findById(this.book);
    
    if (!book) {
      throw new Error('Book not found');
    }

    if (this.quantity > book.copies) {
      throw new Error('Not enough copies available');
    }

    next();
  } catch (error: any) {
    next(error);
  }
});

// Post-save hook to update book copies
BorrowSchema.post<IBorrow>('save', async function (doc) {
  try {
    await mongoose.model('Book').findByIdAndUpdate(
      doc.book,
      { $inc: { copies: -doc.quantity } },
      { new: true }
    );
  } catch (error) {
    console.error('Error updating book copies:', error);
  }
});

// Create and export the Borrow model
const Borrow: Model<IBorrow> = mongoose.model<IBorrow>('Borrow', BorrowSchema);

export default Borrow;