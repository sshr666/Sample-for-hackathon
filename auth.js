const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const USER = require("../models/users");
const router = express.Router();

router.post("/register",
    async (req, res) => {
        try {
            const {username, email, password} = req.body;
            
            const userAlreadyExists = await USER.findOne({email});
            if (userAlreadyExists) return res.status(400).json({
                message: "Account exists already."
            });

            const hashPwd = await bcrypt.hash(password, 10);

            const newuser = new USER(
                {username, email, password: hashPwd}
            );
            await newuser.save();

            res.status(201).json({
                message: "User registered successfully."
            });
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
);

router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await USER.findOne({
            email
        });

        if (!user) {
            return res.status(400).json({
                message: "Email not registered."
            });
        }

        const validPwd = await bcrypt.compare(password, user.password);
        if (!validPwd) {
            return res.status(400).json({
                message: "Incorrect password."
            });
        }

        const accessToken = jwt.sign(
            {
                id: user._id
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m"
            }
        );
        const refreshToken = jwt.sign(
            {
                id: user._id
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Strict",
            maxAge: 1000*60*60*24*7
        });

        res.json({
            accessToken
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router;