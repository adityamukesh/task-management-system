const User = require('../models/User');

// @desc    Get all users (for task assignments & admin panel)
// @route   GET /api/users
// @access  Private (Admin & User)
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort({ name: 1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private (Admin)
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Prevent administrator from demoting their own account
    if (req.user && req.user._id.toString() === req.params.id && role !== 'admin') {
      return res.status(400).json({ message: 'Administrators cannot demote their own account' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  updateUserRole,
};
