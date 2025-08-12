import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import ProcurementNavbar from '../Component/ProcurementNavbar';

const AddContract = () => {
  const [form, setForm] = useState({
    Client_Name: '',
    DescriptionOfGood: '',
    Amount_category: '',
    Quantity: '',
    Delivery_location: '',
    Delivery_deadline: '',
    Contract_Date: '',
    Status: 'In progress',
    Created_by: ''
  });

  const [pdfFile, setPdfFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pdfFile) {
      alert('Please select a PDF file.');
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    formData.append('contractFile', pdfFile);

    try {
      await API.post('/contracts/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Contract created successfully!');
      navigate('/contracts/List'); // ✅ Redirect to Danny.jsx
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to create contract. Please try again.');
    }
  };

  return (
    <div style={styles.page}>
      <ProcurementNavbar />
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h2 style={styles.title}>📄 Create New Contract</h2>
          <form onSubmit={handleSubmit} style={styles.form}>

            <input
              type="text"
              name="Client_Name"
              placeholder="Client Name"
              style={styles.input}
              value={form.Client_Name}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="DescriptionOfGood"
              placeholder="Description of Goods"
              style={styles.input}
              value={form.DescriptionOfGood}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="Amount_category"
              placeholder="Amount/Category"
              style={styles.input}
              value={form.Amount_category}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="Quantity"
              placeholder="Contract Number"
              style={styles.input}
              value={form.Quantity}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="Delivery_location"
              placeholder="Delivery Location"
              style={styles.input}
              value={form.Delivery_location}
              onChange={handleChange}
            />

            {/* Labeled Delivery Deadline */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="Delivery_deadline" style={styles.label}>Delivery Deadline</label>
              <input
                type="date"
                id="Delivery_deadline"
                name="Delivery_deadline"
                style={styles.input}
                value={form.Delivery_deadline}
                onChange={handleChange}
              />
            </div>

            {/* Labeled Contract Date */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label htmlFor="Contract_Date" style={styles.label}>Contract Date</label>
              <input
                type="date"
                id="Contract_Date"
                name="Contract_Date"
                style={styles.input}
                value={form.Contract_Date}
                onChange={handleChange}
              />
            </div>

            <input
              type="text"
              name="Created_by"
              placeholder="Created By"
              style={styles.input}
              value={form.Created_by}
              onChange={handleChange}
            />

            <label style={styles.fileLabel}>
              Upload Contract (PDF)
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={styles.fileInput}
                required
              />
            </label>

            <div style={styles.buttonWrapper}>
              <button type="submit" style={styles.button}>💾 Save Contract</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    background: 'linear-gradient(to right, #aaa5fcff, #3005f1ff)',
    minHeight: '100vh',
    paddingTop: '20px',
  },
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    padding: '40px',
    maxWidth: '900px',
    width: '100%',
    animation: 'fadeIn 0.5s ease-in-out',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: '25px',
    textAlign: 'center',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  label: {
    marginBottom: '6px',
    fontWeight: '600',
    color: '#1e3a8a',
    fontSize: '14px',
  },
  fileLabel: {
    gridColumn: 'span 2',
    padding: '12px 16px',
    borderRadius: '8px',
    background: '#f1f5f9',
    border: '1px dashed #2563eb',
    textAlign: 'center',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#2563eb',
    fontWeight: 'bold',
  },
  fileInput: {
    display: 'none',
  },
  buttonWrapper: {
    gridColumn: 'span 2',
    textAlign: 'center',
  },
  button: {
    background: 'linear-gradient(to right, #2563eb, #1e40af)',
    color: '#fff',
    padding: '12px 24px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, background 0.3s ease',
  },
};

export default AddContract;
