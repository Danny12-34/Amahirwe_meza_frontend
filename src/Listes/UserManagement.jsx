import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SidebarNav from "../Component/AdminNavBar";
// import SidebarNav from "./SidebarNav";

const API_BASE = 'http://localhost:8000/api/users'; // Adjust to your API base URL

export default function UserManagement() {
  // States
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form for create/update
  const [form, setForm] = useState({
    UserId: null,
    F_Name: '',
    L_Name: '',
    Email: '',
    Password: '',
    ConfirmPassword: '',
    Role: 'Operation', // default role from your enum
  });

  // Login form
  const [loginForm, setLoginForm] = useState({
    Email: '',
    Password: '',
  });

  // Editing mode
  const [isEditing, setIsEditing] = useState(false);

  // Load users
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

  // Handle form change
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle login form change
  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  // Create or update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.F_Name || !form.L_Name || !form.Email || !form.Role) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!isEditing) {
      // Create: check passwords match
      if (!form.Password || form.Password !== form.ConfirmPassword) {
        setError('Passwords must match and not be empty.');
        return;
      }
      try {
        await axios.post(`${API_BASE}/create`, form);
        setForm({
          UserId: null,
          F_Name: '',
          L_Name: '',
          Email: '',
          Password: '',
          ConfirmPassword: '',
          Role: 'Operation',
        });
        fetchUsers();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to create user.');
      }
    } else {
      // Update: Password optional
      if (form.Password && form.Password !== form.ConfirmPassword) {
        setError('Passwords must match.');
        return;
      }
      try {
        const updateData = {
          F_Name: form.F_Name,
          L_Name: form.L_Name,
          Email: form.Email,
          Role: form.Role,
        };
        if (form.Password) updateData.Password = form.Password;

        await axios.put(`${API_BASE}/update/${form.UserId}`, updateData);
        setIsEditing(false);
        setForm({
          UserId: null,
          F_Name: '',
          L_Name: '',
          Email: '',
          Password: '',
          ConfirmPassword: '',
          Role: 'Operation',
        });
        fetchUsers();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to update user.');
      }
    }
  };

  // Edit user (fill form)
  const handleEdit = (user) => {
    setIsEditing(true);
    setForm({
      UserId: user.UserId,
      F_Name: user.F_Name,
      L_Name: user.L_Name,
      Email: user.Email,
      Password: '',
      ConfirmPassword: '',
      Role: user.Role,
    });
    setError('');
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${API_BASE}/delete/${id}`);
      fetchUsers();
    } catch {
      setError('Failed to delete user.');
    }
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${API_BASE}/login`, loginForm);
      alert(`Welcome ${res.data.user.F_Name} ${res.data.user.L_Name}, Role: ${res.data.user.Role}`);
      setLoginForm({ Email: '', Password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}

      {/* Main content */}
      <div
        style={{
          flexGrow: 1,
          padding: 20,
          overflowY: 'auto',
          backgroundColor: '#f5f5f5',
        }}
      >
        <div style={{ width: 220, backgroundColor: '#2c3e50', height: '100vh' }}>
        <SidebarNav activeItem="Users" />
      </div>
        <h1>User Management</h1>

        {/* Error message */}
        {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

        {/* User Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            marginBottom: 30,
            border: '1px solid #ccc',
            padding: 15,
            borderRadius: 5,
            backgroundColor: 'white',
          }}
        >
          <h2>{isEditing ? 'Edit User' : 'Create New User'}</h2>

          <div style={{ marginBottom: 10 }}>
            <label>First Name*: </label>
            <input name="F_Name" value={form.F_Name} onChange={handleFormChange} required />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Last Name*: </label>
            <input name="L_Name" value={form.L_Name} onChange={handleFormChange} required />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Email*: </label>
            <input type="email" name="Email" value={form.Email} onChange={handleFormChange} required />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Role*: </label>
            <select name="Role" value={form.Role} onChange={handleFormChange} required>
              <option value="Operation">Operation</option>
              <option value="Procurement">Procurement</option>
              <option value="Field Chief">Field Chief</option>
              <option value="M_D">M_D</option>
            </select>
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>Password{isEditing ? ' (leave blank to keep)' : '*'}: </label>
            <input
              type="password"
              name="Password"
              value={form.Password}
              onChange={handleFormChange}
              placeholder={isEditing ? 'Leave blank to keep current password' : ''}
              {...(!isEditing && { required: true })}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>Confirm Password{isEditing ? '' : '*'}: </label>
            <input
              type="password"
              name="ConfirmPassword"
              value={form.ConfirmPassword}
              onChange={handleFormChange}
              placeholder={isEditing ? 'Leave blank to keep current password' : ''}
              {...(!isEditing && { required: true })}
            />
          </div>

          <button type="submit" style={{ cursor: 'pointer', padding: '8px 16px' }}>
            {isEditing ? 'Update User' : 'Create User'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setForm({
                  UserId: null,
                  F_Name: '',
                  L_Name: '',
                  Email: '',
                  Password: '',
                  ConfirmPassword: '',
                  Role: 'Operation',
                });
                setError('');
              }}
              style={{ marginLeft: 10, cursor: 'pointer', padding: '8px 16px' }}
            >
              Cancel
            </button>
          )}
        </form>

        {/* Users List */}
        <h2>Users List</h2>
        {loading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table
            border="1"
            cellPadding="8"
            cellSpacing="0"
            style={{ width: '100%', textAlign: 'left', backgroundColor: 'white' }}
          >
            <thead style={{ backgroundColor: '#34495e', color: 'white' }}>
              <tr>
                <th>UserId</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.UserId}>
                  <td>{u.UserId}</td>
                  <td>{u.F_Name}</td>
                  <td>{u.L_Name}</td>
                  <td>{u.Email}</td>
                  <td>{u.Role}</td>
                  <td>
                    <button onClick={() => handleEdit(u)}>Edit</button>{' '}
                    <button onClick={() => handleDelete(u.UserId)} style={{ color: 'red' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Login Form */}
        <form
          onSubmit={handleLogin}
          style={{
            marginTop: 40,
            border: '1px solid #ccc',
            padding: 15,
            borderRadius: 5,
            backgroundColor: 'white',
          }}
        >
          <h2>Login</h2>
          <div style={{ marginBottom: 10 }}>
            <label>Email: </label>
            <input
              type="email"
              name="Email"
              value={loginForm.Email}
              onChange={handleLoginChange}
              required
              autoComplete="username"
            />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label>Password: </label>
            <input
              type="password"
              name="Password"
              value={loginForm.Password}
              onChange={handleLoginChange}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" style={{ cursor: 'pointer', padding: '8px 16px' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
