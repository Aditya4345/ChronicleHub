
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// Welcome route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to ChronicleHub API'
    });
});

// PostgreSQL connection test
app.get('/api/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');

        res.json({
            message: 'Database connected successfully',
            time: result.rows[0].now
        });
    } catch (error) {
        console.error('Database error:', error);

        res.status(500).json({
            message: 'Database connection failed'
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`ChronicleHub server running on port ${PORT}`);
});
