import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import bookRoutes from './routes/book.routes.js';
import borrowRoutes from './routes/borrow.routes.js';
import messageRoutes from './routes/message.routes.js';


const app = express();
app.use(morgan('dev'));
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrows', borrowRoutes);
app.use('/api/messages', messageRoutes);


app.get('/health', (_,res)=>res.json({ok:true}));
export default app;