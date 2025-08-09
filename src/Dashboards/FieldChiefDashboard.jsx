import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FieldChiefNavBar from '../Component/FieldChiefNavBar';

const FieldChiefDashboard = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [supplyOrders, setSupplyOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to get the 3 most recent items
  const getRecentItems = (data, dateKey) => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }
    return [...data]
      .sort((a, b) => new Date(b[dateKey]) - new Date(a[dateKey]))
      .slice(0, 10);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          suppliersRes,
          purchaseRes,
          supplyRes,
          clientsRes,
        ] = await Promise.all([
          axios.get('http://localhost:8000/api/v1/suppliers/getAll'),
          axios.get('http://localhost:8000/api/v1/purchase-orders/getAll'),
          axios.get('http://localhost:8000/api/v1/supply-orders/getAll'),
          axios.get('http://localhost:8000/api/v1/clients/getAll'),
        ]);

        setSuppliers(Array.isArray(suppliersRes.data) ? suppliersRes.data : suppliersRes.data.data || []);
        setPurchaseOrders(Array.isArray(purchaseRes.data) ? purchaseRes.data : purchaseRes.data.data || []);
        setSupplyOrders(Array.isArray(supplyRes.data) ? supplyRes.data : supplyRes.data.data || []);
        setClients(Array.isArray(clientsRes.data) ? clientsRes.data : clientsRes.data.data || []);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get the 3 most recent items for display
  const recentSuppliers = getRecentItems(suppliers, 'Created_at');
  const recentPurchaseOrders = getRecentItems(purchaseOrders, 'Date_Received');
  const recentSupplyOrders = getRecentItems(supplyOrders, 'Date_Sent');
  const recentClients = getRecentItems(clients, 'Created_at');

  const styles = {
    container: {
      padding: '30px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      color: '#343a40',
    },
    heading: {
      fontSize: '36px',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#007bff',
      textAlign: 'center',
    },
    summaryCardsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '25px',
      marginBottom: '40px',
      textAlign: 'center',
    },
    summaryCard: {
      background: 'linear-gradient(45deg, #eedf09ff, #c7c6c6ff)',
      padding: '30px',      
      borderRadius: '15px',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
      border: '1px solid #e9ecef',
    },
    summaryCardHover: {
      transform: 'translateY(-10px)',
      boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#030303ff',
      marginBottom: '10px',
      // color: 'white',
    },
    cardCount: {
      fontSize: '48px',
      fontWeight: 'bold',
      color: '#007bff',
      textShadow: '2px 2px 4px rgba(0,0,0,0.05)',
    },
    sectionHeading: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginTop: '40px',
      marginBottom: '25px',
      color: '#495057',
      borderBottom: '2px solid #ced4da',
      paddingBottom: '10px',
      textAlign: 'center',
    },
    listContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '20px',
    },
    dataCard: {
      backgroundColor: '#ffffff',
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
      borderLeft: '6px solid',
      transition: 'box-shadow 0.3s ease-in-out',
    },
    dataCardHover: {
      boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
    },
    dataCardItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px',
      paddingBottom: '5px',
      borderBottom: '1px dashed #e9ecef',
    },
    label: {
      fontWeight: '600',
      color: '#6c757d',
    },
    value: {
      color: '#343a40',
      textAlign: 'right',
    },
    statusActive: {
      backgroundColor: '#d4edda',
      color: '#155724',
      padding: '5px 12px',
      borderRadius: '20px',
      fontWeight: 'bold',
    },
    statusInactive: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '5px 12px',
      borderRadius: '20px',
      fontWeight: 'bold',
    },
    loadingMessage: {
        textAlign: 'center',
        fontSize: '22px',
        color: '#6c757d',
        marginTop: '60px',
    },
  };

  if (isLoading) {
    return <div style={styles.loadingMessage}>Loading your dashboard data...</div>;
  }

  return (
    <div style={styles.container}>
      <FieldChiefNavBar/>
      <h1 style={styles.heading}>Field Chief Dashboard</h1>

      {/* Summary Cards Section */}
      <div style={styles.summaryCardsContainer}>
        <div style={styles.summaryCard} onMouseOver={(e) => e.currentTarget.style.transform = styles.summaryCardHover.transform} onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
          <h2 style={styles.cardTitle}>Total Suppliers</h2>
          <p style={styles.cardCount}>{suppliers.length}</p>
        </div>
        <div style={styles.summaryCard} onMouseOver={(e) => e.currentTarget.style.transform = styles.summaryCardHover.transform} onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
          <h2 style={styles.cardTitle}>Total Clients</h2>
          <p style={styles.cardCount}>{clients.length}</p>
        </div>
        <div style={styles.summaryCard} onMouseOver={(e) => e.currentTarget.style.transform = styles.summaryCardHover.transform} onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
          <h2 style={styles.cardTitle}>Purchase Orders</h2>
          <p style={styles.cardCount}>{purchaseOrders.length}</p>
        </div>
        <div style={styles.summaryCard} onMouseOver={(e) => e.currentTarget.style.transform = styles.summaryCardHover.transform} onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
          <h2 style={styles.cardTitle}>Supply Orders</h2>
          <p style={styles.cardCount}>{supplyOrders.length}</p>
        </div>
      </div>

      {/* Suppliers Section */}
      <h2 style={styles.sectionHeading}>Recent Suppliers</h2>
      <div style={styles.listContainer}>
        {recentSuppliers.map((supplier) => (
          <div key={supplier.SupplierId} style={{...styles.dataCard, borderLeftColor: '#20c997'}} onMouseOver={(e) => e.currentTarget.style.boxShadow = styles.dataCardHover.boxShadow} onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)'}>
            <div style={styles.dataCardItem}><span style={styles.label}>Name:</span> <span style={styles.value}>{supplier.Supplier_Name}</span></div>
            <div style={styles.dataCardItem}><span style={styles.label}>Contact:</span> <span style={styles.value}>{supplier.ContactPerson}</span></div>
            <div style={styles.dataCardItem}><span style={styles.label}>Email:</span> <span style={styles.value}>{supplier.Email}</span></div>
            <div style={styles.dataCardItem}><span style={styles.label}>Location:</span> <span style={styles.value}>{supplier.Location}</span></div>
            <div style={{...styles.dataCardItem, borderBottom: 'none'}}><span style={styles.label}>Category:</span> <span style={styles.value}>{supplier.Product_Category}</span></div>
          </div>
        ))}
      </div>

      {/* Purchase Orders Section */}
      <h2 style={styles.sectionHeading}>Recent Purchase Orders</h2>
      <div style={styles.listContainer}>
        {recentPurchaseOrders.map((order) => (
          <div key={order.PurchaseOrderId} style={{...styles.dataCard, borderLeftColor: '#ffc107'}} onMouseOver={(e) => e.currentTarget.style.boxShadow = styles.dataCardHover.boxShadow} onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)'}>
            <div style={styles.dataCardItem}><span style={styles.label}>Client:</span> <span style={styles.value}>{order.Client_Name}</span></div>
            <div style={styles.dataCardItem}><span style={styles.label}>Description:</span> <span style={styles.value}>{order.Description_of_Goods}</span></div>
            <div style={styles.dataCardItem}><span style={styles.label}>Quantity:</span> <span style={styles.value}>{order.Quantity}</span></div>
            <div style={styles.dataCardItem}><span style={styles.label}>Total:</span> <span style={styles.value}>${order.Total_Amount}</span></div>
            <div style={{...styles.dataCardItem, borderBottom: 'none'}}><span style={styles.label}>Date:</span> <span style={styles.value}>{new Date(order.Date_Received).toLocaleDateString()}</span></div>
          </div>
        ))}
      </div>

      {/* Supply Orders Section */}
      <h2 style={styles.sectionHeading}>Recent Supply Orders</h2>
      <div style={styles.listContainer}>
        {recentSupplyOrders.map((order) => (
          <div key={order.SupplyOrderId} style={{...styles.dataCard, borderLeftColor: '#17a2b8'}} onMouseOver={(e) => e.currentTarget.style.boxShadow = styles.dataCardHover.boxShadow} onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)'}>
            <div style={styles.dataCardItem}><span style={styles.label}>Supplier:</span> <span style={styles.value}>{order.Supplier_Name}</span></div>
            <div style={styles.dataCardItem}><span style={styles.label}>Description:</span> <span style={styles.value}>{order.Description_of_Goods}</span></div>
            <div style={styles.dataCardItem}><span style={styles.label}>Quantity:</span> <span style={styles.value}>{order.Quantity}</span></div>
            <div style={styles.dataCardItem}><span style={styles.label}>Total:</span> <span style={styles.value}>${order.Total_Amount}</span></div>
            <div style={{...styles.dataCardItem, borderBottom: 'none'}}><span style={styles.label}>Date:</span> <span style={styles.value}>{new Date(order.Date_Sent).toLocaleDateString()}</span></div>
          </div>
        ))}
      </div>
      
      {/* Clients Section */}
      <h2 style={styles.sectionHeading}>Recent Clients</h2>
      <div style={styles.listContainer}>
        {recentClients.map((client) => (
          <div key={client.ClientId} style={{...styles.dataCard, borderLeftColor: client.Status === 'Active' ? '#28a745' : '#dc3545'}} onMouseOver={(e) => e.currentTarget.style.boxShadow = styles.dataCardHover.boxShadow} onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)'}>
            <div style={styles.dataCardItem}><span style={styles.label}>Name:</span> <span style={styles.value}>{client.Client_Name}</span></div>
            <div style={styles.dataCardItem}><span style={styles.label}>Contact:</span> <span style={styles.value}>{client.Contact_Person}</span></div>
            <div style={styles.dataCardItem}><span style={styles.label}>Email:</span> <span style={styles.value}>{client.Email}</span></div>
            <div style={styles.dataCardItem}><span style={styles.label}>Location:</span> <span style={styles.value}>{client.Location}</span></div>
            <div style={{...styles.dataCardItem, borderBottom: 'none'}}><span style={styles.label}>Status:</span> <span style={client.Status === 'Active' ? styles.statusActive : styles.statusInactive}>{client.Status}</span></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FieldChiefDashboard;