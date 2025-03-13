const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
    console.log("🔵 Login API hit!");
    console.log("Received data:", req.body); // Log received JSON data

    res.json({ success: true, message: "Login API is working!" });
});

module.exports = router;
