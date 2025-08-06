import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FieldChiefNavBar from '../Component/FieldChiefNavBar';

const FieldChiefDashboard = () => {
  const [contracts, setContracts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [supplyOrders, setSupplyOrders] = useState([]);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          contractsRes,
          suppliersRes,
          purchaseRes,
          supplyRes,
          clientsRes
        ] = await Promise.all([
          axios.get('http://localhost:8000/api/v1/contracts/getAll'),
          axios.get('http://localhost:8000/api/v1/suppliers/getAll'),
          axios.get('http://localhost:8000/api/v1/purchase-orders/getAll'),
          axios.get('http://localhost:8000/api/v1/supply-orders/getAll'),
          axios.get('http://localhost:8000/api/v1/clients/getAll'),
        ]);

        setContracts(Array.isArray(contractsRes.data) ? contractsRes.data : contractsRes.data.data || []);
        setSuppliers(Array.isArray(suppliersRes.data) ? suppliersRes.data : suppliersRes.data.data || []);
        setPurchaseOrders(Array.isArray(purchaseRes.data) ? purchaseRes.data : purchaseRes.data.data || []);
        setSupplyOrders(Array.isArray(supplyRes.data) ? supplyRes.data : supplyRes.data.data || []);
        setClients(Array.isArray(clientsRes.data) ? clientsRes.data : clientsRes.data.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={styles.container}>
      <FieldChiefNavBar />
      <h1 style={styles.heading}>📊 Field Chief Dashboard</h1>

      {/* Summary Cards */}
      <div style={styles.cardsContainer}>
        <Card title="Total Contracts" count={contracts.length} color="#6a11cb" />
        <Card title="Total Suppliers" count={suppliers.length} color="#2575fc" />
        <Card title="Total Clients" count={clients.length} color="#ff6a00" />
      </div>

      {/* Render Tables */}
      {renderTable("Contracts", ["Client", "Description", "Qty", "Location", "Deadline", "Status"], contracts.map(contract => [
        contract.Client_Name,
        contract.DescriptionOfGood,
        contract.Quantity,
        contract.Delivery_location,
        new Date(contract.Delivery_deadline).toLocaleDateString(),
        contract.Status
      ]))}

      {renderTable("Suppliers", ["Name", "Contact", "Email", "Location", "Category"], suppliers.map(sup => [
        sup.Supplier_Name,
        sup.ContactPerson,
        sup.Email,
        sup.Location,
        sup.Product_Category
      ]))}

      {renderTable("Purchase Orders", ["Client", "Description", "Qty", "Total", "Date"], purchaseOrders.map(order => [
        order.Client_Name,
        order.Description_of_Goods,
        order.Quantity,
        `$${order.Total_Amount}`,
        new Date(order.Date_Received).toLocaleDateString()
      ]))}

      {renderTable("Supply Orders", ["Supplier", "Description", "Qty", "Total", "Date"], supplyOrders.map(order => [
        order.Supplier_Name,
        order.Description_of_Goods,
        order.Quantity,
        `$${order.Total_Amount}`,
        new Date(order.Date_Sent).toLocaleDateString()
      ]))}

      {renderTable("Clients", ["Name", "Contact", "Email", "Location", "Status"], clients.map(client => [
        client.Client_Name,
        client.Contact_Person,
        client.Email,
        client.Location,
        client.Status
      ]))}
    </div>
  );
};

// Reusable Card Component
const Card = ({ title, count, color }) => (
  <div style={{ ...styles.card, background: `linear-gradient(to right, ${color}, #ffffff)` }}>
    <h2 style={styles.cardTitle}>{title}</h2>
    <p style={styles.cardCount}>{count}</p>
  </div>
);

// Reusable Table Component
const renderTable = (title, headers, rows) => (
  <div style={styles.tableWrapper}>
    <h2 style={styles.tableTitle}>{title}</h2>
    <div style={{ overflowX: 'auto' }}>
      <table style={styles.table}>
        <thead>
          <tr>
            {headers.map((head, index) => (
              <th key={index} style={styles.th}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cols, idx) => (
            <tr key={idx} style={idx % 2 === 0 ? styles.trEven : styles.trOdd}>
              {cols.map((col, i) => (
                <td key={i} style={styles.td}>{col}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Style Object
const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#f4f6f8',
    fontFamily: 'Segoe UI, sans-serif',
    minHeight: '100vh',
  },
  heading: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#2e2e2e',
  },
  cardsContainer: {
    display: 'flex',
    gap: '20px',
    marginBottom: '40px',
    flexWrap: 'wrap',
  },
  card: {
    color: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    flex: '1 1 250px',
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: '20px',
    marginBottom: '8px',
  },
  cardCount: {
    fontSize: '32px',
    fontWeight: 'bold',
  },
  tableWrapper: {
    marginBottom: '50px',
  },
  tableTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  },
  table: {
    width: '100%',
    backgroundColor: '#fff',
    borderCollapse: 'collapse',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  th: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '12px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  td: {
    padding: '12px',
    fontSize: '14px',
    borderBottom: '1px solid #e0e0e0',
  },
  trEven: {
    backgroundColor: '#f9f9f9',
  },
  trOdd: {
    backgroundColor: '#ffffff',
  },
};

export default FieldChiefDashboard;
