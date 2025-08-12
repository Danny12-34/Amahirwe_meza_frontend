import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SidebarNav from "../Component/AdminNavBar";
import AdminNavBar from '../Component/AdminNavBar';

// Modal component with sidebar on left and modal content on right
function Modal({ children, onClose }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        zIndex: 1000,
      }}
    >
      {/* Sidebar container */}
      <div style={{ width: 220, backgroundColor: '#2c3e50', height: '100vh' }}>
        <SidebarNav activeItem="Users" />
      </div>

      {/* Modal content container */}
      <div
        style={{
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 8,
          width: 400,
          maxHeight: '80vh',
          overflowY: 'auto',
          position: 'relative',
          margin: 'auto',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            fontWeight: 'bold',
            fontSize: 18,
            cursor: 'pointer',
            background: 'none',
            border: 'none',
          }}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const API_BASE = 'http://localhost:8000/api/v1/users';

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState({
    F_Name: '',
    L_Name: '',
    Email: '',
    Password: '',
    ConfirmPassword: '',
    Role: 'Operation',
  });

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE}/getAll`);
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load users.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Open modal for new user
  const openCreateModal = () => {
    setEditingUser(null);
    setForm({
      F_Name: '',
      L_Name: '',
      Email: '',
      Password: '',
      ConfirmPassword: '',
      Role: 'Operation',
    });
    setError('');
    setModalOpen(true);
  };

  // Open modal to edit user
  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({
      F_Name: user.F_Name,
      L_Name: user.L_Name,
      Email: user.Email,
      Password: '',
      ConfirmPassword: '',
      Role: user.Role,
    });
    setError('');
    setModalOpen(true);
  };

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.F_Name || !form.L_Name || !form.Email || !form.Role) {
      setError('Please fill all required fields.');
      return;
    }

    // Validate passwords
    if (!editingUser) {
      if (!form.Password || form.Password !== form.ConfirmPassword) {
        setError('Passwords must be non-empty and match.');
        return;
      }
    } else {
      if (form.Password && form.Password !== form.ConfirmPassword) {
        setError('Passwords must match.');
        return;
      }
    }

    try {
      if (!editingUser) {
        // Create
        await axios.post(`${API_BASE}/create`, form);
      } else {
        // Update
        const updateData = {
          F_Name: form.F_Name,
          L_Name: form.L_Name,
          Email: form.Email,
          Role: form.Role,
        };
        if (form.Password) updateData.Password = form.Password;

        await axios.put(`${API_BASE}/update/${editingUser.UserId}`, updateData);
      }

      fetchUsers();
      setModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    }
  };

  // Delete user
  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${API_BASE}/delete/${userId}`);
      fetchUsers();
    } catch {
      setError('Failed to delete user.');
    }
  };

  return (
    <div
      style={{
        flexGrow: 1,
        padding: 20,
        background: '#ecf0f1',
        overflowY: 'auto',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        height: '100vh',
      }}
    >
      <AdminNavBar />
      <header
        style={{
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1>Users Management</h1>
        <button
          onClick={openCreateModal}
          style={{
            padding: '10px 20px',
            background: '#2980b9',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          + New User
        </button>
      </header>

      {error && <div style={{ marginBottom: 10, color: 'red' }}>{error}</div>}

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
          <thead style={{ background: '#34495e', color: 'white' }}>
            <tr>
              <th style={{ padding: 10 }}>UserId</th>
              <th style={{ padding: 10 }}>First Name</th>
              <th style={{ padding: 10 }}>Last Name</th>
              <th style={{ padding: 10 }}>Email</th>
              <th style={{ padding: 10 }}>Role</th>
              <th style={{ padding: 10 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.UserId} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: 10 }}>{u.UserId}</td>
                <td style={{ padding: 10 }}>{u.F_Name}</td>
                <td style={{ padding: 10 }}>{u.L_Name}</td>
                <td style={{ padding: 10 }}>{u.Email}</td>
                <td style={{ padding: 10 }}>{u.Role}</td>
                <td style={{ padding: 10 }}>
                  <button
                    onClick={() => openEditModal(u)}
                    style={{
                      marginRight: 10,
                      padding: '5px 10px',
                      cursor: 'pointer',
                      background: '#27ae60',
                      color: 'white',
                      border: 'none',
                      borderRadius: 3,
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(u.UserId)}
                    style={{
                      padding: '5px 10px',
                      cursor: 'pointer',
                      background: '#c0392b',
                      color: 'white',
                      border: 'none',
                      borderRadius: 3,
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <h2>{editingUser ? 'Edit User' : 'Create New User'}</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 10 }}>
              <label>First Name*:</label>
              <br />
              <input
                name="F_Name"
                value={form.F_Name}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: 6, marginTop: 4 }}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Last Name*:</label>
              <br />
              <input
                name="L_Name"
                value={form.L_Name}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: 6, marginTop: 4 }}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Email*:</label>
              <br />
              <input
                type="email"
                name="Email"
                value={form.Email}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: 6, marginTop: 4 }}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Role*:</label>
              <br />
              <select
                name="Role"
                value={form.Role}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: 6, marginTop: 4 }}
              >
                <option value="Operation">Operation</option>
                <option value="Procurement">Procurement</option>
                <option value="Field Chief">Field Chief</option>
                <option value="M_D">M_D</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Password{editingUser ? ' (leave blank to keep)' : '*'}:</label>
              <br />
              <input
                type="password"
                name="Password"
                value={form.Password}
                onChange={handleChange}
                placeholder={editingUser ? 'Leave blank to keep current password' : ''}
                {...(!editingUser && { required: true })}
                style={{ width: '100%', padding: 6, marginTop: 4 }}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Confirm Password{editingUser ? '' : '*'}:</label>
              <br />
              <input
                type="password"
                name="ConfirmPassword"
                value={form.ConfirmPassword}
                onChange={handleChange}
                placeholder={editingUser ? 'Leave blank to keep current password' : ''}
                {...(!editingUser && { required: true })}
                style={{ width: '100%', padding: 6, marginTop: 4 }}
              />
            </div>

            <button
              type="submit"
              style={{
                background: '#2980b9',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                cursor: 'pointer',
                borderRadius: 4,
              }}
            >
              {editingUser ? 'Update User' : 'Create User'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
