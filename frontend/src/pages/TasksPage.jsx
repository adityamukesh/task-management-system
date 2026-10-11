import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { taskService } from '../services/taskService';
import TaskCard from '../components/TaskCard';
import TaskFilter from '../components/TaskFilter';
import TaskFormModal from '../components/TaskFormModal';

const TasksPage = () => {
  const { user, isAdmin } = useAuth();
  const { tasks, loading, error, filters, updateFilters, resetFilters, refreshTasks } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      refreshTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        refreshTasks();
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
    refreshTasks();
  };

  return (
    <div className="tasks-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Task Management</h1>
          <p className="page-subtitle">
            Browse, filter, assign, and update task statuses across your team.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="btn btn-primary"
          >
            + Create Task
          </button>
        )}
      </div>

      <TaskFilter
        filters={filters}
        onFilterChange={updateFilters}
        onReset={resetFilters}
        isAdmin={isAdmin}
      />

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3>No tasks match your criteria</h3>
          <p>Try adjusting your search filters or create a new task.</p>
          <button onClick={resetFilters} className="btn btn-outline">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => (
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

export default TasksPage;
