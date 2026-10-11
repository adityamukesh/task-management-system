import API from './api';

export const userService = {
  // Fetch users list
  getUsers: async () => {
    const response = await API.get('/users');
    return response.data;
  },

  // Update a user role (Admin)
  updateUserRole: async (userId, role) => {
    const response = await API.put(`/users/${userId}/role`, { role });
    return response.data;
  },
};
