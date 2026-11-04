
const path = require('path');
require('dotenv').config({
    path: path.join(__dirname, '../.env')
});

const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function createAdmin() {
    try {
        const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

        if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
            throw new Error('Admin details are missing from environment variables.');
        }

        if (ADMIN_PASSWORD.length < 12) {
            throw new Error('Admin password must contain at least 12 characters.');
        }

        // Prevent accidental duplicate bootstrap accounts.
        const existingAdmin = await pool.query(
            "SELECT id FROM users WHERE role = 'admin' LIMIT 1"
        );

        if (existingAdmin.rows.length > 0) {
            throw new Error('An admin account already exists.');
        }

        // Check whether this email is already registered.
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
            [ADMIN_EMAIL.trim()]
        );

        if (existingUser.rows.length > 0) {
            throw new Error('This email is already registered.');
        }

        const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

        const result = await pool.query(
            `INSERT INTO users
                (full_name, email, password_hash, role, is_active)
             VALUES ($1, $2, $3, 'admin', true)
             RETURNING id, full_name, email, role`,
            [ADMIN_NAME.trim(), ADMIN_EMAIL.trim().toLowerCase(), passwordHash]
        );

        console.log('Admin account created successfully!');
        console.log('Admin details:', result.rows[0]);

    } catch (error) {
        console.error('Admin setup failed:', error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

createAdmin();
