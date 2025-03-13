const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const router = express.Router();

router.post("/", (req, res) => {
    const { id, status, role } = req.body;

    if (role !== "Management") {
        return res.status(403).json({ success: false, message: "Access Denied" });
    }

    let tickets = [];
    fs.createReadStream("data/tickets.csv")
        .pipe(csv())
        .on("data", (row) => tickets.push(row))
        .on("end", () => {
            let updated = false;
            tickets = tickets.map((ticket) => {
                if (ticket.id === id) {
                    ticket.status = status;
                    updated = true;
                }
                return ticket;
            });

            if (!updated) return res.status(404).json({ success: false, message: "Ticket not found" });

            const csvContent = tickets.map((t) => Object.values(t).join(",")).join("\n");
            fs.writeFile("data/tickets.csv", csvContent, (err) => {
                if (err) return res.status(500).json({ success: false, message: "Error updating ticket" });

                res.json({ success: true, message: "Ticket updated successfully" });
            });
        });
});

module.exports = router;
