import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // This import is essential for `autoTable`
import FieldChiefNavBar from '../Component/FieldChiefNavBar';
import autoTable from "jspdf-autotable";

import {
  faPlus,
  faPen,
  faTrash,
  faChevronLeft,
  faChevronRight,
  faFilePdf,
} from '@fortawesome/free-solid-svg-icons';

const EstimationList = () => {
  const [estimations, setEstimations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('description');
  const [currentPage, setCurrentPage] = useState(1);
  const estimationsPerPage = 5; // <-- Changed here

  const formatNumber = (val) => {
    const num = Number(val);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  const profitColor = (val) => {
    const num = Number(val);
    if (num > 0) return 'green';
    if (num < 0) return 'red';
    return 'orange';
  };

  const fetchEstimations = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/estimation/all');
      setEstimations(res.data || []);
    } catch (error) {
      console.error('Error fetching estimations:', error);
    }
  };

  const deleteEstimation = async (id) => {
    if (window.confirm('Delete this estimation?')) {
      try {
        await axios.delete(`http://localhost:8000/api/estimation/delete/${id}`);
        fetchEstimations();
      } catch (error) {
        console.error('Error deleting estimation:', error);
      }
    }
  };

  useEffect(() => {
    fetchEstimations();
  }, []);

  const filteredEstimations = estimations.filter((est) => {
    const value = (est[searchColumn] || '').toString().toLowerCase();
    return value.includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredEstimations.length / estimationsPerPage);
  const indexOfLast = currentPage * estimationsPerPage;
  const indexOfFirst = indexOfLast - estimationsPerPage;
  const currentEstimations = filteredEstimations.slice(indexOfFirst, indexOfLast);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [filteredEstimations, currentPage, totalPages]);

  const totalProfit = filteredEstimations.reduce((sum, est) => sum + Number(est.profit || 0), 0);

  const generatePDF = (estimation) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Estimation Details", 14, 15);

    const leftColumn = [
      ["Description", estimation.description],
      ["Quantity", estimation.quantity],
      ["U_P_Coting", formatNumber(estimation.u_p_coting)],
      ["T_P_Coting", formatNumber(estimation.t_p_coting)],
      ["U_P_Market", formatNumber(estimation.u_p_market)],
      ["T_P_Market", formatNumber(estimation.t_p_market)],
    ];

    const rightColumn = [
      ["TVA", formatNumber(estimation.tva)],
      ["Exc_TVA", formatNumber(estimation.exc_tva)],
      ["3%", formatNumber(estimation.three_perc)],
      ["T_Taxes", formatNumber(estimation.t_taxes)],
      ["Refund", formatNumber(estimation.refund)],
      ["Profit", formatNumber(estimation.profit)],
    ];

    // Left column table
    autoTable(doc, {
      startY: 25,
      head: [["Field", "Value"]],
      body: leftColumn,
      margin: { left: 14 },
      styles: { fontSize: 10 },
      tableWidth: 80,
    });

    // Right column table - aligned beside the first
    autoTable(doc, {
      startY: 25,
      head: [["Field", "Value"]],
      body: rightColumn,
      margin: { left: 110 },
      styles: { fontSize: 10 },
      tableWidth: 80,
    });

    doc.save(`Estimation_${estimation.id}.pdf`);
  };

  return (
    <div className="container">
      <FieldChiefNavBar />
      <style>{`
        .container { padding: 1rem; font-family: 'Segoe UI'; }
        .title { font-size: 28px; font-weight: bold; margin-bottom: 20px; }
        .add-button {
          background-color: #3b82f6;
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          text-decoration: none;
          display: inline-block;
          margin-bottom: 16px;
          cursor: pointer;
          border: none;
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
        thead { background-color: #05329bff; color: white; }
        tfoot tr {
          font-weight: bold;
          background-color: #f3f4f6;
        }
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
        .profit-negative { color: red; }
        .profit-positive { color: green; }
        .profit-zero { color: orange; }
        .action-buttons {
          display: flex;
          gap: 10px;
          align-items: center;
        }
      `}</style>

      <h2 className="title">📊 Estimations</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/estimation/create" className="add-button">
          <FontAwesomeIcon icon={faPlus} /> Add Estimation
        </Link>
      </div>

      <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
        <select
          className="search-select"
          value={searchColumn}
          onChange={(e) => {
            setSearchColumn(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="description">Description</option>
          <option value="quantity">Quantity</option>
          <option value="u_p_coting">Unit Price Coting</option>
          <option value="t_p_coting">Total Price Coting</option>
          <option value="u_p_market">Unit Price Market</option>
          <option value="t_p_market">Total Price Market</option>
          <option value="profit">Profit</option>
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

      <div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>U_P_Coting</th>
              <th>T_P_Coting</th>
              <th>U_P_Market</th>
              <th>T_P_Market</th>
              <th>TVA</th>
              <th>Exc_TVA</th>
              <th>3%</th>
              <th>T_Taxes</th>
              <th>Refund</th>
              <th>Profit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEstimations.length > 0 ? (
              currentEstimations.map((est) => (
                <tr key={est.id}>
                  <td>{est.description}</td>
                  <td>{est.quantity}</td>
                  <td>{formatNumber(est.u_p_coting)}</td>
                  <td>{formatNumber(est.t_p_coting)}</td>
                  <td>{formatNumber(est.u_p_market)}</td>
                  <td>{formatNumber(est.t_p_market)}</td>
                  <td>{formatNumber(est.tva)}</td>
                  <td>{formatNumber(est.exc_tva)}</td>
                  <td>{formatNumber(est.three_perc)}</td>
                  <td>{formatNumber(est.t_taxes)}</td>
                  <td>{formatNumber(est.refund)}</td>
                  <td style={{ color: profitColor(est.profit) }}>
                    {formatNumber(est.profit)}
                  </td>
                  <td className="action-buttons">
                    <Link to={`/estimation/update/${est.id}`} className="edit-link">
                      <FontAwesomeIcon icon={faPen} />
                    </Link>
                    <button onClick={() => deleteEstimation(est.id)} className="delete-button">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button onClick={() => generatePDF(est)} className="add-button" style={{ padding: '5px 10px' }}>
                      <FontAwesomeIcon icon={faFilePdf} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                  No estimations found.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td>{filteredEstimations.reduce((sum, est) => sum + Number(est.quantity || 0), 0)}</td>
              <td>{formatNumber(filteredEstimations.reduce((sum, est) => sum + Number(est.u_p_coting || 0), 0))}</td>
              <td style={{ color: 'blue' }}>
                {formatNumber(filteredEstimations.reduce((sum, est) => sum + Number(est.t_p_coting || 0), 0))}
              </td>
              <td>{formatNumber(filteredEstimations.reduce((sum, est) => sum + Number(est.u_p_market || 0), 0))}</td>
              <td>{formatNumber(filteredEstimations.reduce((sum, est) => sum + Number(est.t_p_market || 0), 0))}</td>
              <td>{formatNumber(filteredEstimations.reduce((sum, est) => sum + Number(est.tva || 0), 0))}</td>
              <td>{formatNumber(filteredEstimations.reduce((sum, est) => sum + Number(est.exc_tva || 0), 0))}</td>
              <td>{formatNumber(filteredEstimations.reduce((sum, est) => sum + Number(est.three_perc || 0), 0))}</td>
              <td>{formatNumber(filteredEstimations.reduce((sum, est) => sum + Number(est.t_taxes || 0), 0))}</td>
              <td>{formatNumber(filteredEstimations.reduce((sum, est) => sum + Number(est.refund || 0), 0))}</td>
              <td style={{ color: profitColor(totalProfit) }}>{formatNumber(totalProfit)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

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

export default EstimationList;
