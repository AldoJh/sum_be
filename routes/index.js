import express from "express";
import {createUser, loginUser, logoutUser} from "../controller/userController.js";
import {createData, getAllData, editData, searchData, deleteData} from "../controller/dataController.js";
import{addSewa, getSewabydata, getSewaById, getAllDataSewa, getDataByCategory, getallById, editSewa, deleteSewa}from "../controller/sewaController.js";
import upload from '../middleware/upload.js';


const router = express.Router();

router.get("/", (req, res) => {
    res.send("Welcome to the API");
    });

router.post("/register", createUser);
router.post("/login", loginUser);
router.delete("/logout", logoutUser);
router.post("/data", createData);
router.get('/data/:category', getDataByCategory);
router.get('/data', getAllData);
router.get('/data/id/:id', getallById);
router.put('/data/id/:id', editData);
router.post('/data/search/:search', searchData);
router.delete('/data/id/:id', deleteData);
router.post('/sewa', addSewa);
router.get('/sewa/:id', getSewaById);
router.get('/all', getAllDataSewa);
router.put('/sewa/:id', editSewa);
router.delete('/sewa/:id', deleteSewa);
export default router;