import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/auth.route.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.listen(PORT, async ()=>{
    await connectDB();
    console.log(`Server listening on PORT ${PORT}`);
});