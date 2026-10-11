const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Task = require('../models/Task');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/task_management_db';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    await Task.deleteMany({});
    await User.deleteMany({});

    console.log('Cleared existing users and tasks.');

    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@taskflow.com',
      password: 'adminpassword123',
      role: 'admin',
    });

    const standardUser1 = await User.create({
      name: 'Alex Johnson',
      email: 'alex@taskflow.com',
      password: 'userpassword123',
      role: 'user',
    });

    const standardUser2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@taskflow.com',
      password: 'userpassword123',
      role: 'user',
    });

    console.log('Users created:');
    console.log(`- Admin: admin@taskflow.com (adminpassword123)`);
    console.log(`- User 1: alex@taskflow.com (userpassword123)`);
    console.log(`- User 2: priya@taskflow.com (userpassword123)`);

    const tasks = [
      {
        title: 'Design Database Schema for Taskflow',
        description: 'Define Mongoose models for User and Task entities, including index and validation rules.',
        status: 'completed',
        priority: 'high',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
      },
      {
        title: 'Implement JWT Authentication & Role Middleware',
        description: 'Build authenticateUser and requireAdmin middleware to safeguard REST API endpoints.',
        status: 'completed',
        priority: 'urgent',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        assignedTo: standardUser1._id,
        createdBy: adminUser._id,
      },
      {
        title: 'Build Responsive React Dashboard UI',
        description: 'Develop dashboard layout with metrics summary cards and responsive task table using Vite + React.',
        status: 'in_progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        assignedTo: standardUser2._id,
        createdBy: adminUser._id,
      },
      {
        title: 'Add Client-side Task Filter and Search',
        description: 'Allow filtering by status (pending, in_progress, completed) and priority (low, medium, high, urgent).',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        assignedTo: standardUser1._id,
        createdBy: adminUser._id,
      },
      {
        title: 'Setup Vercel and Render Deployment',
        description: 'Configure environment variables, CORS origins, and deployment documentation for submission.',
        status: 'pending',
        priority: 'low',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
      },
    ];

    await Task.insertMany(tasks);
    console.log(`Seeded ${tasks.length} initial tasks successfully!`);

    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error during data seeding:', error);
    process.exit(1);
  }
};

seedData();
