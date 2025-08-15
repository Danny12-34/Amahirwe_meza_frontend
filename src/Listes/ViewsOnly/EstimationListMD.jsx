import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import FieldChiefNavBar from '../../Component/MDashboardNavbar';
import { faPlus, faPen, faTrash, faFilePdf } from '@fortawesome/free-solid-svg-icons';

const EstimationList = () => {
  const [estimations, setEstimations] = useState([]);
  const [selectedBCode, setSelectedBCode] = useState('');

  const fetchEstimations = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/estimation/all');
      setEstimations(res.data || []);
    } catch (error) {
      console.error('Error fetching estimations:', error);
    }
  };

  useEffect(() => { fetchEstimations(); }, []);

  const formatNumber = (val) => isNaN(Number(val)) ? '0.00' : Number(val).toFixed(2);
  const profitColor = (val) => val > 0 ? 'green' : val < 0 ? 'red' : 'orange';

  const deleteEstimation = async (id) => {
    if (window.confirm("Delete this estimation?")) {
      try {
        await axios.delete(`http://localhost:8000/api/estimation/delete/${id}`);
        fetchEstimations();
      } catch (err) { console.error(err); }
    }
  };

  const distinctBCodes = [...new Set(estimations.map(est => est.B_Code || ''))];

  const totals = estimations.reduce((acc, est) => {
    acc.quantity += Number(est.quantity || 0);
    acc.u_p_coting += Number(est.u_p_coting || 0);
    acc.t_p_coting += Number(est.t_p_coting || 0);
    acc.u_p_market += Number(est.u_p_market || 0);
    acc.t_p_market += Number(est.t_p_market || 0);
    acc.tva += Number(est.tva || 0);
    acc.exc_tva += Number(est.exc_tva || 0);
    acc.three_perc += Number(est.three_perc || 0);
    acc.t_taxes += Number(est.t_taxes || 0);
    acc.refund += Number(est.refund || 0);
    acc.profit += Number(est.profit || 0);
    return acc;
  }, { quantity: 0, u_p_coting: 0, t_p_coting: 0, u_p_market: 0, t_p_market: 0, tva: 0, exc_tva: 0, three_perc: 0, t_taxes: 0, refund: 0, profit: 0 });

  const generatePDFForCode = (bCode) => {
    const items = estimations.filter(est => est.B_Code === bCode);
    if (!items.length) return alert("No data for selected Board Code");

    const boardCommand = items[0]?.Board_command || "N/A";

    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    // Title and Board Command with spacing
    let yPos = 15;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text(`Estimation Report`, 14, yPos);

    yPos += 10; // space between title and command
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor("#008000");
    doc.text(`Board Command: ${boardCommand}`, 14, yPos);

    const tableBody = items.map(est => [
      est.description,
      formatNumber(est.quantity),
      formatNumber(est.u_p_coting),
      formatNumber(est.t_p_coting),
      formatNumber(est.u_p_market),
      formatNumber(est.t_p_market),
      formatNumber(est.tva),
      formatNumber(est.exc_tva),
      formatNumber(est.three_perc),
      formatNumber(est.t_taxes),
      formatNumber(est.refund),
      formatNumber(est.profit)
    ]);

    // totals row
    tableBody.push([
      'TOTAL',
      formatNumber(items.reduce((a, v) => a + Number(v.quantity || 0), 0)),
      formatNumber(items.reduce((a, v) => a + Number(v.u_p_coting || 0), 0)),
      formatNumber(items.reduce((a, v) => a + Number(v.t_p_coting || 0), 0)),
      formatNumber(items.reduce((a, v) => a + Number(v.u_p_market || 0), 0)),
      formatNumber(items.reduce((a, v) => a + Number(v.t_p_market || 0), 0)),
      formatNumber(items.reduce((a, v) => a + Number(v.tva || 0), 0)),
      formatNumber(items.reduce((a, v) => a + Number(v.exc_tva || 0), 0)),
      formatNumber(items.reduce((a, v) => a + Number(v.three_perc || 0), 0)),
      formatNumber(items.reduce((a, v) => a + Number(v.t_taxes || 0), 0)),
      formatNumber(items.reduce((a, v) => a + Number(v.refund || 0), 0)),
      formatNumber(items.reduce((a, v) => a + Number(v.profit || 0), 0)),
    ]);

    autoTable(doc, {
      startY: yPos + 10,
      head: [['Item', 'Qty', 'U_P_Coting', 'T_P_Coting', 'U_P_Market', 'T_P_Market', 'TVA', 'Exc_TVA', '3%', 'T_Taxes', 'Refund', 'Profit']],
      body: tableBody,
      styles: { fontSize: 9, cellPadding: 2, overflow: 'linebreak', valign: 'middle', halign: 'center' },
      columnStyles: {
        0: { cellWidth: 50, halign: 'left' },
        1: { cellWidth: 15 }, 2: { cellWidth: 20 }, 3: { cellWidth: 20 },
        4: { cellWidth: 20 }, 5: { cellWidth: 20 }, 6: { cellWidth: 15 },
        7: { cellWidth: 20 }, 8: { cellWidth: 15 }, 9: { cellWidth: 20 },
        10: { cellWidth: 20 }, 11: { cellWidth: 20 }
      },
      theme: 'grid',
      headStyles: { fillColor: [30, 64, 175], textColor: 255, halign: 'center' },
      didParseCell: (data) => {
        if (data.row.index === tableBody.length - 1) {
          data.cell.styles.fillColor = [255, 223, 186];
          data.cell.styles.textColor = [0, 0, 0];
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });

    doc.save(`Estimation_BCode_${bCode}.pdf`);
  };

  const styles = {
    container: { minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '20px' },
    header: { fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' },
    buttonPrimary: { backgroundColor: '#3b82f6', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' },
    pdfButtonTop: { backgroundColor: '#2563eb', color: 'white', padding: '6px 12px', borderRadius: '5px', border: 'none', cursor: 'pointer', fontSize: '14px', marginLeft: '10px' },
    tableWrapper: { overflowX: 'auto', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginTop: '10px' },
    table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
    th: { border: '1px solid #000', padding: '8px', backgroundColor: '#1e40af', color: 'white', textAlign: 'center', whiteSpace: 'nowrap' },
    td: { border: '1px solid #ccc', padding: '8px', textAlign: 'center', whiteSpace: 'nowrap' },
    actionsTd: { display: 'flex', justifyContent: 'center', gap: '5px' },
    editButton: { backgroundColor: '#facc15', color: '#000', padding: '2px 6px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '10px' },
    deleteButton: { backgroundColor: '#ef4444', color: '#fff', padding: '2px 6px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '10px' },
    totalsRow: { backgroundColor: '#fef3c7', fontWeight: 'bold', color: '#000' },
    distinctCount: { fontWeight: 'bold', fontSize: '36px', marginBottom: '10px', color: '#248606ff' }
  };

  return (
    <div style={styles.container}>
      <FieldChiefNavBar />
      <h2 style={styles.header}>📊 Estimations</h2>

      {/* Display distinct B_Code count */}
      <div style={styles.distinctCount}>
        Board Commands: {distinctBCodes.length}
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        {/* <Link to="/estimation/create" style={styles.buttonPrimary}>
          <FontAwesomeIcon icon={faPlus} /> Add Estimation
        </Link> */}

        <select value={selectedBCode} onChange={(e) => setSelectedBCode(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}>
          <option value="">Select Board Code</option>
          {distinctBCodes.map(code => <option key={code} value={code}>{code}</option>)}
        </select>
        <button onClick={() => generatePDFForCode(selectedBCode)} style={styles.pdfButtonTop}><FontAwesomeIcon icon={faFilePdf} /> Download PDF</button>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              {['B_Code', 'Command', 'Site', 'Item', 'Qty', 'U_P_Coting', 'T_P_Coting', 'U_P_Market', 'T_P_Market', 'TVA', 'Exc_TVA', '3%', 'T_Taxes', 'Refund', 'Profit'].map(col => (
                <th key={col} style={styles.th}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {estimations.map(est => (
              <tr key={est.id}>
                <td style={styles.td}>{est.B_Code}</td>
                <td style={styles.td}>{est.Board_command}</td>
                <td style={styles.td}>{est.Site}</td>
                <td style={styles.td}>{est.description}</td>
                <td style={styles.td}>{formatNumber(est.quantity)}</td>
                <td style={styles.td}>{formatNumber(est.u_p_coting)}</td>
                <td style={styles.td}>{formatNumber(est.t_p_coting)}</td>
                <td style={styles.td}>{formatNumber(est.u_p_market)}</td>
                <td style={styles.td}>{formatNumber(est.t_p_market)}</td>
                <td style={styles.td}>{formatNumber(est.tva)}</td>
                <td style={styles.td}>{formatNumber(est.exc_tva)}</td>
                <td style={styles.td}>{formatNumber(est.three_perc)}</td>
                <td style={styles.td}>{formatNumber(est.t_taxes)}</td>
                <td style={styles.td}>{formatNumber(est.refund)}</td>
                <td style={{ ...styles.td, color: profitColor(est.profit), fontWeight: 'bold' }}>{formatNumber(est.profit)}</td>
                {/* <td style={styles.actionsTd}>
                  <Link to={`/estimation/update/${est.id}`} style={styles.editButton}><FontAwesomeIcon icon={faPen} /></Link>
                  <button onClick={() => deleteEstimation(est.id)} style={styles.deleteButton}><FontAwesomeIcon icon={faTrash} /></button>
                </td> */}
              </tr>
            ))}
            <tr style={styles.totalsRow}>
              <td style={styles.td} colSpan={4}>TOTAL</td>
              <td style={styles.td}>{formatNumber(totals.quantity)}</td>
              <td style={styles.td}>{formatNumber(totals.u_p_coting)}</td>
              <td style={styles.td}>{formatNumber(totals.t_p_coting)}</td>
              <td style={styles.td}>{formatNumber(totals.u_p_market)}</td>
              <td style={styles.td}>{formatNumber(totals.t_p_market)}</td>
              <td style={styles.td}>{formatNumber(totals.tva)}</td>
              <td style={styles.td}>{formatNumber(totals.exc_tva)}</td>
              <td style={styles.td}>{formatNumber(totals.three_perc)}</td>
              <td style={styles.td}>{formatNumber(totals.t_taxes)}</td>
              <td style={styles.td}>{formatNumber(totals.refund)}</td>
              <td style={{ ...styles.td, color: profitColor(totals.profit) }}>{formatNumber(totals.profit)}</td>
              <td style={styles.td}></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EstimationList;
