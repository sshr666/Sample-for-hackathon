const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoutes = require("../routes/auth");
const notesRouter = require("../routes/notes");
const adminRoutes = require("./../routes/admin");

const app  = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
));

mongoose.connect(process.env.MONGO_URI)
.then(
    () => console.log("mongodb connected")
).catch (
    err => console.error(err)
);

app.get("/",
    (req, res) => {
        res.send("server running");
    }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});

app.use("/auth", authRoutes);
app.use("/notes", notesRouter);
app.use("/admin", adminRoutes);