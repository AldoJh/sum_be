import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";

export const createUser = async (req, res) => {
    const { email, password,role } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ email, password: hashedPassword, role });
        res.json(user);
    } catch (error) {
        res.json({ error: error.message });
    }
}

export const loginUser = async (req, res) => {
    try {

        // 2. Ambil email dan password dari request body
        const { email, password } = req.body;

        // 3. Cari user berdasarkan email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // 4. Bandingkan password yang diinput dengan password di database
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid Password" });
        }

        // 5. Update status user menjadi 1 setelah berhasil login
        await User.update({ status: 1 }, { where: { email } });

        // 6. Hapus password sebelum menyimpan data user di cookie
        const { password: _, ...userData } = user.get({ plain: true });

        // 7. Set cookie dengan informasi user
        res.cookie("user", userData, {
            httpOnly: true, // Cookie tidak bisa diakses dari JavaScript (lebih aman)
            secure: false,  // Ubah menjadi true jika menggunakan HTTPS
            sameSite: "Lax" // Pastikan cookie dikirim dalam request yang sesuai
        });

        // 8. Kirim respons dengan data user
        res.status(200).json({ message: "Login successful", user: userData });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const logoutUser = async (req, res) => {
    try {
        // 1. Cek apakah cookie "user" sudah ada
        if (!req.cookies.user) {
            return res.status(200).json({ message: "Not logged in" });
        }

        // 2. Ambil email dari data user yang tersimpan di cookie
        const { email } = req.cookies.user;

        // 3. Update status user menjadi 0 setelah berhasil logout
        await User.update({ status: 0 }, { where: { email } });

        // 4. Hapus cookie "user"
        res.clearCookie("user");

        // 5. Kirim respons
        res.status(200).json({ message: "Logout successful" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

