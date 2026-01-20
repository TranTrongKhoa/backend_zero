const express = require('express');
const mysql = require('mysql2');
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(express.json());
const hostname = '127.0.0.1';
const port = 3001;

app.use(cors()); // Sử dụng CORS để cho phép truy cập từ frontend
/**
 * Kết nối MySQL
 */
const db = mysql.createConnection({
    host: 'localhost',
    user: 'khoa',
    password: '1234',
    database: 'btmc'
});

db.connect((err) => {
    if (err) {
        console.error('❌ MySQL connection error:', err);
        return;
    }
    console.log('✅ Connected to MySQL');
});

/**
 * Route test
 */
app.get('/', (req, res) => {
    res.send('Hello World \n Tran Trong Khoa');
});

/**
 * API: lấy danh sách gold
 */
app.get('/gold', (req, res) => {
    const sql = 'SELECT * FROM gold';

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }

        res.json({
            success: true,
            data: results
        });
    });
});

/**
 * API: thêm gold mới
 */
app.post('/addGold', (req, res) => {
    const { count, purchasePrice } = req.body;

    // Validate đơn giản
    if (count == null || purchasePrice == null) {
        return res.status(400).json({
            success: false,
            message: 'count và purchasePrice là bắt buộc'
        });
    }

    const sql = `
        INSERT INTO gold (count, purchasePrice)
        VALUES (?, ?)
    `;

    db.query(sql, [count, purchasePrice], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: 'Database error'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Insert success',
            insertedId: result.insertId
        });
    });
});

app.get("/fetchBtmc", async (req, res) => {
    try {
        // Tải HTML từ url
        const response = await axios.get("https://btmc.vn/", { timeout: 10000 });
        const html = response.data;

        // Parse HTML bằng cheerio
        const $ = cheerio.load(html);

        const raw = $(".bd_price_home tr:nth-child(2) td:nth-child(4) b").text();
        const firstValue = raw.trim().split(/\s+/)[0];
        const firstNumber = parseInt(firstValue, 10);
        res.json({ buy: firstNumber, sell: (firstNumber + 300) });
    } catch (error) {
        res.status(500).json({ error: "Không thể lấy dữ liệu", details: error.message });
    }
});

app.listen(port, hostname, () => {
    console.log(`🚀 Server running at http://${hostname}:${port}/`);
});
