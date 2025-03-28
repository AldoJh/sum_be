import { Sequelize } from "sequelize";
import db from "../config/database.js";
import data from "./dataModel.js"

const { DataTypes } = Sequelize;
const ppn = db.define("ppn", {
    ppn:{
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true
});

export default ppn;