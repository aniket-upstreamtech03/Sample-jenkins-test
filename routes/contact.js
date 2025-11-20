const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Public route - submit contact form (no authentication required)
router.post('/', contactController.submitContact);

// Admin routes (these would typically require authentication)
router.get('/', contactController.getAllContacts);
router.get('/stats', contactController.getContactStats);
router.get('/:id', contactController.getContactById);
router.patch('/:id/status', contactController.updateContactStatus);
router.delete('/:id', contactController.deleteContact);

module.exports = router;
