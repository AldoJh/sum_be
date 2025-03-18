import data from "../models/dataModel.js";
import Sewa from "../models/sewaModel.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import {Op} from "sequelize";

export const createData = async (req, res) => {
    const {id_tiang, nama_penyewa, lama_sewa, satuan_sewa, harga_sewa} = req.body;

    try {
        const datas = await Sewa.create({
            id_tiang,
            nama_penyewa,
            lama_sewa,
            satuan_sewa,
            harga_sewa
        });

        res.status(201).json(datas);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
