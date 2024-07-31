import express from "express";
import cors from 'cors'
import { userRouter } from "./Routes/UserRoute.js";
import { fileUploadRouter } from "./Routes/FileUploadRoute.js";



const app = express()
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT'],
    credentials: true
}))
app.use(express.json());


app.use('/auth', userRouter );
app.use('/', fileUploadRouter );


app.listen(3000, () => {
    console.log("Server is running")
});
