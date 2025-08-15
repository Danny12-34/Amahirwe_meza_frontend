import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProcurementNavbar from '../Component/operaNavbar';
import PieChart from '../charts/PieChart';
import BarChart from '../charts/BarChart';

const ProcurementsDash = () => {
  const [contracts, setContracts] = useState([]);
  const [summary, setSummary] = useState({
    totalContracts: 0,
    Completed: 0,
    Cancelled: 0,
    inProgressContracts: 0,
  });

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/contracts/getAll');
      const contractData = Array.isArray(res.data.data) ? res.data.data : [];

      setContracts(contractData);
      generateSummary(contractData);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  };

  const generateSummary = (contracts) => {
    const totalContracts = contracts.length;
    const Completed = contracts.filter((c) => c.Status === 'Complete').length;
    const Cancelled = contracts.filter((c) => c.Status === 'Cancelled').length;
    const inProgressContracts = contracts.filter((c) => c.Status === 'In progress').length;

    setSummary({
      totalContracts,
      Completed,
      Cancelled,
      inProgressContracts,
    });
  };

  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f7fa',
    },
    cardContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '30px',
      gap: '20px',
      flexWrap: 'wrap',
    },
    card: {
      backgroundColor: '#3B82F6',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      flex: '1',
      minWidth: '200px',
      height: '170px',
      color: 'white'
    },
    card1: {
      backgroundColor: '#10B981',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      flex: '1',
      minWidth: '200px',
      height: '170px'
    },
    card3: {
      backgroundColor: '#caa305ff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      flex: '1',
      minWidth: '200px',
      height: '170px'
    },
    card2: {
      backgroundColor: '#EF4444',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      flex: '1',
      minWidth: '200px',
      height: '170px'
    },
    cardTitle: {
      fontSize: '25px',
      color: 'white',
      marginBottom: '10px',
      fontWeight: 'bold',
    },
    cardValue: {
      fontSize: '34px',
      fontWeight: 'bold',
      color: 'white',
    },
    chartContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '30px',
      flexWrap: 'wrap',
    },
    chartBox: {
      flex: '1',
      minWidth: '300px',
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    chartTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '20px',
    },
    latestContracts: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginTop: '20px',
    },
    contractCard: {
      backgroundColor: '#fff',
      padding: '15px',
      borderRadius: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    contractTitle: {
      fontWeight: 'bold',
      fontSize: '16px',
      color: '#111827',
    },
    contractText: {
      fontSize: '14px',
      color: '#4b5563',
    },
    statusBadge: {
      padding: '4px 8px',
      borderRadius: '5px',
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'inline-block',
      width: 'fit-content'
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Complete': return { backgroundColor: '#10B981', color: 'white' };
      case 'Cancelled': return { backgroundColor: '#EF4444', color: 'white' };
      case 'In progress': return { backgroundColor: '#F59E0B', color: 'white' };
      default: return { backgroundColor: '#9CA3AF', color: 'white' };
    }
  };

  return (
    <div>
      <ProcurementNavbar />
      <div style={styles.container}>
        <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>📊 Operation Dashboard</h2>

        {/* Summary Cards */}
        <div style={styles.cardContainer}>
          <div style={styles.card}>
            <div style={styles.cardTitle}>Total Contracts</div>
            <div style={styles.cardValue}>{summary.totalContracts}</div>
          </div>
          <div style={styles.card1}>
            <div style={styles.cardTitle}>Completed</div>
            <div style={styles.cardValue}>{summary.Completed}</div>
          </div>
          <div style={styles.card3}>
            <div style={styles.cardTitle}>In Progress</div>
            <div style={styles.cardValue}>{summary.inProgressContracts}</div>
          </div>
          <div style={styles.card2}>
            <div style={styles.cardTitle}>Cancelled</div>
            <div style={styles.cardValue}>{summary.Cancelled}</div>
          </div>
        </div>

        {/* Charts */}
        <div style={styles.chartContainer}>
          <div style={styles.chartBox}>
            <h3 style={styles.chartTitle}>📅 Contracts Over Time</h3>
            <BarChart data={contracts} />
          </div>
          <div style={styles.chartBox}>
            <h3 style={styles.chartTitle}>📌 Status Distribution</h3>
            <PieChart data={contracts} />
          </div>
        </div>

        {/* Latest Contracts as Cards */}
        <div>
          <h3 style={styles.chartTitle}>📃 Recent Contracts</h3>
          <div style={styles.latestContracts}>
            {contracts.slice(0, 5).map((contract) => (
              <div key={contract.ContractId} style={styles.contractCard}>
                <div style={styles.contractTitle}>{contract.Client_Name}</div>
                <div style={styles.contractText}>Contract No: {contract.Quantity}</div>
                <div style={styles.contractText}>Good: {contract.DescriptionOfGood}</div>                
                <div style={{ ...styles.statusBadge, ...getStatusStyle(contract.Status) }}>
                  {contract.Status}
                </div>
                <div style={styles.contractText}>
                  Date: {new Date(contract.Contract_Date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcurementsDash;
