import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProcurementNavbar from '../../Component/MDashboardNavbar'; // Adjust path as necessary
import {
  faPlus,
  faPen,
  faTrash,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const PurchaseOrder = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('Client_Name');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/purchase-orders/getAll');
      setOrders(res.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const deleteOrder = async (id) => {
    if (window.confirm('Delete this order?')) {
      try {
        await axios.delete(`http://localhost:8000/api/v1/purchase-orders/delete/${id}`);
        fetchOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const value = (order[searchColumn] || '').toString().toLowerCase();
    return value.includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredOrders, currentPage, totalPages]);

  return (
    <div className="container">
      {/* ProcurementNavbar is already included in App.js; include here only if needed */}
      <ProcurementNavbar />

      <style>{`
        .container { padding: 20px; font-family: 'Segoe UI'; }
        .title { font-size: 28px; font-weight: bold; margin-bottom: 20px; }
        .add-button {
          background-color: #3b82f6;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          text-decoration: none;
          display: inline-block;
          margin-bottom: 16px;
          transition: background-color 0.3s ease;
        }
        .add-button:hover { background-color: #2563eb; }
        .search-select, .search-input {
          padding: 8px 12px;
          margin-right: 8px;
          font-size: 16px;
          border-radius: 6px;
          border: 1px solid #ccc;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          border-radius: 8px;
          overflow: hidden;
        }
        th, td {
          padding: 14px;
          border-bottom: 1px solid #e5e7eb;
          text-align: left;
        }
        thead { background-color: #0f172a; color: white; }
        .actions a, .actions button {
          margin-right: 10px;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: bold;
          font-size: 14px;
        }
        .edit-link { color: #0ea5e9; }
        .delete-button { color: #ef4444; }
        .pagination {
          margin-top: 20px;
          display: flex;
          justify-content: center;
          gap: 8px;
        }
        .pagination button {
          padding: 6px 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          background-color: #f3f4f6;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .pagination button.active {
          background-color: #2563eb;
          color: white;
        }
        .pagination button:hover:not(:disabled) {
          background-color: #60a5fa;
          color: white;
        }
        .pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      <h2 className="title">📦 Purchase Orders</h2>
      {/* <Link to="/purchaseorder/create" className="add-button">
        <FontAwesomeIcon icon={faPlus} /> Add Order
      </Link> */}

      <div style={{ marginBottom: '12px' }}>
        <select
          className="search-select"
          value={searchColumn}
          onChange={(e) => {
            setSearchColumn(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="Client_Name">Client Name</option>
          <option value="Description_of_Goods">Goods Description</option>
          <option value="Date_Received">Date Received</option>
          <option value="Quantity">Quantity</option>
          <option value="Unit_Price">Unit Price</option>
        </select>

        <input
          type="text"
          className="search-input"
          placeholder={`Search by ${searchColumn}`}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Date Received</th>
            <th>Client Name</th>
            <th>Description of Goods</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            {/* <th>Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => (
              <tr key={order.PurchaseOrderId}>
                <td>{order.Date_Received?.split('T')[0]}</td>
                <td>{order.Client_Name}</td>
                <td>{order.Description_of_Goods}</td>
                <td>{order.Quantity}</td>
                <td>{order.Unit_Price}</td>
                {/* <td className="actions">
                  <Link to={`/purchaseorder/update/${order.PurchaseOrderId}`} className="edit-link">
                    <FontAwesomeIcon icon={faPen} /> Edit
                  </Link>
                  <button onClick={() => deleteOrder(order.PurchaseOrderId)} className="delete-button">
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrder;
