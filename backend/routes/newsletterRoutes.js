const express = require('express');

const router = express.Router();

const {
    createNewsletter,
    getAllNewsletters,
    getNewsletterById,
    updateNewsletter,
    deleteNewsletter,
    publishNewsletter
} = require('../Controllers/newsletterController');

// CREATE NEWSLETTER
router.post('/', createNewsletter);

// GET ALL NEWSLETTERS
router.get('/', getAllNewsletters);

// GET NEWSLETTER BY ID
router.get('/:id', getNewsletterById);

// UPDATE NEWSLETTER
router.put('/:id', updateNewsletter);

// DELETE NEWSLETTER
router.delete('/:id', deleteNewsletter);

// PUBLISH NEWSLETTER
router.patch('/:id/publish', publishNewsletter);

module.exports = router;