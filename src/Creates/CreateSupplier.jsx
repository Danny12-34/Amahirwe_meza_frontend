import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateSupplier = () => {
  const [form, setForm] = useState({
    Supplier_Name: '',
    ContactPerson: '',
    Email: '',
    Phone: '',
    Location: '',
    Registration_number: '',
    Product_Category: '',
    Address: '',
    Status: 'Active'
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/v1/suppliers/create', form);
      if (res.status === 201 || res.status === 200) {
        alert('Supplier created successfully');
        navigate('/suppliers');
      }
    } catch (error) {
      console.error('Error creating supplier:', error);
      alert('Failed to create supplier');
    }
  };

  return (
    <div className="container">
      <style>{`
        .container {
          max-width: 800px;
          margin: 40px auto;
          padding: 30px;
          border: 1px solid #ddd;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          background: #ffffff;
          font-family: 'Segoe UI', sans-serif;
        }
        h2 {
          font-size: 22px;
          text-align: center;
          margin-bottom: 24px;
          color: #1f2937;
        }
        form {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        .form-group {
          flex: 1 1 45%;
          display: flex;
          flex-direction: column;
        }
        .form-group input,
        .form-group select {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
          margin-top: 5px;
        }
        .form-group input:focus,
        .form-group select:focus {
          border-color: #3b82f6;
          outline: none;
        }
        button {
          padding: 12px 20px;
          background-color: #3b82f6;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 15px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin-top: 20px;
          align-self: flex-end;
        }
        button:hover {
          background-color: #2563eb;
        }
        .full-width {
          flex: 1 1 100%;
        }
      `}</style>

      <h2>Create New Supplier</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Supplier Name</label>
          <input
            type="text"
            name="Supplier_Name"
            required
            value={form.Supplier_Name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Contact Person</label>
          <input
            type="text"
            name="ContactPerson"
            required
            value={form.ContactPerson}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="Email"
            required
            value={form.Email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            name="Phone"
            required
            value={form.Phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="Location"
            required
            value={form.Location}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Registration Number</label>
          <input
            type="text"
            name="Registration_number"
            required
            value={form.Registration_number}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Product Category</label>
          <input
            type="text"
            name="Product_Category"
            required
            value={form.Product_Category}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="Address"
            required
            value={form.Address}
            onChange={handleChange}
          />
        </div>

        <div className="form-group full-width">
          <label>Status</label>
          <select name="Status" value={form.Status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <button type="submit">Create Supplier</button>
      </form>
    </div>
  );
};

export default CreateSupplier;
