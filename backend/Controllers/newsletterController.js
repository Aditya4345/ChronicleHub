const pool = require('../config/db');

// CREATE NEWSLETTER
const createNewsletter = async (req, res) => {
    try {
        const { title, subject, content, category, status } = req.body;

        if (!title || !subject || !content) {
            return res.status(400).json({
                success: false,
                message: 'Title, subject and content are required'
            });
        }

        const newsletterStatus = status || 'draft';

        if (!['draft', 'published'].includes(newsletterStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid newsletter status'
            });
        }

        const result = await pool.query(
            `INSERT INTO newsletters
            (title, subject, content, category, status)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [title, subject, content, category || null, newsletterStatus]
        );

        res.status(201).json({
            success: true,
            message: 'Newsletter created successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Failed to create newsletter'
        });
    }
};


// GET ALL NEWSLETTERS
const getAllNewsletters = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM newsletters ORDER BY created_at DESC'
        );

        res.status(200).json({
            success: true,
            data: result.rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Failed to fetch newsletters'
        });
    }
};


// GET NEWSLETTER BY ID
const getNewsletterById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid newsletter ID'
            });
        }

        const result = await pool.query(
            'SELECT * FROM newsletters WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Newsletter not found'
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Failed to fetch newsletter'
        });
    }
};


// UPDATE NEWSLETTER
const updateNewsletter = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subject, content, category, status } = req.body;

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid newsletter ID'
            });
        }

        if (!title || !subject || !content) {
            return res.status(400).json({
                success: false,
                message: 'Title, subject and content are required'
            });
        }

        if (status && !['draft', 'published'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid newsletter status'
            });
        }

        const result = await pool.query(
            `UPDATE newsletters
             SET title = $1,
                 subject = $2,
                 content = $3,
                 category = $4,
                 status = COALESCE($5, status),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $6
             RETURNING *`,
            [title, subject, content, category || null, status || null, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Newsletter not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Newsletter updated successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Failed to update newsletter'
        });
    }
};


// DELETE NEWSLETTER
const deleteNewsletter = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid newsletter ID'
            });
        }

        const result = await pool.query(
            'DELETE FROM newsletters WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Newsletter not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Newsletter deleted successfully'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Failed to delete newsletter'
        });
    }
};


// PUBLISH NEWSLETTER
const publishNewsletter = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid newsletter ID'
            });
        }

        const result = await pool.query(
            `UPDATE newsletters
             SET status = 'published',
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Newsletter not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Newsletter published successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Failed to publish newsletter'
        });
    }
};


// EXPORT ALL FUNCTIONS
module.exports = {
    createNewsletter,
    getAllNewsletters,
    getNewsletterById,
    updateNewsletter,
    deleteNewsletter,
    publishNewsletter
};