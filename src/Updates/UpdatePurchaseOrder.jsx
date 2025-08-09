import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const UpdatePurchaseOrder = () => {
  const [form, setForm] = useState({
    Date_Received: '',
    Client_Name: '',
    Description_of_Goods: '',
    Quantity: '',
    Unit_Price: '',
    Status: '',             // Add Status here
  });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/purchase-orders/get/${id}`);
        const data = res.data;

        // Remove time portion if present on date
        if (data.Date_Received) {
          data.Date_Received = data.Date_Received.split('T')[0];
        }

        // Ensure Status is defined to avoid uncontrolled <select>
        setForm({
          Date_Received: data.Date_Received || '',
          Client_Name: data.Client_Name || '',
          Description_of_Goods: data.Description_of_Goods || '',
          Quantity: data.Quantity || '',
          Unit_Price: data.Unit_Price || '',
          Status: data.Status || '',    // Make sure to include this
        });
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };

    fetchOrder();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/v1/purchase-orders/update/${id}`, form);
      navigate('/purchase-orders');
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  return (
    <div className="form-wrapper">
      <style>{`
        .form-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          font-family: 'Segoe UI', sans-serif;
          background-color: #f1f5f9;
        }
        .form-container {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 700px;
        }
        .form-container h2 {
          text-align: center;
          margin-bottom: 24px;
          color: #1f2937;
        }
        form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .input-wrapper {
          display: flex;
          justify-content: center;
        }
        .input-wrapper input,
        .input-wrapper select {
          width: 80%;
          padding: 10px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          background-color: #f9fafb;
          font-size: 15px;
        }
        .input-wrapper input:focus,
        .input-wrapper select:focus {
          outline: none;
          border-color: #2563eb;
          background-color: white;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
        }
        .full-width {
          grid-column: span 2;
        }
        button {
          padding: 14px;
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
        <h2>Update Purchase Order</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <input
              type="date"
              name="Date_Received"
              required
              value={form.Date_Received}
              onChange={handleChange}
            />
          </div>
          <div className="input-wrapper">
            <input
              type="text"
              name="Client_Name"
              placeholder="Client Name"
              required
              value={form.Client_Name}
              onChange={handleChange}
            />
          </div>
          <div className="input-wrapper">
            <input
              type="text"
              name="Description_of_Goods"
              placeholder="Description of Goods"
              required
              value={form.Description_of_Goods}
              onChange={handleChange}
            />
          </div>
          <div className="input-wrapper">
            <input
              type="number"
              name="Quantity"
              placeholder="Quantity"
              required
              value={form.Quantity}
              onChange={handleChange}
            />
          </div>
          <div className="input-wrapper">
            <input
              type="number"
              step="0.01"
              name="Unit_Price"
              placeholder="Unit Price"
              required
              value={form.Unit_Price}
              onChange={handleChange}
            />
          </div>
          <div className="input-wrapper">
            <select
              name="Status"
              value={form.Status}
              onChange={handleChange}
              required
            >
              <option value="">Select Status</option>
              <option value="In Progress">In Progress</option>
              <option value="Complete">Complete</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <button type="submit">Update Purchase Order</button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePurchaseOrder;
