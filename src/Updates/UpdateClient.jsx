import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    Client_Name: '',
    Contact_Person: '',
    Email: '',
    Phone: '',
    Location: '',
    Status: 'Active',
  });

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/clients/get/${id}`);
        setForm(res.data);
      } catch (error) {
        console.error('Error fetching client:', error);
      }
    };

    fetchClient();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:8000/api/v1/clients/update/${id}`, form);
      if (res.status === 200) {
        alert('Client updated successfully! Redirecting...');
        navigate('/clients/List'); // Redirect immediately after success
      } else {
        alert('Failed to update client.');
      }
    } catch (error) {
      console.error('Update failed:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="container">
      <style>{`
        .container {
          padding: 24px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 600px;
          margin: auto;
        }
        h2 {
          font-size: 28px;
          margin-bottom: 20px;
          color: #1e40af;
        }
        form {
          display: flex;
          flex-direction: column;
        }
        input, select {
          padding: 10px;
          margin-bottom: 16px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 16px;
        }
        button {
          padding: 12px;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          transition: background-color 0.3s ease;
        }
        button:hover {
          background-color: #1e40af;
        }
      `}</style>

      <h2>Update Client</h2>
      <form onSubmit={handleSubmit}>
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
        <select name="Status" value={form.Status} onChange={handleChange}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button type="submit">Update Client</button>
      </form>
    </div>
  );
};

export default UpdateClient;
