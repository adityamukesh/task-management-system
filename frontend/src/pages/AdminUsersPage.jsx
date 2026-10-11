import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { useAuth } from '../hooks/useAuth';

const AdminUsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (!successMsg) return;
    const timer = setTimeout(() => setSuccessMsg(''), 4000);
    return () => clearTimeout(timer);
  }, [successMsg]);

  const handleRoleChange = async (userId, newRole) => {
    const target = users.find((u) => u._id === userId);
    if (!window.confirm(`Change ${target?.name || 'user'}'s role to ${newRole.toUpperCase()}?`)) {
      return;
    }

    setError('');
    setSuccessMsg('');
    setUpdatingId(userId);

    try {
      await userService.updateUserRole(userId, newRole);
      setSuccessMsg(`Updated ${target?.name || 'user'} to ${newRole}`);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="admin-users-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Team Member Management</h1>
          <p className="page-subtitle">
            Admin console: View registered users and manage their access roles.
          </p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading team directory...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined Date</th>
                <th>Current Role</th>
                <th>Role Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = u._id === currentUser?._id;
                return (
                  <tr key={u._id}>
                    <td>
                      <strong>{u.name}</strong> {isSelf && <span className="text-muted text-sm">(You)</span>}
                    </td>
                    <td>{u.email}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`role-tag ${u.role}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {isSelf ? (
                        <span className="text-muted text-sm">Self account</span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="form-select-sm"
                          disabled={updatingId === u._id}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
