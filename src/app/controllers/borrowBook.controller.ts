import express, { Request, Response } from 'express';
import Book from '../models/book.model';
import Borrow from '../models/borrow.model';


const BorrowRouter = express.Router();


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

    const date = new Date(req.body.dueDate)

    if(date < new Date) {
         return res.status(400).json({ message: "Due date must be in the future" });
    }
    const newBorrow = new Borrow({
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


BorrowRouter.get('/summary' , async(req:Request , res: Response) => {
    const borrowsummary = await Borrow.aggregate([
        {
            $group: {
                _id: "$book",
                totalBorrowed: { $sum: "$quantity" },
                totalUsers: { $addToSet: "$user" },
                firstDueDate: { $first: "$dueDate" }
            }
        },
        {
            $lookup: {
                from: "books",
                localField: "_id",
                foreignField: "_id",
                as: "bookDetails"
            }
        },
        {
            $unwind: "$bookDetails"
        },
        {
            $project: {
                _id: 0,
                title: "$bookDetails.title",
                author: "$bookDetails.author",
                totalBorrowed: 1,
                totalUsers: { $size: "$totalUsers" },
                dueDate: "$firstDueDate"
            
            }
        }
    ]);

    res.status(200).json({
        message: 'Borrow summary retrieved successfully',
        success: true,
        data: borrowsummary
    });
});

export default BorrowRouter;