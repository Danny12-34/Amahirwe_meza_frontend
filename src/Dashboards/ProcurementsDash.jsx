import React, { useEffect, useState } from 'react';
import SummaryCard from './SummaryCard';
import PieChart from '../charts/PieChart';
import BarChart from '../charts/BarChart';
import axios from 'axios';
import ProcurementNavbar from '../Component/ProcurementNavbar';

const ProcurementDashboard = () => {
  const [summary, setSummary] = useState([
    { title: 'Total product requests', value: 0, color: '#2563eb' },
    { title: 'Total Suppliers', value: 0, color: '#16a34a' },
    { title: 'Total Contracts', value: 0, color: '#eab308' },
    // { title: 'Total Supplier Orders', value: 0, color: '#7c3aed' },
  ]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  

  const getStatusCounts = (contracts) => {
    const counts = {};
    contracts.forEach(({ Status }) => {
      if (Status) {
        counts[Status] = (counts[Status] || 0) + 1;
      }
    });
    return counts;
  };

  const getMonthlyCounts = (contracts) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const counts = new Array(12).fill(0);

    contracts.forEach(({ Contract_Date }) => {
      if (Contract_Date) {
        const date = new Date(Contract_Date);
        if (!isNaN(date)) {
          counts[date.getMonth()] += 1;
        }
      }
    });

    return { months, counts };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          suppliersRes,
          contractsCountRes,
          purchaseOrdersRes,
          supplyOrdersRes,
          contractsRes
        ] = await Promise.all([
          axios.get('http://localhost:8000/api/v1/suppliers/count'),
          axios.get('http://localhost:8000/api/v1/contracts/count'),
          axios.get('http://localhost:8000/api/v1/purchase-orders/count'),
          axios.get('http://localhost:8000/api/v1/supply-orders/count'),
          axios.get('http://localhost:8000/api/v1/contracts/getAll')
        ]);

        setSummary([
          {
            title: 'Total product requests',
            value: purchaseOrdersRes.data.totalOrders || 0,
            color: '#2563eb',
          },
          {
            title: 'Total Suppliers',
            value: suppliersRes.data.totalSuppliers || 0,
            color: '#16a34a',
          },
          {
            title: 'Total Contracts',
            value: contractsCountRes.data.totalContracts || 0,
            color: '#eab308',
          },
          // {
          //   title: 'Total Supplier Orders',
          //   value: supplyOrdersRes.data.totalSupplyOrders || 0,
          //   color: '#7c3aed',
          // },
        ]);

        setContracts(contractsRes.data.data || []);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statusCounts = getStatusCounts(contracts);
  const pieData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Contracts by Status',
        data: Object.values(statusCounts),
        backgroundColor: ['#FACC15', '#10B981', '#EF4444', '#3B82F6', '#8B5CF6'],
        borderWidth: 1,
      },
    ],
  };

  const { months, counts } = getMonthlyCounts(contracts);
  const barData = {
    labels: months,
    datasets: [
      {
        label: 'Contracts per Month',
        data: counts,
        backgroundColor: '#3B82F6',
        borderRadius: 8,
      },
    ],
  };

  return (
    <div style={styles.container}>
      <ProcurementNavbar />
      <h2 style={styles.heading}>📦 Procurement Dashboard</h2>

      

      {loading && <p style={styles.message}>Loading summary data...</p>}
      {error && <p style={{ ...styles.message, color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <>
          <div style={styles.cardGrid}>
            {summary.map((item, index) => (
              <SummaryCard key={index} title={item.title} value={item.value} color={item.color} />
            ))}
          </div>

          <div style={styles.chartGrid}>
            <div style={styles.chartBox}>
              <h3 style={styles.chartTitle}>📊 Contract Status</h3>
              <PieChart data={pieData} />
            </div>
            <div style={styles.chartBox}>
              <h3 style={styles.chartTitle}>📈 Monthly Contracts</h3>
              <BarChart data={barData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
    background: 'linear-gradient(to bottom right, #f0f0f0, #ffffff)',
    minHeight: '100vh',
  },
  heading: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  chartGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  chartBox: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
    transition: '0.3s ease',
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '10px',
    borderBottom: '1px solid #eee',
    paddingBottom: '6px',
    color: '#444',
  },
  message: {
    fontSize: '16px',
    marginBottom: '20px',
  },
};

export default ProcurementDashboard;
