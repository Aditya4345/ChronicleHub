const express = require('express');
const router = express.Router();

const {
    createSubscriber,
    getAllSubscribers,
    getSubscriberById,
    updateSubscriber,
    deleteSubscriber,
    updateSubscriberStatus,
    unsubscribeSubscriber,
    exportSubscribersCSV
} = require('../controllers/subscriberController');


// 1. Add New Subscriber
router.post('/', createSubscriber);

// 2. Get All Subscribers + Search + Filter
router.get('/', getAllSubscribers);

// 3. Export Subscribers CSV
router.get('/export/csv', exportSubscribersCSV);

// 4. Get Subscriber By ID
router.get('/:id', getSubscriberById);

// 5. Update Subscriber
router.put('/:id', updateSubscriber);

// 6. Delete Subscriber
router.delete('/:id', deleteSubscriber);

// 7. Activate / Deactivate Subscriber
router.patch('/:id/status', updateSubscriberStatus);

// 8. Unsubscribe Subscriber
router.patch('/:id/unsubscribe', unsubscribeSubscriber);


module.exports = router;