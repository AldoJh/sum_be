import data from "../models/dataModel.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import {Op} from "sequelize";

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
        res.json("data updated dengan jumlah" + datas + "data");
    } catch (error) {
        res.json({ error: error.message });
    }
}

//search data by all column
export const searchData = async (req, res) => {
    const { search } = req.params;

    try {
        const datas = await data.findAll({
            where: {
                [Op.or]: [
                    { kode_tiang: { [Op.like]: `%${search}%` } },
                    { jenis_lampu: { [Op.like]: `%${search}%` } },
                    { gambar: { [Op.like]: `%${search}%` } },
                    { lat: { [Op.like]: `%${search}%` } },
                    { long: { [Op.like]: `%${search}%` } },
                    { jumlah_kendaraan: { [Op.like]: `%${search}%` } },
                    { provinsi: { [Op.like]: `%${search}%` } },
                    { kabupaten: { [Op.like]: `%${search}%` } },
                    { kota: { [Op.like]: `%${search}%` } },
                    { nama_jalan: { [Op.like]: `%${search}%` } },
                    { ukuran: { [Op.like]: `%${search}%` } },
                    { sisi: { [Op.like]: `%${search}%` } },
                    { jenis: { [Op.like]: `%${search}%` } },
                    { nama_pemilik: { [Op.like]: `%${search}%` } },
                    { status_sewa: { [Op.like]: `%${search}%` } },
                    { nama_penyewa: { [Op.like]: `%${search}%` } },
                    { lama_sewa: { [Op.like]: `%${search}%` } },
                    { satuan_sewa: { [Op.like]: `%${search}%` } },
                    { harga: { [Op.like]: `%${search}%` } }

                ]
            }
        });

        if (datas.length === 0) {
            return res.status(404).json({ message: `No data found for search: ${search}` });
        }

        res.json(datas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}