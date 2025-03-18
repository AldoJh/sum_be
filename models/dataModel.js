import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const data = db.define('data', {
    // Model attributes are defined here
    kode_tiang: {
        type: DataTypes.STRING,
        allowNull: false
    },
    jenis_lampu: {
        type: DataTypes.STRING,
        allowNull:false
    },
    gambar: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lat:{
        type: DataTypes.STRING,
        allowNull: false
    },
    long:{
        type: DataTypes.STRING,
        allowNull: false
    },
    jumlah_kendaraan:{
        type: DataTypes.STRING,
        allowNull: false
    },
    provinsi:{
        type: DataTypes.STRING,
        allowNull: false
    },
    kabupaten:{
        type: DataTypes.STRING,
        allowNull: false
    },
    kota:{
        type: DataTypes.STRING,
        allowNull: true
    },
    nama_jalan:{   
        type: DataTypes.STRING,
        allowNull: false
    },
    ukuran:{
        type: DataTypes.STRING,
        allowNull: false
    },
    sisi:{
        type: DataTypes.STRING,
        allowNull: false
    },
    jenis:{
        type: DataTypes.STRING,
        allowNull: false
    },
    nama_pemilik:{
        type: DataTypes.STRING,
        allowNull: false
    },
    status_sewa:{
        type: DataTypes.STRING,
        defaultValue: "available"
    }
}, {
    freezeTableName: true
});

export default data;