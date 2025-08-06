import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProcurementNavbar from '../Component/ProcurementNavbar';

const CreateEstimation = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    description: '',
    quantity: '',
    u_p_coting: '',
    u_p_market: '',
  });

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Calculate totals dynamically
  const quantityNum = parseFloat(formData.quantity) || 0;
  const u_p_cotingNum = parseFloat(formData.u_p_coting) || 0;
  const u_p_marketNum = parseFloat(formData.u_p_market) || 0;

  const t_p_coting = quantityNum * u_p_cotingNum;
  const t_p_market = quantityNum * u_p_marketNum;

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.description || !formData.quantity || !formData.u_p_coting || !formData.u_p_market) {
      setError('Please fill in all fields.');
      return;
    }
    if (isNaN(quantityNum) || isNaN(u_p_cotingNum) || isNaN(u_p_marketNum)) {
      setError('Quantity and Unit Prices must be valid numbers.');
      return;
    }

    setSubmitting(true);

    try {
      await axios.post('http://localhost:8000/api/estimation/create', {
        description: formData.description,
        quantity: quantityNum,
        u_p_coting: u_p_cotingNum,
        t_p_coting,      // calculated field
        u_p_market: u_p_marketNum,
        t_p_market,      // calculated field
      });
      navigate('/estimation'); // redirect to estimation list page
    } catch (err) {
      setError('Failed to create estimation.');
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <ProcurementNavbar />
      <style>{`
        .container { padding: 1rem; font-family: 'Segoe UI'; max-width: 600px; margin: auto; }
        h2 { font-size: 28px; font-weight: bold; margin-bottom: 20px; }
        form { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        label { display: block; margin-bottom: 8px; font-weight: 600; }
        input {
          width: 100%;
          padding: 10px;
          margin-bottom: 16px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 16px;
        }
        .readonly {
          background-color: #f9fafb;
          color: #6b7280;
          cursor: not-allowed;
        }
        button {
          background-color: #3b82f6;
          color: white;
          padding: 12px 20px;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }
        button:disabled {
          background-color: #93c5fd;
          cursor: not-allowed;
        }
        .error {
          color: #ef4444;
          margin-bottom: 16px;
        }
      `}</style>

      <h2>Create New Estimation</h2>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <label>Description</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter description"
          required
        />

        <label>Quantity</label>
        <input
          type="number"
          name="quantity"
          min="0"
          step="any"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Enter quantity"
          required
        />

        <label>Unit Price Coting (U_P_Coting)</label>
        <input
          type="number"
          name="u_p_coting"
          min="0"
          step="any"
          value={formData.u_p_coting}
          onChange={handleChange}
          placeholder="Enter unit price coting"
          required
        />

        <label>Total Price Coting (T_P_Coting)</label>
        <input
          type="number"
          value={t_p_coting.toFixed(2)}
          readOnly
          className="readonly"
          placeholder="Calculated automatically"
        />

        <label>Unit Price Market (U_P_Market)</label>
        <input
          type="number"
          name="u_p_market"
          min="0"
          step="any"
          value={formData.u_p_market}
          onChange={handleChange}
          placeholder="Enter unit price market"
          required
        />

        <label>Total Price Market (T_P_Market)</label>
        <input
          type="number"
          value={t_p_market.toFixed(2)}
          readOnly
          className="readonly"
          placeholder="Calculated automatically"
        />

        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Estimation'}
        </button>
      </form>
    </div>
  );
};

export default CreateEstimation;
