import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProcurementNavbar from '../Component/ProcurementNavbar';

const CreateClient = () => {
  const [form, setForm] = useState({
    Client_Name: '',
    Contact_Person: '',
    Email: '',
    Phone: '',
    Location: '',
    Status: 'Active'
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/v1/clients/create', form);
      // Redirect to danny.js page route
      navigate('/clients/List');
    } catch (error) {
      console.error('Error creating client:', error);
    }
  };

  return (
    <div className="form-wrapper">
      <ProcurementNavbar/>
      <style>{`
  body {
    background-color: #f1f5f9;
  }
  .form-wrapper {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Segoe UI', sans-serif;
    
  }
  .form-container {
    background: white;
    padding-top: -10px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 700px;
  }
  .form-container h2 {
    text-align: center;
    margin-bottom: 24px;
    color: #1f2937;
    font-size: 28px;
  }
  .form-container form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    padding-left: 20px;
    padding-bottom: 20px;

    }
  .form-container form .full-width {
    grid-column: span 2;
    padding-top: 10px;
    
  }
  .form-container input,
  .form-container select {
    padding: 12px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 16px;
    background-color: #f9fafb;
    transition: all 0.3s;
    width: 100%;
    max-width: 280px;
  }
  .form-container input:focus,
  .form-container select:focus {
    outline: none;
    border-color: #2563eb;
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  }
  .form-container button {
    padding: 14px;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    padding-left: 10px;
    font-size: 16px;
    transition: background-color 0.3s ease;
    width: 50%;
    max-width: 580px;
  }
  .form-container button:hover {
    background-color: #1e3a8a;
  }
`}</style>

      <div className="form-container">
        <h2>Add New Client</h2>
        <form onSubmit={handleSubmit}>
          {/* Left Column */}
          <input
            type="text"
            name="Client_Name"
            placeholder="Client Name"
            required
            value={form.Client_Name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="Contact_Person"
            placeholder="Contact Person"
            required
            value={form.Contact_Person}
            onChange={handleChange}
          />

          <input
            type="email"
            name="Email"
            placeholder="Email"
            required
            value={form.Email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="Phone"
            placeholder="Phone"
            required
            value={form.Phone}
            onChange={handleChange}
          />

          <input
            type="text"
            name="Location"
            placeholder="Location"
            required
            value={form.Location}
            onChange={handleChange}
          />
          <select
            name="Status"
            value={form.Status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <center><button type="submit" className="full-width">
            Create Client
          </button></center>
          
        </form>
      </div>
    </div>
  );
};

export default CreateClient;
