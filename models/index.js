import data from "./dataModel.js";
import Sewa from "./sewaModel.js";

const models = {};

// Menyimpan model ke objek 'models'
models.Data = data;
models.Sewa = Sewa;

// Mendefinisikan asosiasi
data.hasMany(Sewa, {
    foreignKey: "id_tiang",  // Kolom di tabel Sewa yang mengarah ke Data
    sourceKey: "id", // Kolom yang menjadi referensi di Data
    as: "sewa",  // Nama asosiasi jika diperlukan
});

Sewa.belongsTo(data, {
    foreignKey: "id_tiang", // Kolom di tabel Sewa yang mengarah ke Data
    targetKey: "id", // Kolom yang menjadi referensi di Data
});

export default models;
