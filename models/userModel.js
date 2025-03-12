import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const User = db.define('user', {
    // Model attributes are defined here
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    role: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    }
}, {
    freezeTableName: true
});

export default User;