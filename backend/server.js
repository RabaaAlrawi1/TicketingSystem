const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../'));  // Serve static files like index.html

// Load users from users.txt
const loadUsers = () => {
    const usersData = fs.readFileSync(__dirname + '/users.txt', 'utf8');
    return usersData.split('\n').map(line => {
        const [username, password] = line.trim().split(':');
        return { username, password };
    });
};

// Login Route
app.post('/backend/login', (req, res) => {
    const { username, password } = req.body;
    const users = loadUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
