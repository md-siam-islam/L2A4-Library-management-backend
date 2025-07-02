import express from 'express';
import { Request, Response , Router} from 'express';
import Book from '../models/book.model';
import Borrow from '../models/borrow.model';


export const BorrowRouter = express.Router()


BorrowRouter.post('/' , async(req:Request , res:Response) => {
    
    try {
        const { bookId, quantity, dueDate } = req.body;

        const book = await Book.findById(bookId)

    if (!book) {
        return res.status(404).json({
            message: 'Book not found',
            success: false
        })
    }

    if(quantity > book.copies){
        return res.status(400).json({
            message: 'Insufficient copies available',
            success: false
        })
    }
    const newBorrow = new Borrow({
    ...Book.schema.obj, // Spread the book schema to include all fields
      book: bookId,
      quantity,
      dueDate: new Date(dueDate)
    });

    book.copies -= quantity
    book.available = book.copies > 0;

    await newBorrow.save();
    await book.save();

    res.status(201).json({
        message : "Book borrowed successfully",
        success : true,
        data : newBorrow
    })

    } catch (error) {
        res.status(500).json({
            message: 'Error borrowing book',
            success: false,
            error
        })
        
    }
})