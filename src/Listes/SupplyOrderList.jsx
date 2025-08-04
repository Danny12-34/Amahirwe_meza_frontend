import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrash, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const SupplyOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [column, setColumn] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get('http://localhost:8000/api/v1/supply-orders/getAll');
    setOrders(res.data || []);
  };

  const deleteOrder = async (id) => {
    if (window.confirm('Delete this supply order?')) {
      await axios.delete(`http://localhost:8000/api/v1/supply-orders/delete/${id}`);
      fetchOrders();
    }
  };

  const filtered = orders.filter((order) => {
    if (!column || !search) return true;
    const value = order[column]?.toString().toLowerCase() || '';
    return value.includes(search.toLowerCase());
  });

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="container">
      
      <style>{`
        .container {
          padding: 20px;
          font-family: 'Segoe UI', sans-serif;
          background-color: #f9f9f9;
          min-height: 100vh;
        }

        .top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .add-button {
          padding: 8px 12px;
          background-color: green;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
        }

        .search-bar {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        select, input[type="text"] {
          padding: 6px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        th, td {
          padding: 12px;
          border-bottom: 1px solid #eee;
          text-align: left;
          font-size: 14px;
        }

        th {
          background: #2563eb;
          color: white;
          font-weight: 600;
        }

        tr:hover {
          background-color: #f1f5ff;
        }

        .actions {
          display: flex;
          gap: 10px;
          padding-left: 20%;
          width: 30%
        }

        .edit-btn {
          padding: 6px 10px;
          background-color: #facc15;
          color: black;
          border-radius: 6px;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
        }

        .edit-btn:hover {
          background-color: #eab308;
        }

        .delete-btn {
          padding: 6px 10px;
          background-color: #ef4444;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
        }

        .delete-btn:hover {
          background-color: #dc2626;
        }

        .pagination {
          margin-top: 20px;
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .pagination button {
          padding: 6px 12px;
          font-size: 14px;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .pagination button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>

      <div className="top-bar">
        <Link to="/supplieorder/create" className="add-button">
          <FontAwesomeIcon icon={faPlus} /> Add Supply Order
        </Link>
      </div>

      <div className="search-bar">
        <select value={column} onChange={(e) => setColumn(e.target.value)}>
          <option value="">Select Column</option>
          <option value="Date_Sent">Date Sent</option>
          <option value="Supplier_Name">Supplier Name</option>
          <option value="Description_of_Goods">Description</option>
          <option value="Quantity">Quantity</option>
          <option value="Unit_Price">Unit Price</option>
        </select>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={!column}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Date Sent</th>
            <th>Supplier Name</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total Amounts</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((order) => (
            <tr key={order.SupplyOrderId}>
              <td>{order.Date_Sent?.split('T')[0]}</td>
              <td>{order.Supplier_Name}</td>
              <td>{order.Description_of_Goods}</td>
              <td>{order.Quantity}</td>
              <td>{order.Unit_Price}</td>
              <td>{order.Total_Amount}</td>
              <td className="actions">
                <Link to={`/supplieorder/update/${order.SupplyOrderId}`} className="edit-btn">
                  <FontAwesomeIcon icon={faPen} /> Edit
                </Link>
                <button onClick={() => deleteOrder(order.SupplyOrderId)} className="delete-btn">
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={goToPrevPage} disabled={currentPage === 1}>
          <FontAwesomeIcon icon={faChevronLeft} /> Prev
        </button>
        <span style={{ padding: '6px 12px', fontWeight: 'bold' }}>{currentPage} / {totalPages}</span>
        <button onClick={goToNextPage} disabled={currentPage === totalPages}>
          Next <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
};

export default SupplyOrderList;
