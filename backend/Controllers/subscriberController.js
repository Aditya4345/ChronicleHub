const pool = require('../config/db');

// 1. Add New Subscriber
const createSubscriber = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Name and email are required'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address'
            });
        }

        const result = await pool.query(
            `INSERT INTO subscribers (name, email, is_active)
             VALUES ($1, $2, true)
             RETURNING *`,
            [name.trim(), normalizedEmail]
        );

        res.status(201).json({
            success: true,
            message: 'Subscriber added successfully',
            data: result.rows[0]
        });

    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({
                success: false,
                message: 'Email already exists'
            });
        }

        console.error('Create Subscriber Error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to add subscriber'
        });
    }
};


// 2. Get All Subscribers (Search and Filter)
const getAllSubscribers = async (req, res) => {
    try {
        const { search, status } = req.query;

        let query = 'SELECT * FROM subscribers WHERE 1=1';
        const values = [];

        if (search) {
            values.push(`%${search}%`);
            query += ` AND (name ILIKE $${values.length}
                      OR email ILIKE $${values.length})`;
        }

        if (status) {
            if (!['active', 'unsubscribed'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid subscriber status'
                });
            }

            values.push(status === 'active');
            query += ` AND is_active = $${values.length}`;
        }

        query += ' ORDER BY subscribed_at DESC';

        const result = await pool.query(query, values);

        res.status(200).json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });

    } catch (error) {
        console.error('Get Subscribers Error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to fetch subscribers'
        });
    }
};


// 3. Get Subscriber By ID
const getSubscriberById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id) || Number(id) < 1) {
            return res.status(400).json({
                success: false,
                message: 'Invalid subscriber ID'
            });
        }

        const result = await pool.query(
            'SELECT * FROM subscribers WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Subscriber not found'
            });
        }

        res.status(200).json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Get Subscriber Error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to fetch subscriber'
        });
    }
};


// 4. Update Subscriber
const updateSubscriber = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        if (!/^\d+$/.test(id) || Number(id) < 1) {
            return res.status(400).json({
                success: false,
                message: 'Invalid subscriber ID'
            });
        }

        if (name === undefined && email === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Provide name or email to update'
            });
        }

        if (name !== undefined &&
            (typeof name !== 'string' || !name.trim())) {
            return res.status(400).json({
                success: false,
                message: 'Name cannot be empty'
            });
        }

        let normalizedEmail = null;

        if (email !== undefined) {
            if (typeof email !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Email must be a string'
                });
            }

            normalizedEmail = email.trim().toLowerCase();

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(normalizedEmail)) {
                return res.status(400).json({
                    success: false,
                    message: 'Please enter a valid email address'
                });
            }
        }

        const result = await pool.query(
            `UPDATE subscribers
             SET name = COALESCE($1, name),
                 email = COALESCE($2, email),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $3
             RETURNING *`,
            [
                name !== undefined ? name.trim() : null,
                normalizedEmail,
                id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Subscriber not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Subscriber updated successfully',
            data: result.rows[0]
        });

    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({
                success: false,
                message: 'Email already exists'
            });
        }

        console.error('Update Subscriber Error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to update subscriber'
        });
    }
};


// 5. Delete Subscriber
const deleteSubscriber = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id) || Number(id) < 1) {
            return res.status(400).json({
                success: false,
                message: 'Invalid subscriber ID'
            });
        }

        const result = await pool.query(
            'DELETE FROM subscribers WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Subscriber not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Subscriber deleted successfully'
        });

    } catch (error) {
        console.error('Delete Subscriber Error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to delete subscriber'
        });
    }
};


// 6. Change Subscriber Status
const updateSubscriberStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!/^\d+$/.test(id) || Number(id) < 1) {
            return res.status(400).json({
                success: false,
                message: 'Invalid subscriber ID'
            });
        }

        if (!['active', 'unsubscribed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status must be active or unsubscribed'
            });
        }

        const isActive = status === 'active';

        const result = await pool.query(
            `UPDATE subscribers
             SET is_active = $1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING *`,
            [isActive, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Subscriber not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Subscriber status updated successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Update Subscriber Status Error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to update subscriber status'
        });
    }
};


// 7. Unsubscribe Subscriber
const unsubscribeSubscriber = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id) || Number(id) < 1) {
            return res.status(400).json({
                success: false,
                message: 'Invalid subscriber ID'
            });
        }

        const result = await pool.query(
            `UPDATE subscribers
             SET is_active = false,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Subscriber not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Subscriber unsubscribed successfully',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Unsubscribe Error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to unsubscribe subscriber'
        });
    }
};


// 8. Export Subscribers to CSV
const exportSubscribersCSV = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email, is_active, subscribed_at
             FROM subscribers
             ORDER BY subscribed_at DESC`
        );

        const escapeCSV = (value) => {
            const text = value == null ? '' : String(value);
            return `"${text.replace(/"/g, '""')}"`;
        };

        const headers = [
            'ID',
            'Name',
            'Email',
            'Status',
            'Subscribed At'
        ];

        const rows = result.rows.map(subscriber => [
            subscriber.id,
            subscriber.name,
            subscriber.email,
            subscriber.is_active ? 'Active' : 'Unsubscribed',
            subscriber.subscribed_at
        ]);

        const csv = [
            headers.map(escapeCSV).join(','),
            ...rows.map(row => row.map(escapeCSV).join(','))
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader(
            'Content-Disposition',
            'attachment; filename="subscribers.csv"'
        );

        res.status(200).send('\uFEFF' + csv);

    } catch (error) {
        console.error('Export Subscribers Error:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to export subscribers'
        });
    }
};


module.exports = {
    createSubscriber,
    getAllSubscribers,
    getSubscriberById,
    updateSubscriber,
    deleteSubscriber,
    updateSubscriberStatus,
    unsubscribeSubscriber,
    exportSubscribersCSV
};
