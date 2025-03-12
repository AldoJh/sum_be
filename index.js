import express from 'express';
import db from './config/database.js';
import User from './models/userModel.js';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

// 🔹 Gunakan origin yang spesifik
app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost"],  
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// **Pastikan middleware CORS dipasang sebelum router**
app.use(router);

try {
  await db.authenticate();
  console.log('✅ Database Connected Successfully');
  await User.sync();
} catch (error) {
  console.error('❌ Database Connection Failed:', error);
}

app.listen(3000, () => {
  console.log('🚀 Server is running on port 3000');
});
