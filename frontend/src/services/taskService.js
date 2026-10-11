import API from './api';

export const taskService = {

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

  getTaskById: async (id) => {
    const response = await API.get(`/tasks/${id}`);
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await API.post('/tasks', taskData);
    return response.data;
  },

  updateTask: async (id, taskData) => {
    const response = await API.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await API.delete(`/tasks/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await API.get('/tasks/stats/summary');
    return response.data;
  },
};
