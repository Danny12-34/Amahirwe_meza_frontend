import React from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import ProcurementNavbar from '../Component/operaNavbar';

const OperationDash = () => {
  const stats = {
    totalContracts: 32,
    activeContracts: 22,
    suppliers: 12,
    pendingOrders: 8,
    completedOrders: 14
  };

  const pieData = [
    { name: 'Active', value: stats.activeContracts },
    { name: 'Inactive', value: stats.totalContracts - stats.activeContracts }
  ];

  const barData = [
    { name: 'Pending', value: stats.pendingOrders },
    { name: 'Completed', value: stats.completedOrders }
  ];

  const COLORS = ['#1cc88a', '#e0e0e0'];

  return (
    <div style={styles.container}>
        <ProcurementNavbar/>
      <h2 style={styles.title}>📊 Operations Dashboard</h2>

      {/* Cards */}
      <div style={styles.cardContainer}>
        <div style={{ ...styles.card, background: 'linear-gradient(135deg, #36b9cc, #1cc88a)' }}>
          <h3 style={styles.cardTitle}>Total request Product</h3>
          <p style={styles.cardValue}>{stats.totalContracts}</p>
        </div>
        <div style={{ ...styles.card, background: 'linear-gradient(135deg, #f6c23e, #e0a800)' }}>
          <h3 style={styles.cardTitle}>In progress Request</h3>
          <p style={styles.cardValue}>{stats.activeContracts}</p>
        </div>
        {/* <div style={{ ...styles.card, background: 'linear-gradient(135deg, #4e73df, #224abe)' }}>
          <h3 style={styles.cardTitle}>Suppliers</h3>
          <p style={styles.cardValue}>{stats.suppliers}</p>
        </div> */}
        <div style={{ ...styles.card, background: 'linear-gradient(135deg, #e74a3b, #c0392b)' }}>
          <h3 style={styles.cardTitle}>Pending request</h3>
          <p style={styles.cardValue}>{stats.pendingOrders}</p>
        </div>
        <div style={{ ...styles.card, background: 'linear-gradient(135deg, #20c997, #198754)' }}>
          <h3 style={styles.cardTitle}>Completed Request</h3>
          <p style={styles.cardValue}>{stats.completedOrders}</p>
        </div>
      </div>

      {/* Charts */}
      <div style={styles.chartsContainer}>
        {/* Pie Chart */}
        <div style={styles.chartBox}>
          <h4 style={styles.chartTitle}>Contract Status</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div style={styles.chartBox}>
          <h4 style={styles.chartTitle}>Order Status</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1cc88a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Internal CSS styles
const styles = {
  container: {
    padding: '30px',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f4f6f9',
    minHeight: '100vh'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '25px',
    color: '#343a40'
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '35px'
  },
  card: {
    padding: '20px',
    borderRadius: '15px',
    color: 'white',
    boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
    minWidth: '180px',
    flex: '1',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
    cursor: 'pointer'
  },
  cardTitle: {
    fontSize: '16px',
    marginBottom: '10px',
    fontWeight: '600'
  },
  cardValue: {
    fontSize: '22px',
    fontWeight: 'bold'
  },
  chartsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '30px'
  },
  chartBox: {
    flex: 1,
    minWidth: '300px',
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '15px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  },
  chartTitle: {
    marginBottom: '10px',
    color: '#343a40',
    fontWeight: '600',
    fontSize: '18px'
  }
};

export default OperationDash;
