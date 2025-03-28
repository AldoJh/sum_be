import { Sequelize } from "sequelize";
import db from "../config/database.js";
import data from "./dataModel.js"

const { DataTypes } = Sequelize;

const Sewa = db.define("sewa", {
    id_tiang: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nama_penyewa: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lama_sewa: {
        type: DataTypes.STRING,
        allowNull: false
    },
    satuan_sewa: {
        type: DataTypes.STRING,
        allowNull: true
    },
    harga_sewa: {
        type: DataTypes.STRING,
        allowNull: false
    },
    PPN:{
        type: DataTypes.STRING,
        allowNull: false
    },
    harga_sewa_PPN: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tgl_mulai: {
        type: DataTypes.DATE,
        allowNull: false
    },
    tgl_selesai: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status_sewa: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active"
    }
}, {
    freezeTableName: true
});



export default Sewa;
