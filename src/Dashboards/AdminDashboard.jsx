import React, { useState } from "react";
import SidebarNav from "../Component/AdminNavBar"; // Keep your navbar untouched
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  const styles = {
    container: {
      display: "flex",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      height: "100vh",
      backgroundColor: "#f4f6f8",
    },
    main: {
      flex: 1,
      padding: "40px",
      display: "flex",
      flexDirection: "column",
      gap: "30px",
      overflowY: "auto",
    },
    cardContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "25px",
    },
    card: {
      padding: "30px 20px",
      borderRadius: "15px",
      color: "white",
      textAlign: "center",
      userSelect: "none",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
      cursor: "pointer",
    },
    cardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 12px 20px rgba(0,0,0,0.15)",
    },
    cardTitle: {
      fontSize: "1.2rem",
      opacity: 0.9,
      fontWeight: "600",
    },
    cardValue: {
      fontSize: "3rem",
      fontWeight: "700",
      marginTop: "15px",
    },
    chartSection: {
      background: "#fff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    },
    chatSection: {
      background: "#fff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      display: "flex",
      flexDirection: "column",
      height: "300px",
    },
    chatMessages: {
      flex: 1,
      overflowY: "auto",
      marginBottom: "10px",
    },
    chatInputContainer: {
      display: "flex",
      gap: "10px",
    },
    chatInput: {
      flex: 1,
      padding: "10px",
      borderRadius: "6px",
      border: "1px solid #ccc",
    },
    chatButton: {
      padding: "10px 15px",
      border: "none",
      background: "#2980b9",
      color: "#fff",
      borderRadius: "6px",
      cursor: "pointer",
    },
  };

  const [hovered, setHovered] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [users] = useState([
    { id: 1, firstName: "Danny", lastName: "KARIRE", email: "dannyniyitanga012@gmail.com", role: "Procurement" },
    { id: 2, firstName: "Sifa", lastName: "KARIRE", email: "k@gmail.com", role: "M_D" },
    { id: 3, firstName: "cyu", lastName: "divine", email: "d@gmail.com", role: "Field Chief" },
    { id: 4, firstName: "Mico", lastName: "KARIRE", email: "m@gmail.com", role: "Operation" },
    { id: 6, firstName: "Danny", lastName: "Niyitanga", email: "da@gmail.com", role: "Admin" },
  ]);

  const totalUsers = users.length;
  const admins = users.filter(u => u.role === "Admin").length;
  const procurement = users.filter(u => u.role === "Procurement").length;
  const md = users.filter(u => u.role === "M_D").length;
  const fieldChief = users.filter(u => u.role === "Field Chief").length;
  const operation = users.filter(u => u.role === "Operation").length;
  const others = users.filter(u => !["Admin", "Procurement", "M_D", "Field Chief", "Operation"].includes(u.role)).length;

  const cards = [
    { title: "Total Users", value: totalUsers, color: "linear-gradient(135deg, #667eea, #764ba2)" },
    { title: "Admins", value: admins, color: "linear-gradient(135deg, #ff6a00, #ee0979)" },
    { title: "Procurement", value: procurement, color: "linear-gradient(135deg, #56ab2f, #a8e063)" },
    { title: "M.D", value: md, color: "linear-gradient(135deg, #00c6ff, #0072ff)" },
    { title: "Field Chiefs", value: fieldChief, color: "linear-gradient(135deg, #f7971e, #ffd200)" },
    { title: "Operations", value: operation, color: "linear-gradient(135deg, #ff512f, #dd2476)" },
    { title: "Other Roles", value: others, color: "linear-gradient(135deg, #11998e, #38ef7d)" },
  ];

  const chartData = [
    { name: "Admins", value: admins },
    { name: "Procurement", value: procurement },
    { name: "M.D", value: md },
    { name: "Field Chiefs", value: fieldChief },
    { name: "Operations", value: operation },
    { name: "Other Roles", value: others },
  ];

  const COLORS = ["#ff6a00", "#56ab2f", "#00c6ff", "#f7971e", "#ff512f", "#11998e"];

  const sendMessage = () => {
    if (message.trim() !== "") {
      setMessages([...messages, { text: message, sender: "You" }]);
      setMessage("");
    }
  };

  return (
    <div style={styles.container}>
      <SidebarNav activeItem="Users" />
      <main style={styles.main}>
        <div style={styles.cardContainer}>
          {cards.map((card, index) => (
            <div
              key={index}
              style={{
                ...styles.card,
                background: card.color,
                ...(hovered === index ? styles.cardHover : {}),
              }}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={styles.cardTitle}>{card.title}</div>
              <div style={styles.cardValue}>{card.value}</div>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div style={styles.chartSection}>
          <h3>User Distribution by Role</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Chat Section */}
        {/* <div style={styles.chatSection}>
          <h3>Team Chat</h3>
          <div style={styles.chatMessages}>
            {messages.map((msg, i) => (
              <div key={i}><b>{msg.sender}:</b> {msg.text}</div>
            ))}
          </div>
          <div style={styles.chatInputContainer}>
            <input
              type="text"
              style={styles.chatInput}
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button style={styles.chatButton} onClick={sendMessage}>Send</button>
          </div>
        </div> */}
      </main>
    </div>
  );
};

export default AdminDashboard;
