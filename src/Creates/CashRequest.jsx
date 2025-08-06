import React, { useState } from 'react';
import axios from 'axios';
import FieldChiefNavBar from '../Component/FieldChiefNavBar';

const CashRequest = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    requisition_no: '',
    tender_name: '',
    request_for: '',
    amount_requested: '',
    amount_in_word: '',
    signature_requested_by: '',
    signature_cashier: '',
    signature_accountant: '',
    signature_md: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/cashrequest/submit', formData);
      if (onSubmitSuccess) onSubmitSuccess();
      setFormData({
        requisition_no: '',
        tender_name: '',
        request_for: '',
        amount_requested: '',
        amount_in_word: '',
        signature_requested_by: '',
        signature_cashier: '',
        signature_accountant: '',
        signature_md: '',
      });
    } catch (error) {
      console.error('Error submitting cash request:', error);
    }
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '30px',
      backgroundColor: '#ffffff',
      boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
      borderRadius: '12px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      fontSize: '32px',
      fontWeight: '600',
      marginBottom: '30px',
      textAlign: 'center',
      color: '#007BFF',
      textTransform: 'uppercase',
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',  // Two columns
      gap: '20px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      fontWeight: '600',
      marginBottom: '6px',
      color: '#333',
      fontSize: '14px',
      textTransform: 'capitalize',
    },
    input: {
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '15px',
      outline: 'none',
      transition: '0.3s',
    },
    buttonWrapper: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '30px',
    },
    button: {
      backgroundColor: '#007BFF',
      color: '#fff',
      padding: '14px 0',
      border: 'none',
      borderRadius: '8px',
      fontSize: '18px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      width: '20%',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
  };

  return (
    <>
      <FieldChiefNavBar />
      <div style={styles.container}>
        <h2 style={styles.title}>Cash Request Form</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.gridContainer}>
            {Object.keys(formData).map((field) => (
              <div key={field} style={styles.inputGroup}>
                <label style={styles.label}>{field.replace(/_/g, ' ')}:</label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  onFocus={(e) =>
                    (e.target.style.boxShadow = '0 0 5px rgba(0,123,255,0.5)')
                  }
                  onBlur={(e) => (e.target.style.boxShadow = 'none')}
                />
              </div>
            ))}
          </div>

          <div style={styles.buttonWrapper}>
            <button
              type="submit"
              style={styles.button}
              onMouseOver={(e) =>
                (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)
              }
              onMouseOut={(e) =>
                (e.target.style.backgroundColor = styles.button.backgroundColor)
              }
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CashRequest;
