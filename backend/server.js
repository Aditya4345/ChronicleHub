
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/db');

// Import routes
const blogRoutes = require('./routes/blogRoutes');

const app = express();

// Middleware
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

// Blogs API routes
app.use('/api/blogs', blogRoutes);


// ========================================
// AUTOMATIC SCHEDULED BLOG PUBLISHING
// ========================================

const publishScheduledBlogs = async () => {
    try {
        const result = await pool.query(`
            UPDATE blogs
            SET
                status = 'published',
                published_at = CURRENT_TIMESTAMP,
                scheduled_at = NULL,
                updated_at = CURRENT_TIMESTAMP
            WHERE
                status = 'scheduled'
                AND scheduled_at <= CURRENT_TIMESTAMP
            RETURNING id, title
        `);

        if (result.rows.length > 0) {
            result.rows.forEach((blog) => {
                console.log(
                    `Scheduled blog published: ${blog.title} (ID: ${blog.id})`
                );
            });
        }

    } catch (error) {
        console.error(
            'Scheduled blog publishing error:',
            error
        );
    }
};


// Start server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`ChronicleHub server running on port ${PORT}`);

    // Check scheduled blogs immediately when server starts
    publishScheduledBlogs();

    // Check every 60 seconds
    setInterval(publishScheduledBlogs, 60 * 1000);
});
