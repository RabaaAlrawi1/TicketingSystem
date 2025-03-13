const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

console.log("✅ Express server is starting...");

// Middleware to Log Every Request
app.use((req, res, next) => {
    console.log(`🔵 Received request: ${req.method} ${req.url}`);
    next();
});

// ✅ Add a simple test route
app.get("/", (req, res) => {
    console.log("✅ GET / route hit!");
    res.send("Hello, Express is working!");
});

// Import routes
const loginRoute = require("./routes/login");
app.use("/api/login", loginRoute);

const PORT = 4000;
const HOST = "0.0.0.0"; // ✅ Bind to all interfaces

app.listen(PORT, HOST, () => console.log(`✅ Server running on http://${HOST}:${PORT}`));
