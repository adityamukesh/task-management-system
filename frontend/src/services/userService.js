import API from './api';

export const userService = {
  getUsers: async () => {
    const response = await API.get('/users');
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await API.put(`/users/${userId}/role`, { role });
    return response.data;
  }
};
