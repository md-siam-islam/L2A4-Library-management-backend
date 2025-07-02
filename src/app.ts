import express, { Request, Response } from 'express';
import cors from 'cors';
import { BookRoute } from './app/controllers/book.controller';
import { BorrowRouter } from './app/controllers/borrowBook.controller';
import errorMiddleware from './errorMiddleware';

const app = express();
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/books', BookRoute);
app.use('/api/borrow', BorrowRouter);


app.get('/', (req : Request, res : Response) => {
    res.send('Hello World')
})

// Error handling middleware
app.use(errorMiddleware);

export default app;