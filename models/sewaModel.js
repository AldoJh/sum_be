import { Sequelize } from "sequelize";
import db from "../config/database.js";
import data from "./dataModel.js"

const { DataTypes } = Sequelize;

const Sewa = db.define("sewa", {
    id_tiang: {
        type: DataTypes.STRING,
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
    }
}, {
    freezeTableName: true
});



export default Sewa;
