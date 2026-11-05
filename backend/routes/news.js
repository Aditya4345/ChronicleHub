
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// GET all news
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM news ORDER BY created_at DESC'
        );

        res.json({ success: true, news: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch news' });
    }
});

// POST - Upload news image to Cloudinary
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please select an image'
            });
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'chroniclehub/news',
                resource_type: 'image'
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Image upload failed'
                    });
                }

                res.json({
                    success: true,
                    message: 'Image uploaded successfully',
                    imageUrl: result.secure_url
                });
            }
        );

        Readable.from(req.file.buffer).pipe(uploadStream);

    } catch (error) {
        console.error('Image upload error:', error);

        res.status(500).json({
            success: false,
            message: 'Image upload failed'
        });
    }
});
// GET news by ID
router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM news WHERE id = $1',
            [req.params.id]
        );

        if (!result.rows.length) {
            return res.status(404).json({
                success: false,
                message: 'News not found'
            });
        }

        res.json({ success: true, news: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch news' });
    }
});

// POST - Add news
router.post('/', async (req, res) => {
    try {
        const {
            title, summary, content, featured_image,
            author_id, scheduled_at
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: 'News title is required'
            });
        }

        if (scheduled_at &&
            (!Number.isFinite(Date.parse(scheduled_at)) ||
             new Date(scheduled_at).getTime() <= Date.now())) {
            return res.status(400).json({
                success: false,
                message: 'Please select a future date and time'
            });
        }

        const status = scheduled_at ? 'scheduled' : 'draft';

        const result = await pool.query(
            `INSERT INTO news
            (title, summary, content, featured_image, author_id, status, scheduled_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [
                title.trim(),
                summary || null,
                content || null,
                featured_image || null,
                author_id || null,
                status,
                scheduled_at || null
            ]
        );

        res.status(201).json({
            success: true,
            message: scheduled_at
                ? 'News scheduled successfully'
                : 'News added successfully',
            news: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to add news'
        });
    }
});

// PUT - Update news
router.put('/:id', async (req, res) => {
    try {
        const {
            title, summary, content, featured_image, status, scheduled_at
        } = req.body;

        const hasSchedule = Object.prototype.hasOwnProperty.call(
            req.body, 'scheduled_at'
        );

        if (scheduled_at &&
            (!Number.isFinite(Date.parse(scheduled_at)) ||
             new Date(scheduled_at).getTime() <= Date.now())) {
            return res.status(400).json({
                success: false,
                message: 'Please select a future date and time'
            });
        }

        const result = await pool.query(
            `UPDATE news
             SET title = COALESCE($1, title),
                 summary = COALESCE($2, summary),
                 content = COALESCE($3, content),
                 featured_image = COALESCE($4, featured_image),
                 status = CASE
                     WHEN $6::boolean AND $7::timestamptz IS NOT NULL
                     THEN 'scheduled'
                     WHEN $6::boolean
                     THEN COALESCE($5, 'draft')
                     ELSE COALESCE($5, status)
                 END,
                 scheduled_at = CASE
                     WHEN $6::boolean THEN $7::timestamptz
                     ELSE scheduled_at
                 END,
                 published_at = CASE
                     WHEN $6::boolean THEN NULL
                     ELSE published_at
                 END,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $8
             RETURNING *`,
            [
                title, summary, content, featured_image,
                status, hasSchedule, scheduled_at || null, req.params.id
            ]
        );

        if (!result.rows.length) {
            return res.status(404).json({
                success: false,
                message: 'News not found'
            });
        }

        res.json({
            success: true,
            message: 'News updated successfully',
            news: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to update news'
        });
    }
});

 // DELETE - Remove news
router.delete('/:id', async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM news WHERE id = $1 RETURNING *',
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'News not found'
            });
        }

        res.json({
            success: true,
            message: 'News deleted successfully'
        });

    } catch (error) {
        console.error('Delete news error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to delete news'
        });
    }
});


// PATCH - Publish or save news as draft

router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        if (!['draft', 'published'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status must be draft or published'
            });
        }

        const result = await pool.query(
            `UPDATE news
             SET status = $1::varchar,
                 published_at = CASE
                     WHEN $1::varchar = 'published'
                     THEN CURRENT_TIMESTAMP
                     ELSE NULL
                 END,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING *`,
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'News not found'
            });
        }

        res.json({
            success: true,
            message: status === 'published'
                ? 'News published successfully'
                : 'News saved as draft successfully',
            news: result.rows[0]
        });

    } catch (error) {
        console.error('Update status error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to update news status'
        });
    }
});




module.exports = router;
