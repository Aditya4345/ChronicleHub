const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/db');

// Import Routes
const newsletterRoutes = require('./routes/newsletterRoutes');
const subscriberRoutes = require('./routes/subscriberRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Welcome Route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to ChronicleHub API'
    });
});

// PostgreSQL Connection Test
app.get('/api/db-test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');

        res.status(200).json({
            success: true,
            message: 'Database connected successfully',
            time: result.rows[0].now
        });

    } catch (error) {
        console.error('Database error:', error);

        res.status(500).json({
            success: false,
            message: 'Database connection failed'
        });
    }
});

// Newsletter Routes
app.use('/api/newsletters', newsletterRoutes);

// Subscriber Routes
app.use('/api/subscribers', subscriberRoutes);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`ChronicleHub server running on port ${PORT}`);
});