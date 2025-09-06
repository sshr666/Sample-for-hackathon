const express = require("express");
const router = express.Router();
const User = require("./../models/users");
const Notes = require("./../models/notes");
const verifyJWT = require("./../middleware/verifyJWT");
const verifyAdmin = require("./../middleware/verifyAdmin");
const { route } = require("./notes");
const { verify } = require("jsonwebtoken");

// get list of all users
router.get("/users", verifyJWT, verifyAdmin, async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// kill a user
router.delete (
    "/user/:id",
    verifyJWT, verifyAdmin,
    async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.json({
                message: "User deleted."
            });
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
);

//get all notes from all users
router.get(
    "/notes",
    verifyJWT, verifyAdmin,
    async (req, res) => {
        try {
            const notes = await Notes.find();
            res.json(notes);
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
);

//make a user admin, and demote
router.put(
    "/users/:id/role",
    verifyJWT, verifyAdmin,
    async (req, res) => {
        try {
            const { role } = req.body;
            if (![0, 1].includes(role)) {
                return res.status(400).json({
                    message: "Invalid role."
                });
            }
            const user = await User.findByIdAndUpdate(
                req.params.id,
                {role},
                {new: true}
            ).select("-password");
            if (!user) {
                return res.status(404).json({
                    message: "User not found."
                });
            }
            res.json({
                message: "Role updated."
            });
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
);

module.exports = router;