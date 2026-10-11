import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { useAuth } from '../hooks/useAuth';

const AdminUsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState(null);
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

  // Auto-dismiss success notification after 4 seconds
  useEffect(() => {
    if (!successMsg) return;
    const timer = setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
    return () => clearTimeout(timer);
  }, [successMsg]);

  const handleRoleChange = async (userId, newRole) => {
    const targetUser = users.find((u) => u._id === userId);
    const confirmed = window.confirm(
      `Are you sure you want to change the role of "${targetUser?.name || 'this user'}" to ${newRole.toUpperCase()}?`
    );
    if (!confirmed) return;

    setError('');
    setSuccessMsg('');
    setUpdatingUserId(userId);

    try {
      const updatedUser = await userService.updateUserRole(userId, newRole);
      setSuccessMsg(`Role for ${updatedUser?.name || 'user'} updated to ${newRole.toUpperCase()} successfully!`);
      // Optimistically update local users state without flickering the full table
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role');
    } finally {
      setUpdatingUserId(null);
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

      {error && (
        <div className="alert alert-error" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'inherit' }}
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{successMsg}</span>
          <button
            type="button"
            onClick={() => setSuccessMsg('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'inherit' }}
            aria-label="Dismiss success message"
          >
            ✕
          </button>
        </div>
      )}

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
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No registered team members found.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isSelf = u._id === currentUser?._id || u._id === currentUser?.id;
                  const isUpdating = updatingUserId === u._id;
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
                          <span className="text-muted text-sm" title="You cannot demote your own admin account">
                            Self account
                          </span>
                        ) : (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u._id, e.target.value)}
                              className="form-select-sm"
                              disabled={isUpdating}
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                            {isUpdating && <span className="text-sm text-muted">Updating...</span>}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;

