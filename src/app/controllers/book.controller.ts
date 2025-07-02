import express ,{ Request, Response } from 'express'; 
import Book from "../models/book.model";
import { IBook } from "../interface/book.interface";

import { Router } from "express";

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

// Book details post
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

// Book delete 

BookRoute.delete("/:id" , async(req: Request , res:Response)=> {
    const bookId = req.params.id;
    const deleteBook = await Book.findByIdAndDelete(bookId);
    // if (!deleteBook) {
    //     return res.status(404).json({ message: "Book not found" });
    // }
    res.status(200).json({
        success: true,
        message: "Book deleted successfully",
        data: deleteBook
    });
})

// Book update
// BookRoute.put('/:id', async (req:Request , res :Response) => {
    
//     try {
//     const bookId = req.params.id ;
//     const {title, author, genre, isbn, description, copies} = req.body;

//         const book = await Book.findById(bookId);

//         if (!book) {
//             return res.status(404).json({ message: "Book not found" });
//         }

//         book.title = title || book.title;
//         book.author = author || book.author;
//         book.genre = genre || book.genre;
//         book.isbn = isbn || book.isbn;
//         book.description = description || book.description;
//         book.copies = copies || book.copies;
//         book.available = book.copies > 0;

//        const updatedBook = await book.save();

//         res.status(200).json({
//             success: true,
//             message: "Book updated successfully",
//             data: updatedBook
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Error updating book",
//             error
//         });
//     }
// });

BookRoute.put('/:id', async (req: Request, res: Response) => {
  try {
    const bookId = req.params.id;
    const { title, author, genre, isbn, description, copies } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.genre = genre || book.genre;
    book.isbn = isbn || book.isbn;
    book.description = description || book.description;
    book.copies = copies || book.copies;
    book.available = book.copies > 0;

    const updatedBook = await book.save();

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: updatedBook
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
});
