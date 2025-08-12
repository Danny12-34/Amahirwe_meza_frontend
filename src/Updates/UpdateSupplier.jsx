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
    Status: 'Active',
    Verifiered: 'No', // This is your DB column for agreement
  });

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/suppliers/get/${id}`);
        if (res.status === 200 && res.data.data) {
          setForm(prev => ({ ...prev, ...res.data.data }));
        }
      } catch (err) {
        console.error('Error fetching supplier:', err);
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
      // Redirect based on Verifiered value
      // if (form.Verifiered === 'Yes') {
      //   console.log("Updated sucessfull");
      // } else {
      //   navigate('/suppliers');  // Redirect to suppliers list page
      // }
      navigate('/suppliers/List');
    } catch (error) {
      console.error('Error updating supplier:', error);
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
          color: #1f2937;
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
          font-size: 16px;
          outline: none;
          transition: border-color 0.3s ease;
        }
        input:focus, select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 3px #2563eb;
        }
        label {
          font-weight: 600;
          margin-bottom: 6px;
          color: #374151;
        }
        button {
          padding: 12px;
          background-color: #059669;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
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
        <label htmlFor="Status">Status</label>
        <select
          id="Status"
          name="Status"
          value={form.Status}
          onChange={handleChange}
          required
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <label htmlFor="Verifiered">Update Agreement?</label>
        <select
          id="Verifiered"
          name="Verifiered"
          value={form.Verifiered}
          onChange={handleChange}
          required
        >
          <option value="N">No</option>
          <option value="Y">Yes</option>
        </select>

        <button type="submit">Update Supplier</button>
      </form>
    </div>
  );
};

export default UpdateSupplier;
