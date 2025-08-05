import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProcurementNavbar from '../Component/ProcurementNavbar';

const CreatePurchaseOrder = () => {
  const [form, setForm] = useState({
    Date_Received: '',
    Client_Name: '',
    Description_of_Goods: '',
    Quantity: '',
    Unit_Price: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/v1/purchase-orders/create', form);
      navigate('/purchase-orders');
    } catch (error) {
      console.error('Error creating purchase order:', error);
    }
  };

  return (
    <div className="form-wrapper">
      <ProcurementNavbar />
      <style>{`
        .form-wrapper {
         display: flex;
         justify-content: center;
         align-items: center;
         min-height: 100vh;
         font-family: 'Segoe UI', sans-serif;
         background-color: #f1f5f9;
         padding-top: 30%; /* <-- THIS IS THE PROBLEM */
        }
        .form-container {
          background: white;
          padding: 10px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 600px;
        }
        .form-container h2 {
          text-align: center;
          margin-bottom: 24px;
          color: #1f2937;
        }
        form {
          display: grid;
          grid-template-columns: repeat(2, minmax(200px, 1fr));
          gap: 16px;
        }
        input {
          padding: 10px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          background-color: #f9fafb;
          font-size: 15px;
          max-width: 250px;
        }
        input:focus {
          outline: none;
          border-color: #2563eb;
          background-color: white;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }
        button {
          padding: 12px;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          grid-column: span 2;
        }
        button:hover {
          background-color: #1e3a8a;
        }
      `}</style>

      <div className="form-container">
        <h2>Create Purchase Order</h2>
        <form onSubmit={handleSubmit}>
          <input type="date" name="Date_Received" required value={form.Date_Received} onChange={handleChange} />
          <input type="text" name="Client_Name" placeholder="Client Name" required value={form.Client_Name} onChange={handleChange} />
          <input type="text" name="Description_of_Goods" placeholder="Description of Goods" required value={form.Description_of_Goods} onChange={handleChange} />
          <input type="number" name="Quantity" placeholder="Quantity" required value={form.Quantity} onChange={handleChange} />
          <input type="number" step="0.01" name="Unit_Price" placeholder="Unit Price" required value={form.Unit_Price} onChange={handleChange} />
          <button type="submit">Create Purchase Order</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePurchaseOrder;
