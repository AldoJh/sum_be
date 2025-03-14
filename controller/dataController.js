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

// Fungsi untuk mengambil data berdasarkan kategori
export const getDataByCategory = async (req, res) => {
    const { category } = req.params; 

    try {
        const datas = await data.findAll({ where: { jenis: category } });

        if (datas.length === 0) {
            return res.status(404).json({ message: `No data found for category: ${category}` });
        }

        res.json(datas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fungsi untuk mengambil semua data
export const getAllData = async (req, res) => {
    try {
        const datas = await data.findAll();
        res.json(datas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fungsi untuk mengambil data berdasarkan ID
export const getDataById = async (req, res) => {
    const { id } = req.params;

    try {
        const datas = await data.findByPk(id);

        if (!datas) {
            return res.status(404).json({ message: `No data found with ID: ${id}` });
        }

        res.json(datas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//edit data
export const editData = async (req, res) => {
    const { kode_tiang, jenis_lampu, gambar, lat, long, jumlah_kendaraan, provinsi, kabupaten, kota, nama_jalan, ukuran, sisi, jenis, nama_pemilik, status_sewa, nama_penyewa, lama_sewa, satuan_sewa,harga } = req.body;
    const { id } = req.params;

    try {
        const datas = await data.update({ kode_tiang, jenis_lampu, gambar, lat, long, jumlah_kendaraan, provinsi, kabupaten, kota, nama_jalan, ukuran, sisi, jenis, nama_pemilik, status_sewa, nama_penyewa, lama_sewa, satuan_sewa,harga }, { where: { id } });
        res.json("data updated");
    } catch (error) {
        res.json({ error: error.message });
    }
}
