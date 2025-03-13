const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const router = express.Router();

router.get("/", (req, res) => {
    let tickets = [];

    fs.createReadStream("data/tickets.csv")
        .pipe(csv())
        .on("data", (row) => tickets.push(row))
        .on("end", () => res.json(tickets));
});

module.exports = router;
