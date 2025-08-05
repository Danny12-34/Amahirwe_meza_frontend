import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProcurementNavbar from '../Component/ProcurementNavbar';
import {
    faPlus,
    faPen,
    faTrash,
    faFilePdf,
    faChevronLeft,
    faChevronRight,
    faDownload,
} from '@fortawesome/free-solid-svg-icons';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // ✅ CORRECT IMPORT


// Helper function to format date ignoring timezone shifts
const formatDateUTC = (dateString) => {
    if (!dateString) return '';

    const d = new Date(dateString);
    if (isNaN(d)) return ''; // invalid date check

    const year = d.getUTCFullYear();
    const month = (d.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = d.getUTCDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const ContractList = () => {
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

    const handleStatusUpdate = async () => {
        try {
            const res = await axios.put('http://localhost:8000/api/v1/contracts/auto-update-status');
            alert(res.data.message || 'Contract statuses updated successfully.');
            // Refresh contract data after status update
            fetchContracts();
        } catch (err) {
            console.error('Error updating contract statuses:', err);
            alert('Failed to update contract statuses.');
        }
    };

    // === NEW: PDF Report Download ===


    const handleDownloadReport = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const marginLeft = 14;
    const columnGap = 8;
    const columnWidth = (182 - columnGap) / 2;
    const today = new Date();

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
        });

    // Header Section
    doc.setFillColor(30, 58, 138); // Deep Blue
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('AMAHIRWE MEZA Ltd', marginLeft, 12);
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.text('CONTRACTS REPORT', marginLeft, 26);

    let y = 34;

    // Column 1: Contract Overview
    doc.setFillColor(240, 249, 255); // Light blue background
    doc.roundedRect(marginLeft - 2, y, columnWidth, 46, 4, 4, 'F');

    doc.setTextColor(17, 24, 39); // Dark text
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Contracts: ${filteredContracts.length}`, marginLeft, y + 8);

    const statusCount = filteredContracts.reduce((acc, curr) => {
        const status = (curr.Status || 'Unknown').toLowerCase();
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Status Breakdown:', marginLeft, y + 16);

    Object.entries(statusCount).forEach(([status, count], i) => {
        const label = `• ${status.charAt(0).toUpperCase() + status.slice(1)}: ${count}`;
        doc.text(label, marginLeft + 4, y + 24 + i * 6);
    });

    // Column 2: Product Summary with P IDs
    const productX = marginLeft + columnWidth + columnGap;
    const productMap = {};

    filteredContracts.forEach(contract => {
        const product = contract.DescriptionOfGood || 'Unknown';
        const id = contract.Quantity || contract.Quantity || 'N/A'; // Adjust ID field as needed
        if (!productMap[product]) {
            productMap[product] = [];
        }
        productMap[product].push(id);
    });

    const productBoxHeight = 46 + Object.keys(productMap).length * 6;

    doc.setFillColor(254, 242, 242); // Light red/pink
    doc.roundedRect(productX - 2, y, columnWidth, productBoxHeight, 4, 4, 'F');

    doc.setTextColor(74, 20, 140); // Deep Purple
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Product Summary:', productX, y + 8);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const products = Object.entries(productMap);
    products.forEach(([product, Quantity], i) => {
        const label = `• ${product}: Product IDs: ${Quantity.join(', ')}`;
        doc.text(label, productX + 4, y + 14 + i * 6);
    });

    const bottomY = y + 52 + products.length * 6;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Products: ${products.length}`, productX, bottomY);

    // Table Section
    const headers = [['Client', 'Product', 'IDs', 'Contract Date', 'Deadline', 'Status']];
    const data = filteredContracts.map(contract => [
        contract.Client_Name || '',
        contract.DescriptionOfGood || '',
        (contract.id || contract.Quantity|| '').toString(),
        formatDate(contract.Contract_Date),
        formatDate(contract.Delivery_deadline),
        contract.Status || '',
    ]);

    autoTable(doc, {
        startY: bottomY + 10,
        head: headers,
        body: data,
        styles: {
            fontSize: 10,
            cellPadding: 3,
            overflow: 'linebreak',
        },
        headStyles: {
            fillColor: [22, 101, 52], // Dark green
            textColor: 255,
            fontStyle: 'bold',
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: marginLeft, right: 14 },
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;

    doc.setTextColor(100);
    doc.setFontSize(10);
    doc.text(`Generated on: ${formatDate(today)}`, marginLeft, pageHeight - 18);

    doc.setFontSize(9);
    doc.text('End of Report — Confidential © ' + today.getFullYear(), marginLeft, pageHeight - 10);

    doc.save('Contracts_Report.pdf');
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
        switch (status?.toLowerCase()) {
            case 'complete':
                return '#16a34a'; // green
            case 'in progress':
            case 'inprogress':
                return '#ca8a04'; // yellow
            case 'cancelled':
                return '#dc2626'; // red
            case 'next month':
                return '#2563eb'; // 🔵 blue
            case 'upcoming':
                return '#fb923c'; // 🟠 orange
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
                return formatDateUTC(contract.Contract_Date);
            case 'Delivery_deadline':
                return formatDateUTC(contract.Delivery_deadline);
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

    useEffect(() => {
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
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                    <button
                        onClick={handleStatusUpdate}
                        style={{
                            backgroundColor: '#2563eb',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 14px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            cursor: 'pointer',
                        }}
                    >
                        🔁 Update Contract Status
                    </button>

                    {/* Download Report Button */}
                    <button
                        onClick={handleDownloadReport}
                        style={{
                            backgroundColor: '#10b981',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 14px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            cursor: 'pointer',
                        }}
                    >
                        <FontAwesomeIcon icon={faDownload} /> Download Report
                    </button>
                </div>
                <h2 className="title">📄 All Contracts</h2>
                <Link to="/contracts/create" className="add-button">
                    <FontAwesomeIcon icon={faPlus} /> Add Contract
                </Link>

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
                        <option value="Quantity">Quantity</option>
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
                            <th>Contract Description</th>                            
                            <th>Contract Date</th>
                            <th>Deadline Date</th>
                            <th>Status</th>
                            <th>Contract File</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentContracts.length > 0 ? (
                            currentContracts.map((contract) => (
                                <tr key={contract.ContractId}>
                                    <td>{contract.Client_Name}</td>
                                    <td>{contract.Quantity}</td>
                                    <td>{contract.DescriptionOfGood}</td>                                    
                                    <td>{formatDateUTC(contract.Contract_Date)}</td>
                                    <td>{formatDateUTC(contract.Delivery_deadline)}</td>
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
                                    <td className="actions">
                                        <Link to={`/contracts/update/${contract.ContractId}`} className="edit-link">
                                            <FontAwesomeIcon icon={faPen} /> Edit
                                        </Link>
                                        <button onClick={() => deleteContract(contract.ContractId)} className="delete-button">
                                            <FontAwesomeIcon icon={faTrash} /> Delete
                                        </button>
                                    </td>
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

export default ContractList;
