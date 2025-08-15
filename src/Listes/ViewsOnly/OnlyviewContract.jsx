import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProcurementNavbar from '../../Component/operaNavbar';
import {
    faPlus,
    faPen,
    faTrash,
    faFilePdf,
    faChevronLeft,
    faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const OnlyviewContract= () => {
    const [contracts, setContracts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchColumn, setSearchColumn] = useState('Client_Name'); // default search column
    const [currentPage, setCurrentPage] = useState(1);
    const contractsPerPage = 10;

    const fetchContracts = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/contracts/getAll');
            setContracts(res.data.data || []);
        } catch (error) {
            console.error('Error fetching contracts:', error);
        }
    };

    const deleteContract = async (id) => {
        if (window.confirm('Delete this contract?')) {
            try {
                await axios.delete(`http://localhost:8000/api/v1/contracts/delete/${id}`);
                fetchContracts();
            } catch (error) {
                console.error('Error deleting contract:', error);
            }
        }
    };

    useEffect(() => {
        fetchContracts();
    }, []);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'complete':
                return '#16a34a'; // green
            case 'in progress':
            case 'inprogress':
                return '#ca8a04'; // yellow
            case 'cancelled':
                return '#dc2626'; // red
            default:
                return '#000000';
        }
    };

    const getColumnValue = (contract, column) => {
        switch (column) {
            case 'Client_Name':
                return contract.Client_Name || '';
            case 'DescriptionOfGood':
                return contract.DescriptionOfGood || '';
            case 'Quantity':
                return contract.Quantity?.toString() || '';
            case 'Contract_Date':
                return contract.Contract_Date ? new Date(contract.Contract_Date).toISOString().split('T')[0] : '';
            case 'Delivery_deadline':
                return contract.Delivery_deadline ? new Date(contract.Delivery_deadline).toISOString().split('T')[0] : '';
            case 'Status':
                return contract.Status || '';
            default:
                return '';
        }
    };

    const filteredContracts = contracts.filter(contract => {
        const val = getColumnValue(contract, searchColumn).toLowerCase();
        return val.includes(searchTerm.toLowerCase());
    });

    const totalPages = Math.ceil(filteredContracts.length / contractsPerPage);
    const indexOfLast = currentPage * contractsPerPage;
    const indexOfFirst = indexOfLast - contractsPerPage;
    const currentContracts = filteredContracts.slice(indexOfFirst, indexOfLast);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    React.useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [filteredContracts, currentPage, totalPages]);

    return (
        <>
            <style>{`
                .container { padding: 24px; font-family: 'Segoe UI', sans-serif; max-width: 100%; box-sizing: border-box; }
                .title { font-size: 28px; font-weight: bold; color: #1f2937; margin-bottom: 20px; }
                .add-button {
                  background-color: #3b82f6;
                  color: white;
                  padding: 10px 20px;
                  border-radius: 8px;
                  text-decoration: none;
                  margin-bottom: 20px;
                  display: inline-block;
                  white-space: nowrap;
                }
                .add-button:hover { background-color: #2563eb; }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 12px;
                  background: white;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                  min-width: 600px;
                }
                th, td {
                  padding: 14px;
                  border-bottom: 1px solid #e5e7eb;
                  text-align: left;
                  font-size: 15px;
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
                .edit-link:hover { text-decoration: underline; }
                .delete-button { color: #ef4444; }
                .delete-button:hover { text-decoration: underline; }
                .view-button {
                  background-color: #6f58daff;
                  color: white;
                  padding: 6px 12px;
                  border-radius: 6px;
                  text-decoration: none;
                  font-size: 14px;
                  white-space: nowrap;
                }
                .view-button:hover { background-color: #3109e8ff; }
                .no-file { color: #6b7280; font-size: 14px; }
                .pagination {
                  margin-top: 20px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  gap: 8px;
                  flex-wrap: wrap;
                }
                .pagination button {
                  padding: 6px 12px;
                  border-radius: 6px;
                  border: 1px solid #ccc;
                  background-color: #f3f4f6;
                  cursor: pointer;
                  min-width: 36px;
                  text-align: center;
                }
                .pagination button.active {
                  background-color: #2563eb;
                  color: white;
                }
                .pagination button:hover { background-color: #e5e7eb; }
                .search-input, .search-select {
                  padding: 8px 12px;
                  font-size: 16px;
                  margin-bottom: 12px;
                  border-radius: 6px;
                  border: 1px solid #ccc;
                  margin-right: 8px;
                  max-width: 300px;
                  box-sizing: border-box;
                }

                /* Responsive Styles */
                @media (max-width: 768px) {
                  .search-input, .search-select {
                    width: 100%;
                    margin-right: 0;
                    margin-bottom: 8px;
                  }
                  .add-button {
                    width: 100%;
                    text-align: center;
                    padding: 12px 0;
                  }
                  table {
                    display: block;
                    overflow-x: auto;
                    white-space: nowrap;
                    min-width: 100%;
                  }
                  th, td {
                    padding: 10px 8px;
                    font-size: 13px;
                  }
                  .title {
                    font-size: 24px;
                  }
                  .pagination {
                    gap: 6px;
                  }
                  .pagination button {
                    padding: 5px 10px;
                    min-width: 30px;
                    font-size: 13px;
                  }
                }

                @media (max-width: 400px) {
                  .title {
                    font-size: 20px;
                  }
                  th, td {
                    padding: 8px 6px;
                    font-size: 12px;
                  }
                  .pagination button {
                    padding: 4px 8px;
                    min-width: 26px;
                    font-size: 12px;
                  }
                }
            `}</style>

            <div className="container">
                <ProcurementNavbar />
                <h2 className="title">📄 All Contracts</h2>
                {/* <Link to="/contracts/create" className="add-button">
                    <FontAwesomeIcon icon={faPlus} /> Add Contract
                </Link> */}

                {/* Search select and input */}
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
                        <option value="DescriptionOfGood">Product Name</option>
                        <option value="Quantity">Contract Number</option>
                        <option value="Contract_Date">Contract Date</option>
                        <option value="Delivery_deadline">Deadline Date</option>
                        <option value="Status">Status</option>
                    </select>

                    <input
                        type="text"
                        className="search-input"
                        placeholder={`Search by ${searchColumn.replace('_', ' ')}`}
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
                            <th>Contract Number</th>
                            <th>Descriptions</th>
                            
                            <th>Contract Date</th>
                            <th>Deadline Date</th>
                            <th>Status</th>
                            <th>Contract File</th>
                            {/* <th>Actions</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {currentContracts.length > 0 ? (
                            currentContracts.map((contract) => (
                                <tr key={contract.ContractId}>
                                    <td>{contract.Client_Name}</td>
                                    <td>{contract.Quantity}</td>
                                    <td>{contract.DescriptionOfGood}</td>
                                    <td>{contract.Contract_Date ? new Date(contract.Contract_Date).toISOString().split('T')[0] : ''}</td>
                                    <td>{contract.Delivery_deadline ? new Date(contract.Delivery_deadline).toISOString().split('T')[0] : ''}</td>
                                    <td style={{ color: getStatusColor(contract.Status), fontWeight: 'bold' }}>
                                        {contract.Status}
                                    </td>
                                    <td>
                                        {contract.Contr_file_path ? (
                                            <a
                                                href={`http://localhost:8000/uploads/contracts/${contract.Contr_file_path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="view-button"
                                            >
                                                <FontAwesomeIcon icon={faFilePdf} /> View File
                                            </a>
                                        ) : (
                                            <span className="no-file">No file</span>
                                        )}
                                    </td>
                                    {/* <td className="actions">
                                        <Link to={`/contracts/update/${contract.ContractId}`} className="edit-link">
                                            <FontAwesomeIcon icon={faPen} /> Edit
                                        </Link>
                                        <button onClick={() => deleteContract(contract.ContractId)} className="delete-button">
                                            <FontAwesomeIcon icon={faTrash} /> Delete
                                        </button>
                                    </td> */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                                    No contracts found.
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

                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => goToPage(index + 1)}
                                className={currentPage === index + 1 ? 'active' : ''}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default OnlyviewContract
