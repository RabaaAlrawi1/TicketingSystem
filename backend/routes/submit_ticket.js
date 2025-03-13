const express = require("express");
const fs = require("fs");
const router = express.Router();

router.post("/", (req, res) => {
    const { name, issue, priority } = req.body;
    const newTicket = `${Date.now()},${name},${issue},${priority},Open\n`;

    fs.appendFile("data/tickets.csv", newTicket, (err) => {
        if (err) {
            res.status(500).json({ success: false, message: "Error saving ticket" });
        } else {
            res.json({ success: true, message: "Ticket submitted successfully" });
        }
    });
});

module.exports = router;
