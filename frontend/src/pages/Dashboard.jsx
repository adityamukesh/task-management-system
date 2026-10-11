import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { taskService } from '../services/taskService';
import StatsCard from '../components/StatsCard';
import TaskCard from '../components/TaskCard';
import TaskFormModal from '../components/TaskFormModal';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    urgent: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, tasksData] = await Promise.all([
        taskService.getStats(),
        taskService.getTasks(),
      ]);
      setStats(statsData);
      setRecentTasks(tasksData.slice(0, 6)); // Show latest 6 tasks
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update status');
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        loadDashboardData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    if (editingTask) {
      await taskService.updateTask(editingTask._id, formData);
    } else {
      await taskService.createTask(formData);
    }
    loadDashboardData();
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-hero">
        <div>
          <h1 className="page-title">Welcome back, {user?.name}!</h1>
          <p className="page-subtitle">
            Role: <strong>{user?.role?.toUpperCase()}</strong> • Here is the latest progress on your team's tasks.
          </p>
        </div>
        <div className="hero-actions">
          {isAdmin && (
            <button
              onClick={() => {
                setEditingTask(null);
                setIsModalOpen(true);
              }}
              className="btn btn-primary"
            >
              + Create New Task
            </button>
          )}
          <Link to="/tasks" className="btn btn-secondary">
            View All Tasks
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading dashboard metrics...</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <StatsCard
              title="Total Tasks"
              value={stats.total}
              icon="📋"
              variant="total"
            />
            <StatsCard
              title="In Progress"
              value={stats.inProgress}
              icon="⚡"
              variant="progress"
            />
            <StatsCard
              title="Completed"
              value={stats.completed}
              icon="✅"
              variant="completed"
            />
            <StatsCard
              title="Urgent Priority"
              value={stats.urgent}
              icon="🔥"
              variant="urgent"
            />
          </div>

          <div className="recent-section">
            <div className="section-header">
              <h2>Recent Tasks</h2>
              <Link to="/tasks" className="link-arrow">
                See all tasks ({stats.total}) →
              </Link>
            </div>

            {recentTasks.length === 0 ? (
              <div className="empty-state">
                <p>No tasks found. Create a task to get started!</p>
              </div>
            ) : (
              <div className="tasks-grid">
                {recentTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    isAdmin={isAdmin}
                    currentUserId={user?._id}
                    onStatusChange={handleStatusChange}
                    onEdit={(t) => {
                      setEditingTask(t);
                      setIsModalOpen(true);
                    }}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialTask={editingTask}
      />
    </div>
  );
};

export default Dashboard;
