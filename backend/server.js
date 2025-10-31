import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoutes.js';
import resultRouter from './routes/resultRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();
// Define a simple route
app.use('/api/auth', userRouter);
app.use('/api/results', resultRouter);
app.get('/', (req, res) => {
  res.send('hello')
})

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on  http://localhost:${PORT}`);
});
