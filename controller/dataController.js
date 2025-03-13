import data from "../models/dataModel.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

export const createData = async (req, res) => {
    const { kode_tiang, jenis_lampu, gambar, lat, long, jumlah_kendaraan, provinsi, kabupaten, kota, nama_jalan, ukuran, sisi, jenis, nama_pemilik, status_sewa, nama_penyewa, lama_sewa, satuan_sewa,harga} = req.body;
    try {
        const datas = await data.create({ kode_tiang, jenis_lampu, gambar, lat, long, jumlah_kendaraan, provinsi, kabupaten, kota, nama_jalan, ukuran, sisi, jenis, nama_pemilik, status_sewa, nama_penyewa, lama_sewa, satuan_sewa,harga});
        res.json(datas);
    } catch (error) {
        res.json({ error: error.message });
    }
}
