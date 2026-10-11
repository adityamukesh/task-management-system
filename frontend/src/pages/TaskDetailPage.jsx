import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { taskService } from '../services/taskService';
import TaskFormModal from '../components/TaskFormModal';

const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTaskDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await taskService.getTaskById(id);
      setTask(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load task details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const updated = await taskService.updateTask(task._id, { status: newStatus });
      setTask(updated);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(task._id);
        navigate('/tasks');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const updated = await taskService.updateTask(task._id, formData);
      setTask(updated);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading task details...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="detail-error-container">
        <h2>Task Not Found</h2>
        <p>{error || 'The requested task does not exist or may have been deleted.'}</p>
        <Link to="/tasks" className="btn btn-primary">
          Back to Tasks
        </Link>
      </div>
    );
  }

  const isAssigned = task.assignedTo && task.assignedTo._id === user?._id;
  const canUpdateStatus = isAdmin || isAssigned;

  return (
    <div className="task-detail-page">
      <div className="detail-navigation">
        <Link to="/tasks" className="btn-back">
          ← Back to Tasks
        </Link>
      </div>

      <div className="detail-card">
        <div className="detail-header">
          <div>
            <div className="detail-badges">
              <span className={`badge badge-${task.status}`}>{task.status?.replace('_', ' ').toUpperCase()}</span>
              <span className={`badge badge-${task.priority}`}>{task.priority?.toUpperCase()} PRIORITY</span>
            </div>
            <h1 className="detail-title">{task.title}</h1>
          </div>

          {isAdmin && (
            <div className="detail-actions">
              <button onClick={() => setIsModalOpen(true)} className="btn btn-secondary">
                Edit
              </button>
              <button onClick={handleDelete} className="btn btn-danger">
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="detail-section">
          <h3>Description</h3>
          <p className="detail-description">
            {task.description || 'No description provided for this task.'}
          </p>
        </div>

        <div className="detail-grid">
          <div className="detail-info-block">
            <span className="info-label">Assigned Member</span>
            <span className="info-value">
              {task.assignedTo ? `${task.assignedTo.name} (${task.assignedTo.email})` : 'Unassigned'}
            </span>
          </div>

          <div className="detail-info-block">
            <span className="info-label">Created By</span>
            <span className="info-value">
              {task.createdBy ? `${task.createdBy.name} (${task.createdBy.email})` : 'System'}
            </span>
          </div>

          <div className="detail-info-block">
            <span className="info-label">Due Date</span>
            <span className="info-value">
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date set'}
            </span>
          </div>

          <div className="detail-info-block">
            <span className="info-label">Created At</span>
            <span className="info-value">
              {new Date(task.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="status-updater-card">
          <h4>Update Status</h4>
          {canUpdateStatus ? (
            <div className="status-buttons">
              <button
                className={`btn btn-sm ${task.status === 'pending' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleStatusChange('pending')}
              >
                Pending
              </button>
              <button
                className={`btn btn-sm ${task.status === 'in_progress' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleStatusChange('in_progress')}
              >
                In Progress
              </button>
              <button
                className={`btn btn-sm ${task.status === 'completed' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handleStatusChange('completed')}
              >
                Completed
              </button>
            </div>
          ) : (
            <p className="text-muted text-sm">
              Only the assigned team member or an admin can update this task's status.
            </p>
          )}
        </div>
      </div>

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpdate}
        initialTask={task}
      />
    </div>
  );
};

export default TaskDetailPage;
