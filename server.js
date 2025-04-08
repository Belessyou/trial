const express = require("express");
const app = express();
const port = 5000;
const users = []; //Temporary inmemory storage
const jwt = require("jsonwebtoken");
const fs = require("fs");
const usersFile = "users.json"; 
require("dotenv").config();
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token." });
        }
        req.user = user;
        next();
    });
};

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to the API!");
});

app.listen(port, () => {
    console.log(`Server is running o '
        
        n port ${port}`);
});

app.post("/signup", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Read existing users from JSON
    fs.readFile(usersFile, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Error reading user data" });
        }

        let users = JSON.parse(data);

        //add new user
        users.push({ username, password });

        //save updated users to users.json
        fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: "Error saving user data" });
            }
            res.status(201).json({ message: "User registered successfully" });
        });
    });
});


app.post("/login", (req, res) => {
    const { username, password } = req.body;

    fs.readFile(usersFile, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Error reading user data" });
        }

        let users = JSON.parse(data);
        const user = users.find(u => u.username === username && u.password === password);

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        //generate JWT
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful", token });
    });
});


app.get("/profile", authenticateToken, (req, res) => {
    res.json({ message: "Welcome to your profile!", user: req.user });
});
//ini contoh pembeda untuk test compar branching dan main.