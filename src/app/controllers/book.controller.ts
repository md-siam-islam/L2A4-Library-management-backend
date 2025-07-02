import express from "express"
import { Request, Response } from "express";
import Book from "../models/book.model";

export const BookRoute = express.Router()

// get all books
BookRoute.get("/", async ( req: Request , res : Response) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});


BookRoute.post("/", async (req:Request , res:Response) => {

    try {
        const BookData = req.body ; 
        const newBook  = Book.create(BookData)
        res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: newBook,
    });
    } catch (error) {
        res.status(400).json({
      message: 'Validation failed',
      success: false,
      error,
    });
    }
})

// get book by id
BookRoute.get("/:id", async(req:Request , res:Response) => {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);

     res.status(200).json({
        success: true,
        message: "Books retrieved successfully",
        data: book
    })

})