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
    Unit_Price: '',
    Status: 'In Progress',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/v1/purchase-orders/create', form);
      navigate('/purchaseorder/List');
    } catch (error) {
      console.error('Error creating purchase order:', error);
      alert('Failed to create purchase order. Please try again.');
    }
  };

  return (
    <div className="wrapper">
      <ProcurementNavbar />
      <style>{`
        .wrapper {
          background-color: #f3f4f6;
          min-height: 100vh;
          padding: 40px 20px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          font-family: 'Segoe UI', sans-serif;
        }

        .form-container {
          background-color: #ffffff;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          max-width: 850px;
          width: 100%;
        }

        .form-container h2 {
          text-align: center;
          margin-bottom: 24px;
          color: #1f2937;
          font-size: 24px;
        }

        form {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 60px;
          padding-right: 5%;
          padding-left: 5%;

        }

        label {
          font-weight: 600;
          color: #1e3a8a;
          margin-bottom: 6px;
          font-size: 14px;
          display: block;
        }

        input, select {
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background-color: #f9fafb;
          font-size: 15px;
          width: 100%;
          outline: none;
          transition: all 0.3s ease;
        }

        input:focus, select:focus {
          border-color: #2563eb;
          background-color: #fff;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }

        button {
          padding: 14px;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          grid-column: span 2;
          margin-top: 10px;
          transition: background-color 0.3s ease;
        }

        button:hover {
          background-color: #1e3a8a;
        }

        @media (max-width: 600px) {
          form {
            grid-template-columns: 1fr;
          }

          button {
            grid-column: span 1;
          }
        }
      `}</style>

      <div className="form-container">
        <h2>Create Purchase Order</h2>
        <form onSubmit={handleSubmit}>

          <div>
            <label htmlFor="Date_Received">Date Received</label>
            <input
              id="Date_Received"
              type="date"
              name="Date_Received"
              required
              value={form.Date_Received}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="Client_Name">Client Name</label>
            <input
              id="Client_Name"
              type="text"
              name="Client_Name"
              placeholder="Client Name"
              required
              value={form.Client_Name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="Description_of_Goods">Description of Goods</label>
            <input
              id="Description_of_Goods"
              type="text"
              name="Description_of_Goods"
              placeholder="Description of Goods"
              required
              value={form.Description_of_Goods}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="Quantity">P.O Number</label>
            <input
              id="Quantity"
              type="number"
              name="Quantity"
              placeholder="P.O Number"
              required
              value={form.Quantity}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="Unit_Price">Amount</label>
            <input
              id="Unit_Price"
              type="number"
              step="0.01"
              name="Unit_Price"
              placeholder="Amount"
              required
              value={form.Unit_Price}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="Status">Status</label>
            <select
              id="Status"
              name="Status"
              value={form.Status}
              onChange={handleChange}
              required
            >
              <option value="In Progress">In Progress</option>
              <option value="Complete">Complete</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <button type="submit">Create Purchase Order</button>
        </form>
      </div>
    </div>
  );
};

export default CreatePurchaseOrder;
