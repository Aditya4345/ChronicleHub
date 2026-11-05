const newsRoutes = require('./routes/news');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/news', newsRoutes);

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
// Automatically publish scheduled news every 30 seconds
const publishScheduledNews = async () => {
    try {
        const result = await pool.query(`
            UPDATE news
            SET status = 'published',
                published_at = CURRENT_TIMESTAMP,
                scheduled_at = NULL,
                updated_at = CURRENT_TIMESTAMP
            WHERE status = 'scheduled'
              AND scheduled_at <= CURRENT_TIMESTAMP
            RETURNING id, title
        `);

        if (result.rows.length > 0) {
            console.log('Scheduled news published:', result.rows);
        }
    } catch (error) {
        console.error('Scheduled publishing error:', error);
    }
};

// Check once when the server starts
publishScheduledNews();

// Check every 30 seconds
setInterval(publishScheduledNews, 30000);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`ChronicleHub server running on port ${PORT}`);
});
