
const pool = require('../config/db');

// 1. Get all blogs for Admin Management
const getAllBlogs = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                b.id,
                b.title,
                b.content,
                b.featured_image,
                b.author_id,
                b.status,
                b.published_at,
                b.created_at,
                b.updated_at,
                u.full_name AS author_name
            FROM blogs b
            LEFT JOIN users u ON b.author_id = u.id
            ORDER BY b.created_at DESC
        `);

        res.status(200).json({
            success: true,
            blogs: result.rows
        });
    } catch (error) {
        console.error('Get blogs error:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to fetch blogs.'
        });
    }
};

// 2. Get only published blogs for public website
const getPublishedBlogs = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                b.id,
                b.title,
                b.content,
                b.featured_image,
                b.published_at,
                u.full_name AS author_name
            FROM blogs b
            LEFT JOIN users u ON b.author_id = u.id
            WHERE b.status = 'published'
            ORDER BY b.published_at DESC NULLS LAST
        `);

        res.status(200).json({
            success: true,
            blogs: result.rows
        });
    } catch (error) {
        console.error('Get published blogs error:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to fetch published blogs.'
        });
    }
};

// 3. Get one blog by ID
const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid blog ID.'
            });
        }

        const result = await pool.query(`
            SELECT
                b.id,
                b.title,
                b.content,
                b.featured_image,
                b.author_id,
                b.status,
                b.published_at,
                b.created_at,
                b.updated_at,
                u.full_name AS author_name
            FROM blogs b
            LEFT JOIN users u ON b.author_id = u.id
            WHERE b.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found.'
            });
        }

        res.status(200).json({
            success: true,
            blog: result.rows[0]
        });
    } catch (error) {
        console.error('Get blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to fetch blog.'
        });
    }
};

// 4. Create a new blog
const createBlog = async (req, res) => {
    try {
        const {
            title,
            content,
            featured_image,
            author_id,
            status
        } = req.body;

        if (!title || !title.trim() || !content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Blog title and content are required.'
            });
        }

        const blogStatus = status || 'draft';

        if (!['draft', 'published'].includes(blogStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Status must be draft or published.'
            });
        }

        const result = await pool.query(`
            INSERT INTO blogs (
                title,
                content,
                featured_image,
                author_id,
                status,
                published_at,
                updated_at
            )
            VALUES ($1, $2, $3, $4, $5,
                CASE WHEN $5 = 'published' THEN CURRENT_TIMESTAMP ELSE NULL END,
                CURRENT_TIMESTAMP
            )
            RETURNING *
        `, [
            title.trim(),
            content.trim(),
            featured_image || null,
            author_id || null,
            blogStatus
        ]);

        res.status(201).json({
            success: true,
            message: 'Blog created successfully.',
            blog: result.rows[0]
        });
    } catch (error) {
        console.error('Create blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to create blog.'
        });
    }
};

// 5. Update an existing blog
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            content,
            featured_image,
            author_id,
            status
        } = req.body;

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid blog ID.'
            });
        }

        if (!title || !title.trim() || !content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Blog title and content are required.'
            });
        }

        if (!['draft', 'published'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status must be draft or published.'
            });
        }

        const result = await pool.query(`
            UPDATE blogs
            SET
                title = $1,
                content = $2,
                featured_image = $3,
                author_id = $4,
                status = $5,
                published_at = CASE
                    WHEN $5 = 'draft' THEN NULL
                    WHEN published_at IS NULL THEN CURRENT_TIMESTAMP
                    ELSE published_at
                END,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $6
            RETURNING *
        `, [
            title.trim(),
            content.trim(),
            featured_image || null,
            author_id || null,
            status,
            id
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Blog updated successfully.',
            blog: result.rows[0]
        });
    } catch (error) {
        console.error('Update blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to update blog.'
        });
    }
};

// 6. Delete a blog
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid blog ID.'
            });
        }

        const result = await pool.query(
            'DELETE FROM blogs WHERE id = $1 RETURNING id',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Blog deleted successfully.'
        });
    } catch (error) {
        console.error('Delete blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to delete blog.'
        });
    }
};

module.exports = {
    getAllBlogs,
    getPublishedBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog
};
