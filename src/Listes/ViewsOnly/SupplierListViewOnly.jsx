import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OperaNavbar from '../../Component/operaNavbar';
import {
  faPlus,
  faPen,
  faTrash,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('Supplier_Name');
  const [currentPage, setCurrentPage] = useState(1);
  const suppliersPerPage = 10;

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/suppliers/getAll');
      setSuppliers(res.data.data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const deleteSupplier = async (id) => {
    if (window.confirm('Delete this supplier?')) {
      try {
        await axios.delete(`http://localhost:8000/api/v1/suppliers/delete/${id}`);
        fetchSuppliers();
      } catch (error) {
        console.error('Error deleting supplier:', error);
      }
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter((supplier) => {
    const value = (supplier[searchColumn] || '').toString().toLowerCase();
    return value.includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredSuppliers.length / suppliersPerPage);
  const indexOfLast = currentPage * suppliersPerPage;
  const indexOfFirst = indexOfLast - suppliersPerPage;
  const currentSuppliers = filteredSuppliers.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredSuppliers, currentPage, totalPages]);

  return (
    <div className="container">
      <OperaNavbar />
      <style>{`
  .container {
    padding: 30px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f4f6f8;
    min-height: 100vh;
  }

  .title {
    font-size: 32px;
    margin-bottom: 25px;
    font-weight: bold;
    color: #1e3a8a;
  }

  .add-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    margin-bottom: 20px;
    background-color: #2563eb;
    color: #fff;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 500;
    transition: background-color 0.3s ease;
  }

  .add-button:hover {
    background-color: #1d4ed8;
  }

  .search-input,
  .search-select {
    padding: 10px 12px;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 15px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
    background-color: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    overflow: hidden;
  }

  th, td {
    padding: 14px 12px;
    border-bottom: 1px solid #eee;
    text-align: left;
  }

  th {
    background-color: #1e3a8a;
    color: white;
    font-weight: 600;
  }

  tbody tr:hover {
    background-color: #f1f5f9;
  }

  .actions {
    display: flex;
    gap: 12px;
  }

  .edit-link {
    color: #059669;
    font-weight: 500;
  }

  .edit-link:hover {
    text-decoration: underline;
  }

  .delete-button {
    background-color: transparent;
    color: #dc2626;
    border: none;
    cursor: pointer;
    font-weight: 500;
  }

  .delete-button:hover {
    text-decoration: underline;
  }

  .pagination {
    margin-top: 25px;
    display: flex;
    gap: 8px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .pagination button {
    padding: 8px 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background-color: #fff;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.3s ease;
  }

  .pagination button.active {
    background-color: #2563eb;
    color: white;
    border-color: #2563eb;
  }

  .pagination button:hover:not(.active):not(:disabled) {
    background-color: #e2e8f0;
  }

  .pagination button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`}</style>


      <h2 className="title">🏠 All Suppliers</h2>
      {/* <Link to="/supliers/create" className="add-button">
        <FontAwesomeIcon icon={faPlus} /> Add Supplier
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
          <option value="Supplier_Name">Supplier Name</option>
          <option value="ContactPerson">Contact Person</option>
          <option value="Email">Email</option>
          <option value="Phone">Phone</option>
          <option value="Location">Location</option>
          <option value="Product_Category">Product Category</option>
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
            <th>Supplier Name</th>
            <th>Contact Person</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Location</th>            
            <th>Category</th>
            <th>Agreements</th>
            {/* <th>Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {currentSuppliers.length > 0 ? (
            currentSuppliers.map((supplier) => (
              <tr key={supplier.SupplierId}>
                <td>{supplier.Supplier_Name}</td>
                <td>{supplier.ContactPerson}</td>
                <td>{supplier.Email}</td>
                <td>{supplier.Phone}</td>
                <td>{supplier.Location}</td>
                {/* <td>{supplier.Registration_number}</td> */}
                <td>{supplier.Product_Category}</td>
                <td>{supplier.Verifiered}</td>
                {/* <td className="actions">
                  <Link to={`/suppliers/update/${supplier.SupplierId}`} className="edit-link">
                    <FontAwesomeIcon icon={faPen} /> Edit
                  </Link>
                  <button
                    onClick={() => deleteSupplier(supplier.SupplierId)}
                    className="delete-button"
                  >
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                No suppliers found.
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

export default SupplierList;
