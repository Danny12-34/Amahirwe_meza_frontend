import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateSupplier = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    Supplier_Name: '',
    Email: '',
    Phone: '',
    Address: '',
    Status: 'Active'
  });

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/suppliers/get/${id}`);
        if (res.status === 200) {
          setForm(res.data.data); // Adjust based on actual response shape
        }
      } catch (err) {
        console.error('Error fetching supplier:', err);
        alert('Could not fetch supplier data');
      }
    };

    fetchSupplier();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/v1/suppliers/update/${id}`, form);
      alert('Supplier updated successfully');
      navigate('/suppliers');
    } catch (error) {
      console.error('Error updating supplier:', error);
      alert('Update failed');
    }
  };

  return (
    <div className="container">
      <style>{`
        .container {
          max-width: 600px;
          margin: auto;
          padding: 24px;
          font-family: Arial, sans-serif;
        }
        h2 {
          font-size: 24px;
          margin-bottom: 20px;
        }
        form {
          display: flex;
          flex-direction: column;
        }
        input, select {
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        button {
          padding: 12px;
          background-color: #059669;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
        }
        button:hover {
          background-color: #047857;
        }
      `}</style>

      <h2>Update Supplier</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="Supplier_Name"
          value={form.Supplier_Name}
          onChange={handleChange}
          required
          placeholder="Supplier Name"
        />
        <input
          type="email"
          name="Email"
          value={form.Email}
          onChange={handleChange}
          required
          placeholder="Email"
        />
        <input
          type="text"
          name="Phone"
          value={form.Phone}
          onChange={handleChange}
          required
          placeholder="Phone"
        />
        <input
          type="text"
          name="Address"
          value={form.Address}
          onChange={handleChange}
          required
          placeholder="Address"
        />
        <select name="Status" value={form.Status} onChange={handleChange}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button type="submit">Update Supplier</button>
      </form>
    </div>
  );
};

export default UpdateSupplier;
