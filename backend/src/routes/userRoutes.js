const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole } = require('../controllers/userController');
const { authenticateUser, requireAdmin } = require('../middleware/auth');

router.use(authenticateUser);

router.get('/', getUsers);
router.put('/:id/role', requireAdmin, updateUserRole);

module.exports = router;
