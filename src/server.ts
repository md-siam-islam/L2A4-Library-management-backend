import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
const PORT = process.env.PORT || 5000;
import dotenv from 'dotenv';
dotenv.config();

let server : Server

async function main () {
   
    try{
        await mongoose.connect('mongodb+srv://library-management-backend:fljd1YrupbjMG1RL@cluster0.5b559.mongodb.net/Library-management-backend-A4?retryWrites=true&w=majority&appName=Cluster0')

        server = app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}`)
})
    }catch (error){
        console.log(error);
    }
}

main()