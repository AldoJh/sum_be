import data from "../models/dataModel.js";
import Sewa from "../models/sewaModel.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import {Op} from "sequelize";
import models from "../models/index.js";


//get data sewa berdasarkan id_tiang
export const getSewabydata = async (req, res) => {
    const {id_tiang} = req.params;

    try{
        const data_tiang = await data.findAll({where:{id : id_tiang}})
        if(data_tiang.status_sewa == "available"){
            const sewa = await Sewa.findOne({ where: { id_tiang: id_tiang } });
            if (!sewa) {
                return res.status(404).json({ message: `No data found for id_tiang: ${id_tiang}` });
            }else{
                return res.status(200).json(sewa);
            }
        }

    }catch(error){
        res.status(500).json({error:error.message});
    }
}

//tambah data sewa jika status sewa available
export const addSewa = async (req, res) => {
    const {id_tiang, nama_penyewa, lama_sewa, satuan_sewa, harga_sewa} = req.body;

    try{
        const data_tiang = await data.findOne({where:{id : id_tiang}})
        if(data_tiang.status_sewa == "available"){
            const sewa = await Sewa.create({
                id_tiang,
                nama_penyewa,
                lama_sewa,
                satuan_sewa,
                harga_sewa
            });
            const update_tiang = await data.update({status_sewa: "rented"},{where:{id : id_tiang}});
            res.status(201).json({message: "Tiang berhasil disewa", sewa});
        }else{
            res.status(400).json({message: "Tiang sudah disewa"});
        }
    }catch(error){
        res.status(500).json({error:error.message});
    }
}

//update data sewa berdasarkan id_tiang
export const updateSewa = async (req, res) => {
    const {id_tiang} = req.params;
    const {nama_penyewa, lama_sewa, satuan_sewa, harga_sewa} = req.body;

    try{
        const data_tiang = await data.findOne({where:{id : id_tiang}})
        if(data_tiang.status_sewa == "available"){
            return res.status(400).json({message: "Tiang belum disewa"});
        }else{
            const sewa = await Sewa.update({
                nama_penyewa,
                lama_sewa,
                satuan_sewa,
                harga_sewa
            },{where: {id_tiang: id_tiang}});
            res.status(200).json(sewa);
        }
    }catch(error){
        res.status(500).json({error:error.message});
    }
}

//get data sewa by id
export const getSewaById = async (req, res) => {
    const {id} = req.params;

    try{
        const sewa = await Sewa.findOne({where:{id : id}});
        if(!sewa){
            return res.status(404).json({message: `No data found for id: ${id}`});
        }
        res.status(200).json(sewa);
    }catch(error){
        res.status(500).json({error:error.message});
    }
}

// Mengambil semua data dan relasi sewa jika ada
export const getAllDataSewa = async (req, res) => {
    try {
        const tiang = await data.findAll({
            include: {
                model: Sewa,
                as: "sewa",
                required: false, // This ensures we still get `data` even if there’s no `sewa`
                where: {
                    // This condition will filter out the sewa data when the status_sewa is 'available'
                    '$data.status_sewa$': { [Op.ne]: 'available' }
                }
            },
        });
        res.json(tiang);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getDataByCategory = async (req, res) => {
    const { category } = req.params; 

    try {
        // Fetch data where jenis matches the category and status_sewa is not 'available'
        const datas = await data.findAll({
            where: {
                jenis: category, // Filter by category
                '$data.status_sewa$': { [Op.ne]: 'available' } // Filter out 'available' status_sewa
            },
            include: {
                model: Sewa,
                as: 'sewa', // Including the related Sewa model
                required: false // Ensures data is returned even if there's no matching 'sewa'
            }
        });

        // Check if no data is found for the given category
        if (datas.length === 0) {
            return res.status(404).json({ message: `No data found for category: ${category}` });
        }

        // Return the data if found
        res.json(datas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getallById = async (req, res) => {
    const { id } = req.params; 

    try {
        // Ambil data yang id-nya sesuai, status_sewa tidak null, dan tidak kosong
        const datas = await data.findAll({
            where: {
                id: id, // Filter berdasarkan id
                status_sewa: {
                    [Op.ne]: null, // Pastikan status_sewa tidak null
                    [Op.ne]: '' // Pastikan status_sewa tidak kosong
                }
            },
            include: {
                model: Sewa,
                as: 'sewa', // Menyertakan model Sewa yang terkait
                required: false // Agar data tetap ditampilkan meskipun tidak ada relasi 'sewa'
            }
        });

        // Jika tidak ada data yang ditemukan berdasarkan id
        if (datas.length === 0) {
            return res.status(404).json({ message: `Tidak ada data ditemukan untuk id: ${id}` });
        }

        // Mengirimkan data yang ditemukan
        res.json(datas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//edit data sewa
export const editSewa = async (req, res) => {
    const { id } = req.params;
    const { nama_penyewa, lama_sewa, satuan_sewa, harga_sewa, status_sewa } = req.body;

    try {
        // Cari data sewa berdasarkan id_tiang
        const sewa = await Sewa.findOne({ where: { id_tiang : id } });

        // Jika data sewa tidak ditemukan
        if (!sewa) {
            return res.status(404).json({ message: `Tidak ada data ditemukan untuk id: ${id}` });
        }

        // Update data sewa
        const updatedSewa = await sewa.update({
            nama_penyewa,
            lama_sewa,
            satuan_sewa,
            harga_sewa
        });

        const updateData = await data.update({status_sewa: status_sewa},{where:{id : sewa.id_tiang}});

        // Mengirimkan data yang telah diupdate
        res.json(updatedSewa);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};