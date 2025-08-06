import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import logo from '../images/Logo/image.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FieldChiefNavBar from '../Component/FieldChiefNavBar';

const CashRequest = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/cashrequest/getAll');
      setData(res.data);
    } catch (error) {
      console.error('Error fetching cash requests:', error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const generatePDF = (row) => {
    setLoading(true);
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageMargin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - 2 * pageMargin;
    let y = pageMargin;

    // Header
    const headerHeight = 25;
    const logoWidth = 20;
    const logoHeight = 20;
    const companyInfoX = pageMargin + logoWidth + 5;

    doc.addImage(logo, 'PNG', pageMargin, y, logoWidth, logoHeight);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text('AMAHIRWE MEZA LTD', companyInfoX, y + 5);
    doc.setFontSize(8);
    doc.text('P.O Box: 3946 Kigali - Rwanda / Tin 102966085', companyInfoX, y + 10);
    doc.text(`Tél: (+250)788972813(250)788458539(+250)785293498`, companyInfoX, y + 15);
    y += headerHeight;
    doc.setLineWidth(0.5);
    doc.line(pageMargin, y, pageWidth - pageMargin, y);

    // Title
    y += 10;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Cash Request Form', pageWidth / 2, y, { align: 'center' });
    y += 8;
    doc.setLineWidth(0.3);
    doc.line(pageWidth / 2 - 25, y, pageWidth / 2 + 25, y);
    y += 10;

    // Form Fields
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Lequisition N°${row.requisition_no}/${new Date().getFullYear()}`, pageMargin, y);
    y += 15;

    doc.text('Tender Name:', pageMargin, y);
    doc.setFont('helvetica', 'bold');
    doc.text(row.tender_name, pageMargin + 30, y);
    doc.setFont('helvetica', 'normal');
    doc.setLineDash([2, 2], 0);
    doc.line(pageMargin, y + 2, pageWidth - pageMargin, y + 2);
    y += 15;

    doc.text('Request For:', pageMargin, y);
    doc.setFont('helvetica', 'bold');
    doc.text(row.request_for, pageMargin + 30, y);
    doc.setFont('helvetica', 'normal');
    doc.line(pageMargin, y + 2, pageWidth - pageMargin, y + 2);
    y += 15;

    doc.text('Amount Request:', pageMargin, y);
    doc.setFont('helvetica', 'bold');
    doc.text(`${row.amount_requested} .......in word. ${row.amount_in_word}`, pageMargin + 30, y);
    doc.setFont('helvetica', 'normal');
    doc.line(pageMargin, y + 2, pageWidth - pageMargin, y + 2);
    y += 20;

    // Signature Block
    doc.setLineDash([], 0);
    doc.setFontSize(10);
    const formattedDate = row.created_at ? row.created_at.slice(0, 10) : '';
    doc.text(`Done at Kigali On: ${formattedDate}.`, pageWidth / 2, y, { align: 'center' });
    y += 30;

    const signatureBlockHeight = 25;
    const blockWidth = contentWidth / 4;
    const signatureLabels = ['Requested By', 'Prepared by Cashier', 'Verified by Accountant', 'Approved By: MD'];

    signatureLabels.forEach((label, index) => {
      const xPos = pageMargin + index * blockWidth;
      doc.text(label, xPos + blockWidth / 2, y, { align: 'center' });
      doc.text('Signature', xPos + blockWidth / 2, y + 15, { align: 'center' });
      doc.line(xPos + 5, y + 17, xPos + blockWidth - 5, y + 17);
    });
    y += signatureBlockHeight + 10;

    const footerY = doc.internal.pageSize.height - 20;
    doc.line(pageMargin, footerY, pageWidth - pageMargin, footerY);
    doc.setFontSize(8);
    doc.text('E-mail: amahirwemeza@gmail.com', pageWidth / 2, footerY + 5, { align: 'center' });
    doc.text("John's House, Plot No. 1061, 2nd Floor, Near MIC House, KN 2 Av, 14", pageWidth / 2, footerY + 9, { align: 'center' });

    doc.save(`CashRequest_${row.requisition_no}.pdf`);
    setLoading(false);
  };

  const dummyData = [
    {
      id: 1,
      requisition_no: 'REQ-001',
      tender_name: 'Construction of New Office Building',
      request_for: 'Purchase of building materials and labor',
      amount_requested: '500,000 RWF',
      amount_in_word: 'Five Hundred Thousand Rwandan Francs Only',
      done_at_date: '06/08',
    },
    {
      id: 2,
      requisition_no: 'REQ-002',
      tender_name: 'IT Equipment Upgrade',
      request_for: 'Server and Network Infrastructure',
      amount_requested: '2,500,000 RWF',
      amount_in_word: 'Two Million Five Hundred Thousand Rwandan Francs Only',
      done_at_date: '05/08',
    },
  ];

  const displayData = data.length > 0 ? data : dummyData;

  const totalPages = Math.ceil(displayData.length / itemsPerPage);

  // Get current page data slice
  const currentData = displayData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination controls handlers
  const goToPage = (page) => {
    if (page < 1) return;
    if (page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div style={{ padding: '20px', background: '#f9f9f9', minHeight: '100vh' }}>
      <FieldChiefNavBar />
      <style>{`
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          background: white;
          border: 1px solid #ddd;
        }
        th, td {
          padding: 10px;
          border: 1px solid #ccc;
          text-align: center;
        }
        th {
          background-color: #2007faff;
          color: white;
        }
        tr:nth-child(even) {
          background-color: #f2f2f2;
        }
        tr:hover {
          background-color: #e6ffe6;
        }
        h2 {
          text-align: center;
          color: #250277ff;
          text-decoration: underline;
          margin-bottom: 10px;
        }
        .btn {
          background-color: #250266ff;
          color: white;
          padding: 6px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
        }
        .btn:hover {
          background-color: #218838;
        }
        .btn:disabled {
          background-color: gray;
          cursor: not-allowed;
        }
        .add-button {
          display: inline-block;
          margin-bottom: 20px;
          background-color: #250266ff;
          color: white;
          padding: 8px 14px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          transition: background-color 0.3s ease;
          font-size: 16px;
        }
        .add-button:hover {
          background-color: #218838;
        }
        .pagination {
          display: flex;
          justify-content: center;
          margin-top: 20px;
          gap: 8px;
          flex-wrap: wrap;
        }
        .page-btn {
          background-color: #250266ff;
          border: none;
          color: white;
          padding: 8px 14px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.3s ease;
        }
        .page-btn:hover {
          background-color: #218838;
        }
        .page-btn.disabled, .page-btn[disabled] {
          background-color: gray;
          cursor: not-allowed;
        }
        .page-btn.active {
          background-color: #007bff;
          cursor: default;
        }
      `}</style>

      <Link to="/CashRequest/create" className="add-button">
        <FontAwesomeIcon icon={faPlus} /> Add Client
      </Link>

      <h2>Cash Requests</h2>

      <table>
        <thead>
          <tr>
            <th>Requisition No</th>
            <th>Tender Name</th>
            <th>Amount</th>
            <th>Download PDF</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((row) => (
            <tr key={row.id}>
              <td>{row.requisition_no}</td>
              <td>{row.tender_name}</td>
              <td>{row.amount_requested}</td>
              <td>
                <button onClick={() => generatePDF(row)} className="btn" disabled={loading}>
                  {loading ? 'Generating...' : 'Download PDF'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="pagination" aria-label="Pagination Navigation">
        <button
          className="page-btn"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous Page"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={pageNum}
              className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
              onClick={() => goToPage(pageNum)}
              aria-current={currentPage === pageNum ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          className="page-btn"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next Page"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CashRequest;
