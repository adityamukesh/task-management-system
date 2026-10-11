const Task = require('../models/Task');

const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, assignedTo } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

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

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'admin') {
      const isAssigned = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();
      const isCreator = task.createdBy.toString() === req.user._id.toString();

      if (!isAssigned && !isCreator) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }

      if (req.body.status) {
        task.status = req.body.status;
      }

      await task.save();

      const updated = await Task.findById(task._id)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');

      return res.json(updated);
    }

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
