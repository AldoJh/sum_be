
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import data from "../models/dataModel.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import {Op} from "sequelize";
import multer from "multer";
import path from "path";
import fs from "fs";
import { promisify } from "util";
import { fileURLToPath } from 'url';
import Sewa from "../models/sewaModel.js";
import db  from "../config/database.js";
import { unlink } from "fs/promises";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

export default upload;
