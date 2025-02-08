const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" })); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(err => console.log("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const userModel = mongoose.model("users", userSchema);

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

app.post("/register", async (req, res) => {
    try {
        const { name, password } = req.body;
        if (!name || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const existingUser = await userModel.findOne({ name });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userModel.create({ name, password: hashedPassword });

        res.json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { name, password } = req.body;
        if (!name || !password) {
            return res.status(400).json({ error: "Name and password are required" });
        }

        const user = await userModel.findOne({ name });
        if (!user) return res.status(401).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Incorrect password" });

        const token = generateToken(user._id);

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: false, // Set to true in production
            sameSite: "Strict",
            maxAge: 3600000
        });

        res.json("Success");  
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.get("/auth/me", (req, res) => {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ userId: decoded.userId });
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
});

app.post("/logout", (req, res) => {
    res.cookie("authToken", "", { httpOnly: true, expires: new Date(0) });
    res.json({ message: "Logged out successfully" });
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
