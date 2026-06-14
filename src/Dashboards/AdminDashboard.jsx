import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarNav from "../Component/AdminNavBar";
import AdminNavBar from "../Component/AdminNavBar";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ================= MODAL =================
function Modal({ children, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        zIndex: 1000,
      }}
    >
      <div style={{ width: 220, backgroundColor: "#2c3e50", height: "100vh" }}>
        <SidebarNav activeItem="Users" />
      </div>

      <div
        style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 8,
          width: 420,
          maxHeight: "80vh",
          overflowY: "auto",
          margin: "auto",
          position: "relative",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            fontSize: 18,
            border: "none",
            background: "none",
            cursor: "pointer",
          }}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

// ================= MAIN DASHBOARD =================
export default function AdminDashboard() {
  const API_BASE = "amahirwemezabackend-production.up.railway.app/api/v1/users";

  const [users, setUsers] = useState([]);
  const [hovered, setHovered] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState({
    F_Name: "",
    L_Name: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
    Role: "Operation",
  });

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/getAll`);
      setUsers(res.data);
    } catch (err) {
      console.log("Error loading users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= ROLE STATS =================
  const totalUsers = users.length;
  const admins = users.filter((u) => u.role === "Admin").length;
  const procurement = users.filter((u) => u.role === "Procurement").length;
  const md = users.filter((u) => u.role === "M_D").length;
  const fieldChief = users.filter((u) => u.role === "Field Chief").length;
  const operation = users.filter((u) => u.role === "Operation").length;
  const others = users.filter(
    (u) =>
      !["Admin", "Procurement", "M_D", "Field Chief", "Operation"].includes(
        u.role
      )
  ).length;

  const cards = [
    { title: "Total Users", value: totalUsers, color: "#667eea" },
    { title: "Admins", value: admins, color: "#ff6a00" },
    { title: "Procurement", value: procurement, color: "#56ab2f" },
    { title: "M.D", value: md, color: "#00c6ff" },
    { title: "Field Chiefs", value: fieldChief, color: "#f7971e" },
    { title: "Operations", value: operation, color: "#ff512f" },
    { title: "Others", value: others, color: "#11998e" },
  ];

  const chartData = [
    { name: "Admins", value: admins },
    { name: "Procurement", value: procurement },
    { name: "M.D", value: md },
    { name: "Field Chiefs", value: fieldChief },
    { name: "Operations", value: operation },
    { name: "Others", value: others },
  ];

  const COLORS = [
    "#ff6a00",
    "#56ab2f",
    "#00c6ff",
    "#f7971e",
    "#ff512f",
    "#11998e",
  ];

  // ================= FORM =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setForm({
      F_Name: "",
      L_Name: "",
      Email: "",
      Password: "",
      ConfirmPassword: "",
      Role: "Operation",
    });
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setForm({
      F_Name: user.f_name,
      L_Name: user.l_name,
      Email: user.email,
      Password: "",
      ConfirmPassword: "",
      Role: user.role,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.F_Name || !form.L_Name || !form.Email || !form.Role) return;

    if (!editingUser && form.Password !== form.ConfirmPassword) return;

    try {
      if (!editingUser) {
        await axios.post(`${API_BASE}/create`, form);
      } else {
        const updateData = {
          F_Name: form.F_Name,
          L_Name: form.L_Name,
          Email: form.Email,
          Role: form.Role,
        };

        if (form.Password) updateData.Password = form.Password;

        await axios.put(
          `${API_BASE}/update/${editingUser.user_id}`,
          updateData
        );
      }

      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.log("Error saving user");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await axios.delete(`${API_BASE}/delete/${id}`);
    fetchUsers();
  };

  // ================= UI =================
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#f4f6f8",
        fontFamily: "Segoe UI",
      }}
    >
      <SidebarNav activeItem="Dashboard" />

      <main style={{ flex: 1, padding: 30, overflowY: "auto" }}>
        <AdminNavBar />

        {/* CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 20,
            marginTop: 20,
          }}
        >
          {cards.map((c, i) => (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: c.color,
                color: "white",
                padding: 25,
                borderRadius: 12,
                textAlign: "center",
                transform: hovered === i ? "translateY(-5px)" : "none",
                transition: "0.3s",
              }}
            >
              <h4>{c.title}</h4>
              <h1>{c.value}</h1>
            </div>
          ))}
        </div>

        {/* CHART */}
        <div
          style={{
            background: "white",
            padding: 20,
            marginTop: 30,
            borderRadius: 10,
          }}
        >
          <h3>User Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* TABLE */}
        <div style={{ marginTop: 30, background: "white", padding: 20 }}>
          <button onClick={openCreateModal}>+ New User</button>

          <table width="100%" style={{ marginTop: 20 }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>First</th>
                <th>Last</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.user_id}>
                  <td>{u.user_id}</td>
                  <td>{u.f_name}</td>
                  <td>{u.l_name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <button onClick={() => openEditModal(u)}>Edit</button>
                    <button onClick={() => handleDelete(u.user_id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL */}
        {modalOpen && (
          <Modal onClose={() => setModalOpen(false)}>
            <h3>{editingUser ? "Edit User" : "Create User"}</h3>

            <form onSubmit={handleSubmit}>
              <input
                name="F_Name"
                placeholder="First Name"
                value={form.F_Name}
                onChange={handleChange}
              />
              <input
                name="L_Name"
                placeholder="Last Name"
                value={form.L_Name}
                onChange={handleChange}
              />
              <input
                name="Email"
                placeholder="Email"
                value={form.Email}
                onChange={handleChange}
              />

              <select name="Role" value={form.Role} onChange={handleChange}>
                <option>Operation</option>
                <option>Procurement</option>
                <option>Field Chief</option>
                <option>M_D</option>
                <option>Admin</option>
              </select>

              <input
                type="password"
                name="Password"
                placeholder="Password"
                value={form.Password}
                onChange={handleChange}
              />

              <input
                type="password"
                name="ConfirmPassword"
                placeholder="Confirm Password"
                value={form.ConfirmPassword}
                onChange={handleChange}
              />

              <button type="submit">
                {editingUser ? "Update" : "Create"}
              </button>
            </form>
          </Modal>
        )}
      </main>
    </div>
  );
}