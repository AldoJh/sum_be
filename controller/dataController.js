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


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// const fileFilter = (req, file, cb) => {
//     const fileTypes = /jpeg|jpg|png|gif/;
//     const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = fileTypes.test(file.mimetype);

//     if (mimetype && extname) {
//         return cb(null, true);
//     } else {
//         cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
//     }
// };

// const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter,
//     limits: { fileSize: 6 * 1024 * 1024 } 
// }).single('gambar');

export const createData = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        // Ambil data dari body dan file
        const { kode_tiang, jenis_lampu, lat, long, jumlah_kendaraan, provinsi, kabupaten, kota, nama_jalan, ukuran, sisi, jenis, nama_pemilik, status_sewa, nama_penyewa, lama_sewa, satuan_sewa, harga } = req.body;
        const gambar = req.file ? req.file.filename : ''; // Jika ada gambar, simpan nama file

        try {
            // Simpan data ke database
            const datas = await data.create({
                kode_tiang,
                jenis_lampu,
                gambar, // Nama file gambar yang disimpan
                lat,
                long,
                jumlah_kendaraan,
                provinsi,
                kabupaten,
                kota,
                nama_jalan,
                ukuran,
                sisi,
                jenis,
                nama_pemilik,
                status_sewa
            });

            res.json(datas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};
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
const unlinkAsync = promisify(fs.unlink);
//upload gambar
// Konfigurasi multer untuk menyimpan gambar
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/'); // Folder untuk menyimpan gambar
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Menyimpan dengan ekstensi asli
        const filename = Date.now() + ext; // Nama file unik berdasarkan timestamp
        cb(null, filename);
    }
});

const upload = multer({ storage: storage, limits: { fileSize: 6 * 1024 * 1024 } });

// Endpoint untuk menerima gambar
export const uploadImage = upload.single('gambar'); 
// Fungsi untuk mengedit data
export const editData = async (req, res) => {
    const { id } = req.params;
    const {
        kode_tiang, jenis_lampu, lat, long, jumlah_kendaraan, provinsi,
        kabupaten, kota, nama_jalan, ukuran, sisi, jenis, nama_pemilik, status_sewa
    } = req.body;

    try {
        const dataToUpdate = await data.findByPk(id);
        if (!dataToUpdate) {
            return res.status(404).json({ message: `Data dengan ID: ${id} tidak ditemukan` });
        }

        const updatedData = {
            kode_tiang, jenis_lampu, lat, long, jumlah_kendaraan, provinsi,
            kabupaten, kota, nama_jalan, ukuran, sisi, jenis, nama_pemilik, status_sewa
        };

        // Update data tanpa gambar
        const [updated] = await data.update(updatedData, { where: { id } });
        if (updated === 0) {
            return res.status(400).json({ message: "Gagal mengupdate data" });
        }

        res.json({ message: "Data berhasil diperbarui", updatedData });

    } catch (error) {
        console.error("Error saat mengupdate data:", error);
        res.status(500).json({ error: error.message });
    }
};

// Endpoint untuk memperbarui URL gambar di database
export const updateImageUrl = async (req, res) => {
    const { id } = req.params;
    const { filename } = req.file;

    try {
        // Perbarui database dengan URL gambar
        const updatedData = await data.update(
            { gambar: filename }, // Menyimpan nama file gambar
            { where: { id } }
        );

        if (updatedData[0] === 0) {
            return res.status(400).json({ message: "Gagal mengupdate gambar" });
        }

        res.json({ message: "Gambar berhasil diperbarui", filename });
    } catch (error) {
        console.error('Error saat mengupdate gambar:', error);
        res.status(500).json({ error: error.message });
    }
};



export const searchData = async (req, res) => {
    const { search } = req.params;  // Ambil search term dari URL params

    try {
        // Pencarian data berdasarkan beberapa kolom dan mengikutkan data dari model 'Sewa'
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
                    { status_sewa: { [Op.like]: `%${search}%` } }
                ]
            },
            include: {
                model: Sewa,
                as: 'sewa',  // Menyertakan relasi dengan model 'Sewa'
                required: false  // Memastikan data tetap muncul meski tidak ada data sewa
            }
        });

        // Jika tidak ada data ditemukan berdasarkan kata kunci pencarian
        if (datas.length === 0) {
            return res.status(404).json({ message: `No data found for search: ${search}` });
        }

        // Mengembalikan data yang ditemukan beserta data terkait dari model 'Sewa'
        res.json(datas);
    } catch (error) {
        res.status(500).json({ error: error.message });  // Menangani error jika terjadi
    }
};

// Fungsi untuk menghapus data
export const deleteData = async (req, res) => {
    const { id } = req.params;

    try {
        const dataToDelete = await data.findByPk(id);

        if (!dataToDelete) {
            return res.status(404).json({ message: `Data dengan ID: ${id} tidak ditemukan` });
        }

        // Hapus file gambar dari sistem file
        const filePath = path.join(__dirname, "../uploads/", dataToDelete.gambar);
        try {
            await unlinkAsync(filePath);
        } catch (err) {
            console.error("Gagal menghapus gambar:", err.message);
        }

        // Hapus data dari database
        await data.destroy({ where: { id } });

        res.json({ message: "Data berhasil dihapus" });
    } catch (error) {
        console.error("Error saat menghapus data:", error);
        res.status(500).json({ error: error.message });
    }
};


export const updateSewaStatus = async () => {
    try {
      // Mendapatkan data yang sudah disewa
      const dataSewa = await data.findAll({
        where: {
          status_sewa: 'rented', // Mencari data yang sedang disewa
        },
        include: {
          model: Sewa,
          required: true, // Hanya data yang memiliki sewa
          attributes: ['id', 'id_tiang', 'lama_sewa', 'satuan_sewa', 'updatedAt'],
        },
      });
  
      // Memeriksa setiap data yang disewa
      for (let item of dataSewa) {
        const sewa = item.sewa[0]; // Mengambil data sewa pertama (karena hanya ada satu)
  
        // Menghitung tanggal akhir sewa berdasarkan lama_sewa dan satuan_sewa
        const lamaSewa = parseInt(sewa.lama_sewa);
        const satuanSewa = sewa.satuan_sewa;
        let expiredDate;
  
        if (satuanSewa === 'bulan') {
          expiredDate = new Date(sewa.updatedAt);
          expiredDate.setMonth(expiredDate.getMonth() + lamaSewa); // Menambah bulan
        } else if (satuanSewa === 'hari') {
          expiredDate = new Date(sewa.updatedAt);
          expiredDate.setDate(expiredDate.getDate() + lamaSewa); // Menambah hari
        } else if (satuanSewa === 'tahun') {
          expiredDate = new Date(sewa.updatedAt);
          expiredDate.setFullYear(expiredDate.getFullYear() + lamaSewa); // Menambah tahun
        }
  
        // Mengecek apakah tanggal sekarang lebih besar atau sama dengan tanggal berakhir
        if (new Date() >= expiredDate) {
          // Jika sudah habis, update status ke "available"
          await data.update({ status_sewa: 'available' }, { where: { id: item.id } });
          console.log(`Status sewa untuk tiang ${item.kode_tiang} telah diperbarui ke 'available'.`);
        }
      }
    } catch (error) {
      console.error('Error saat memperbarui status sewa:', error.message);
    }
  };
  