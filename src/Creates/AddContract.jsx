import React, { useState } from 'react';
import API from '../api'; // Make sure this points to your axios instance
import { useNavigate } from 'react-router-dom';

const AddContract = () => {
  const [form, setForm] = useState({
    Client_Name: '',
    DescriptionOfGood: '',
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

    // Append form fields
    Object.entries(form).forEach(([key, value]) => {
      if(value) formData.append(key, value);
    });

    // Append PDF file
    formData.append('contractFile', pdfFile);

    try {
      await API.post('/contracts/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      alert('Contract created successfully!');
      navigate('/'); // Redirect to homepage or contracts list
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to create contract. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create New Contract</h2>
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
            type="number"
            name="Quantity"
            placeholder="Quantity"
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

          <input
            type="date"
            name="Delivery_deadline"
            style={styles.input}
            value={form.Delivery_deadline}
            onChange={handleChange}
          />

          <input
            type="date"
            name="Contract_Date"
            style={styles.input}
            value={form.Contract_Date}
            onChange={handleChange}
          />

          {/* <select
            name="Status"
            style={styles.input}
            value={form.Status}
            onChange={handleChange}
          >
            <option value="In progress">In progress</option>
            <option value="Complete">Complete</option>
            <option value="Cancelled">Cancelled</option>
          </select> */}

          <input
            type="text"
            name="Created_by"
            placeholder="Created By"
            style={styles.input}
            value={form.Created_by}
            onChange={handleChange}
          />

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={styles.input}
            required
          />

          <div style={{ gridColumn: 'span 2', textAlign: 'center' }}>
            <button type="submit" style={styles.button}>
              Save Contract
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',    
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#55b7f8ff',
  },
  card: {
    width: '100%',
    maxWidth: '800px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    padding: '40px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: '24px',
    textAlign: 'center',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px',
    outline: 'none',
  },
  button: {
    backgroundColor: '#2563eb',
    color: '#ffffff', 
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  }
};

export default AddContract;
