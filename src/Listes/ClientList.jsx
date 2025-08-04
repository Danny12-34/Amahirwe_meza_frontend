import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faPen,
  faTrash,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('Client_Name');
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 10;

  const fetchClients = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/clients/getAll');
      setClients(res.data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const deleteClient = async (id) => {
    if (window.confirm('Delete this client?')) {
      try {
        await axios.delete(`http://localhost:8000/api/v1/clients/delete/${id}`);
        fetchClients();
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) => {
    const value = (client[searchColumn] || '').toString().toLowerCase();
    return value.includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);
  const indexOfLast = currentPage * clientsPerPage;
  const indexOfFirst = indexOfLast - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredClients, currentPage, totalPages]);

  return (
    <div className="container">
      <style>{`
        .container { padding: 24px; font-family: 'Segoe UI'; }
        .title { font-size: 28px; font-weight: bold; margin-bottom: 20px; }
        .add-button {
          background-color: #3b82f6;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          text-decoration: none;
          display: inline-block;
          margin-bottom: 16px;
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
        }
        th, td {
          padding: 14px;
          border-bottom: 1px solid #e5e7eb;
          text-align: left;
        }
        thead { background-color: #0920d4ff; color: white; }
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
        }
        .pagination button.active {
          background-color: #2563eb;
          color: white;
        }
      `}</style>

      <h2 className="title">👥 All Clients</h2>
      <Link to="/clients/create" className="add-button">
        <FontAwesomeIcon icon={faPlus} /> Add Client
      </Link>

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
          <option value="Contact_Person">Contact Person</option>
          <option value="Email">Email</option>
          <option value="Phone">Phone</option>
          <option value="Location">Location</option>
          <option value="Status">Status</option>
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
            <th>Client Name</th>
            <th>Contact Person</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentClients.length > 0 ? (
            currentClients.map((client) => (
              <tr key={client.ClientId}>
                <td>{client.Client_Name}</td>
                <td>{client.Contact_Person}</td>
                <td>{client.Email}</td>
                <td>{client.Phone}</td>
                <td>{client.Location}</td>
                <td>{client.Status}</td>
                <td className="actions">
                  <Link to={`/clients/update/${client.ClientId}`} className="edit-link">
                    <FontAwesomeIcon icon={faPen} /> Edit
                  </Link>
                  <button onClick={() => deleteClient(client.ClientId)} className="delete-button">
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                No clients found.
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

export default ClientList;
