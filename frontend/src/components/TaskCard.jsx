import React from 'react';
import { Link } from 'react-router-dom';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, isAdmin, currentUserId }) => {
  const isAssigned = task.assignedTo && task.assignedTo._id === currentUserId;
  const canUpdateStatus = isAdmin || isAssigned;

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'urgent': return 'badge-urgent';
      case 'high': return 'badge-high';
      case 'medium': return 'badge-medium';
      case 'low': return 'badge-low';
      default: return 'badge-default';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'badge-completed';
      case 'in_progress': return 'badge-progress';
      case 'pending': return 'badge-pending';
      default: return 'badge-default';
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      default: return status;
    }
  };

  return (
    <div className={`task-card status-border-${task.status}`}>
      <div className="task-card-header">
        <div className="task-badges">
          <span className={`badge ${getStatusClass(task.status)}`}>
            {formatStatus(task.status)}
          </span>
          <span className={`badge ${getPriorityClass(task.priority)}`}>
            {task.priority?.toUpperCase()}
          </span>
        </div>

        {isAdmin && (
          <div className="card-admin-actions">
            <button
              onClick={() => onEdit(task)}
              className="btn-icon"
              title="Edit Task"
              aria-label="Edit task"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="btn-icon delete"
              title="Delete Task"
              aria-label="Delete task"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      <h3 className="task-title">
        <Link to={`/tasks/${task._id}`}>{task.title}</Link>
      </h3>

      <p className="task-desc">
        {task.description ? task.description : 'No description provided.'}
      </p>

      <div className="task-meta">
        <div className="meta-item">
          <span className="meta-label">📅 Due:</span>
          <span className="meta-val">{formatDate(task.dueDate)}</span>
        </div>

        <div className="meta-item">
          <span className="meta-label">👤 Assigned:</span>
          <span className="meta-val">
            {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
          </span>
        </div>
      </div>

      <div className="task-card-footer">
        {canUpdateStatus ? (
          <div className="quick-status-dropdown">
            <label htmlFor={`status-${task._id}`} className="sr-only">Change Status</label>
            <select
              id={`status-${task._id}`}
              value={task.status}
              onChange={(e) => onStatusChange(task._id, e.target.value)}
              className="form-select-sm"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        ) : (
          <span className="text-muted text-sm">Read-only</span>
        )}

        <Link to={`/tasks/${task._id}`} className="btn-link">
          Details →
        </Link>
      </div>
    </div>
  );
};

export default TaskCard;
