import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateSupplyOrder = () => {
  const [form, setForm] = useState({
    Date_Sent: '',
    Supplier_Name: '',
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
      await axios.post('http://localhost:8000/api/v1/supply-orders/create', form);
      navigate('/supply-orders');
    } catch (error) {
      console.error('Error creating supply order:', error);
    }
  };

  return (
    <div className="form-wrapper">
      <style>{`
        .form-wrapper {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f1f5f9;
          font-family: 'Segoe UI';
        }
        .form-container {
          background: white;
          padding: 40px;
          border-radius: 12px;
          width: 100%;
          max-width: 700px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        input {
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
          width: 100%;
        }
        button {
          grid-column: span 2;
          padding: 14px;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
      `}</style>

      <div className="form-container">
        <h2>Create Supply Order</h2>
        <form onSubmit={handleSubmit}>
          <input type="date" name="Date_Sent" value={form.Date_Sent} onChange={handleChange} required />
          <input type="text" name="Supplier_Name" placeholder="Supplier Name" value={form.Supplier_Name} onChange={handleChange} required />
          <input type="text" name="Description_of_Goods" placeholder="Description of Goods" value={form.Description_of_Goods} onChange={handleChange} required />
          <input type="number" name="Quantity" placeholder="Quantity" value={form.Quantity} onChange={handleChange} required />
          <input type="number" name="Unit_Price" placeholder="Unit Price" value={form.Unit_Price} onChange={handleChange} required />
          <button type="submit">Create Supply Order</button>
        </form>
      </div>
    </div>
  );
};

export default CreateSupplyOrder;