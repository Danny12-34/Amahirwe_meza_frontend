import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const UpdateSupplyOrder = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    Date_Sent: '',
    Supplier_Name: '',
    Description_of_Goods: '',
    Quantity: '',
    Unit_Price: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await axios.get(`http://localhost:8000/api/v1/supply-orders/get/${id}`);
      setForm(res.data);
    };
    fetchOrder();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:8000/api/v1/supply-orders/update/${id}`, form);
    navigate('/supply-orders');
  };

  return (
    <div className="form-wrapper">
      <style>{`
        .form-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #f1f5f9;
          padding: 20px;
        }

        .form-container {
          background: white;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 500px;
        }

        .form-container h2 {
          margin-bottom: 24px;
          color: #1e40af;
          text-align: center;
        }

        form {
          display: flex;
          flex-direction: column;
        }

        input {
          padding: 12px;
          margin-bottom: 16px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 16px;
        }

        input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
        }

        button {
          padding: 12px;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s;
        }

        button:hover {
          background: #1d4ed8;
        }
      `}</style>

      <div className="form-container">
        <h2>Update Supply Order</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="date"
            name="Date_Sent"
            value={form.Date_Sent}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="Supplier_Name"
            placeholder="Supplier Name"
            value={form.Supplier_Name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="Description_of_Goods"
            placeholder="Description of Goods"
            value={form.Description_of_Goods}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="Quantity"
            placeholder="Quantity"
            value={form.Quantity}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="Unit_Price"
            placeholder="Unit Price"
            value={form.Unit_Price}
            onChange={handleChange}
            required
          />
          <button type="submit">Update Supply Order</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateSupplyOrder;
