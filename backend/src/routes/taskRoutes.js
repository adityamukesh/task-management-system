const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} = require('../controllers/taskController');
const { authenticateUser, requireAdmin } = require('../middleware/auth');

// All task routes require authentication
router.use(authenticateUser);

router.get('/stats/summary', getTaskStats);
router.get('/', getTasks);
router.get('/:id', getTaskById);

// Admin-restricted routes
router.post('/', requireAdmin, createTask);
router.put('/:id', updateTask);
router.delete('/:id', requireAdmin, deleteTask);

module.exports = router;
