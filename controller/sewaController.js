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

