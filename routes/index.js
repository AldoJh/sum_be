import express from "express";
import {createUser, loginUser, logoutUser} from "../controller/userController.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Welcome to the API");
    });

router.post("/register", createUser);
router.post("/login", loginUser);
router.delete("/logout", logoutUser);

export default router;