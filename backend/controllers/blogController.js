
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
                b.scheduled_at,
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
                b.scheduled_at,
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
            status,
            scheduled_at
        } = req.body;

        // Validate required fields
        if (
            typeof title !== 'string' ||
            !title.trim() ||
            typeof content !== 'string' ||
            !content.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: 'Blog title and content are required.'
            });
        }

        const blogStatus = status || 'draft';

        // Validate status
        if (!['draft', 'published', 'scheduled'].includes(blogStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid blog status.'
            });
        }

        let scheduleDate = null;

        // Validate scheduled date
        if (blogStatus === 'scheduled') {
            if (
                !scheduled_at ||
                !Number.isFinite(Date.parse(scheduled_at))
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Please select a valid scheduled date and time.'
                });
            }

            scheduleDate = new Date(scheduled_at);

            if (scheduleDate <= new Date()) {
                return res.status(400).json({
                    success: false,
                    message: 'Scheduled date and time must be in the future.'
                });
            }
        }

        const result = await pool.query(`
            INSERT INTO blogs (
                title,
                content,
                featured_image,
                author_id,
                status,
                published_at,
                scheduled_at,
                updated_at
            )
            VALUES (
                $1,
                $2,
                $3,
                $4,
                $5::varchar,
                CASE
                    WHEN $5::varchar = 'published'
                    THEN CURRENT_TIMESTAMP
                    ELSE NULL
                END,
                CASE
                    WHEN $5::varchar = 'scheduled'
                    THEN $6::timestamptz
                    ELSE NULL
                END,
                CURRENT_TIMESTAMP
            )
            RETURNING *
        `, [
            title.trim(),
            content.trim(),
            featured_image || null,
            author_id || null,
            blogStatus,
            scheduleDate
        ]);

        res.status(201).json({
            success: true,
            message: blogStatus === 'scheduled'
                ? 'Blog scheduled successfully.'
                : 'Blog created successfully.',
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
            status,
            scheduled_at
        } = req.body;

        // Validate blog ID
        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid blog ID.'
            });
        }

        // Validate required fields
        if (
            typeof title !== 'string' ||
            !title.trim() ||
            typeof content !== 'string' ||
            !content.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: 'Blog title and content are required.'
            });
        }

        // Validate status
        if (!['draft', 'published', 'scheduled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid blog status.'
            });
        }

        let scheduleDate = null;

        // Validate scheduled date
        if (status === 'scheduled') {
            if (
                !scheduled_at ||
                !Number.isFinite(Date.parse(scheduled_at))
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Please select a valid scheduled date and time.'
                });
            }

            scheduleDate = new Date(scheduled_at);

            if (scheduleDate <= new Date()) {
                return res.status(400).json({
                    success: false,
                    message: 'Scheduled date and time must be in the future.'
                });
            }
        }

        const result = await pool.query(`
            UPDATE blogs
            SET
                title = $1,
                content = $2,
                featured_image = $3,
                author_id = $4,
                status = $5::varchar,

                published_at = CASE
                    WHEN $5::varchar IN ('draft', 'scheduled')
                    THEN NULL
                    WHEN published_at IS NULL
                    THEN CURRENT_TIMESTAMP
                    ELSE published_at
                END,

                scheduled_at = CASE
                    WHEN $5::varchar = 'scheduled'
                    THEN $6::timestamptz
                    ELSE NULL
                END,

                updated_at = CURRENT_TIMESTAMP

            WHERE id = $7
            RETURNING *
        `, [
            title.trim(),
            content.trim(),
            featured_image || null,
            author_id || null,
            status,
            scheduleDate,
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
            message: status === 'scheduled'
                ? 'Blog schedule updated successfully.'
                : 'Blog updated successfully.',
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


// Export all controller functions
module.exports = {
    getAllBlogs,
    getPublishedBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog
};
