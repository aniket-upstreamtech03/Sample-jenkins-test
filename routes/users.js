const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate, rateLimit } = require('../middleware/auth');

// Apply rate limiting to all user routes (100 requests per 15 minutes)
router.use(rateLimit(900000, 100));

// Apply authentication to all routes (optional in development)
router.use(authenticate);

// GET all users with optional filtering
router.get('/', userController.getAllUsers);

// GET user by ID
router.get('/:id', userController.getUserById);

// CREATE new user
router.post('/', userController.createUser);

// UPDATE user
router.put('/:id', userController.updateUser);

// DELETE user
router.delete('/:id', userController.deleteUser);

// GET user statistics
router.get('/stats/count', userController.getUserStats);

// SEARCH users
router.get('/search/all', userController.searchUsers);

// GET users by department
router.get('/department/:dept', userController.getUsersByDepartment);

// GET active users
router.get('/status/active', userController.getActiveUsers);

module.exports = router;