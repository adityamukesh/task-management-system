import API from './api';

export const taskService = {
  // Fetch tasks with optional filters
  getTasks: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.priority && filters.priority !== 'all') params.append('priority', filters.priority);
    if (filters.search) params.append('search', filters.search);
    if (filters.view) params.append('view', filters.view);
    if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);

    const response = await API.get(`/tasks?${params.toString()}`);
    return response.data;
  },

  // Get single task by ID
  getTaskById: async (id) => {
    const response = await API.get(`/tasks/${id}`);
    return response.data;
  },

  // Create a new task (Admin)
  createTask: async (taskData) => {
    const response = await API.post('/tasks', taskData);
    return response.data;
  },

  // Update existing task
  updateTask: async (id, taskData) => {
    const response = await API.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete task by ID (Admin)
  deleteTask: async (id) => {
    const response = await API.delete(`/tasks/${id}`);
    return response.data;
  },

  // Get task summary statistics for dashboard
  getStats: async () => {
    const response = await API.get('/tasks/stats/summary');
    return response.data;
  },
};
