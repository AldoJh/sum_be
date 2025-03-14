import express from 'express';
import db from './config/database.js';
import User from './models/userModel.js';
import data from './models/dataModel.js';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

const app = express();
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// 🔹 Gunakan origin yang spesifik
app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost", "http://localhost:5500"],  
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());
app.use(express.json());

// **Pastikan middleware CORS dipasang sebelum router**
app.use(router);

try {
  await db.authenticate();
  console.log('✅ Database Connected Successfully');
  await db.sync();
} catch (error) {
  console.error('❌ Database Connection Failed:', error);
}

app.listen(3000, () => {
  console.log('🚀 Server is running on port 3000');
});
