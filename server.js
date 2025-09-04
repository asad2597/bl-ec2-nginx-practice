require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise"); // ✅ promise-based client

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ MySQL connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,     // or your RDS/private IP if using RDS
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.use(cors());
app.use(bodyParser.json());

// Get all items
app.get("/api/items", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM items");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Add item
app.post("/api/items", async (req, res) => {
  try {
    const { name, description } = req.body;
    const [result] = await pool.query(
      "INSERT INTO items (name, description) VALUES (?, ?)",
      [name, description]
    );
    res.json({ message: "Item added", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
