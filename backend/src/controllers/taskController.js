const Task = require('../models/Task');

// @desc    Get all tasks (with filters & search)
// @route   GET /api/tasks
// @access  Private (Admin & User)
const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, assignedTo } = req.query;

    const query = {};

    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by priority if provided
    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    // Filter by assigned user if provided
    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // If regular user and not explicitly viewing all team tasks, show tasks assigned or created by them
    if (req.user.role !== 'admin' && req.query.view === 'my-tasks') {
      query.$or = [
        { assignedTo: req.user._id },
        { createdBy: req.user._id },
      ];
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private (Admin & User)
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email role');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private (Admin)
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json(populatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing task
// @route   PUT /api/tasks/:id
// @access  Private (Admin, or assigned User updating status)
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // If user is not admin, they can only update status of task assigned to them
    if (req.user.role !== 'admin') {
      const isAssigned = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();
      const isCreator = task.createdBy.toString() === req.user._id.toString();

      if (!isAssigned && !isCreator) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }

      // Regular users can only update status
      if (req.body.status) {
        task.status = req.body.status;
      }

      await task.save();

      const updated = await Task.findById(task._id)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');

      return res.json(updated);
    }

    // Admin can update all fields
    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate || null;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;

    const updatedTask = await task.save();

    const populated = await Task.findById(updatedTask._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin)
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task removed successfully', id: req.params.id });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard task statistics
// @route   GET /api/tasks/stats/summary
// @access  Private
const getTaskStats = async (req, res, next) => {
  try {
    const total = await Task.countDocuments();
    const pending = await Task.countDocuments({ status: 'pending' });
    const inProgress = await Task.countDocuments({ status: 'in_progress' });
    const completed = await Task.countDocuments({ status: 'completed' });
    const urgent = await Task.countDocuments({ priority: 'urgent' });

    res.json({
      total,
      pending,
      inProgress,
      completed,
      urgent,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};
