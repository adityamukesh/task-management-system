import React from 'react';

const TaskFilter = ({ filters, onFilterChange, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  return (
    <div className="task-filter-bar">
      <div className="filter-group search-group" style={{ position: 'relative' }}>
        <input
          type="text"
          name="search"
          placeholder="Search tasks by title or description..."
          value={filters.search}
          onChange={handleChange}
          className="form-input search-input"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => onFilterChange({ search: '' })}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              fontSize: '14px'
            }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="status-select" className="filter-label">Status</label>
          <select
            id="status-select"
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="form-select"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="priority-select" className="filter-label">Priority</label>
          <select
            id="priority-select"
            name="priority"
            value={filters.priority}
            onChange={handleChange}
            className="form-select"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="view-select" className="filter-label">View</label>
          <select
            id="view-select"
            name="view"
            value={filters.view}
            onChange={handleChange}
            className="form-select"
          >
            <option value="all">All Tasks</option>
            <option value="my-tasks">My Tasks</option>
          </select>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="btn btn-outline btn-reset"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default TaskFilter;
