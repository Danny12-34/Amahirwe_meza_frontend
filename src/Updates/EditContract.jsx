import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiFileText,
  FiHash,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiUpload,
} from 'react-icons/fi';

const EditContract = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Client_Name: '',
    DescriptionOfGood: '',
    Quantity: '',
    Delivery_location: '',
    Delivery_deadline: '',
    Contract_Date: '',
    Status: '',
    Created_by: '',
    Contr_file_path: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/contracts/get/${id}`);
        if (res.data.success) {
          setFormData(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching contract:', error);
      }
    };

    fetchContract();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      // Append all form fields except Contr_file_path if new file selected
      for (const key in formData) {
        if (key === 'Contr_file_path' && selectedFile) continue;
        data.append(key, formData[key]);
      }

      // Append new file if selected
      if (selectedFile) {
        data.append('contractFile', selectedFile);
      } else {
        // Append existing file path to keep old file on server
        data.append('Contr_file_path', formData.Contr_file_path);
      }

      const response = await axios.put(
        `http://localhost:8000/api/v1/contracts/update/${id}`,
        data,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      if (response.status === 200 && response.data.success) {
        alert('Contract updated successfully');
        navigate('/');
      } else {
        alert('Failed to update contract: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating contract:', error);
      alert('Failed to update contract due to network or server error');
    }
  };

  return (
    <>
      <style>{`
        .edit-contract-container {
          max-width: 900px;
          margin: 40px auto;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #fff;
          padding: 32px 40px;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.12);
        }
        .edit-contract-container h2 {
          margin-bottom: 30px;
          color: #222;
          font-weight: 700;
          font-size: 2rem;
          text-align: center;
        }
        form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px 40px;
          align-items: start;
        }
        label {
          display: flex;
          align-items: center;
          font-weight: 600;
          margin-bottom: 6px;
          color: #555;
          gap: 6px;
        }
        input[type="text"],
        input[type="number"],
        input[type="date"],
        select,
        textarea {
          width: 100%;
          padding: 10px 14px;
          font-size: 15px;
          border: 1.8px solid #ccc;
          border-radius: 6px;
          font-family: inherit;
          resize: vertical;
          transition: border-color 0.3s ease;
        }
        input[type="text"]:focus,
        input[type="number"]:focus,
        input[type="date"]:focus,
        select:focus,
        textarea:focus {
          border-color: #2563eb;
          outline: none;
          box-shadow: 0 0 6px rgba(37, 99, 235, 0.4);
        }
        textarea {
          min-height: 90px;
          grid-column: 1 / 3;
        }
        .current-file,
        .upload-file {
          grid-column: 1 / 3;
        }
        .current-file a {
          color: #2563eb;
          font-weight: 600;
          text-decoration: none;
        }
        .current-file a:hover {
          text-decoration: underline;
        }
        input[type="file"] {
          margin-top: 6px;
        }
        button[type="submit"] {
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 14px 30px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 5px 12px rgba(37, 99, 235, 0.4);
          transition: background-color 0.3s ease;
          display: block;
          margin: 30px auto 0 auto;
        }
        button[type="submit"]:hover {
          background-color: #1e40af;
          box-shadow: 0 6px 15px rgba(30, 64, 175, 0.6);
        }
        @media (max-width: 720px) {
          form {
            grid-template-columns: 1fr;
          }
          textarea,
          .current-file,
          .upload-file {
            grid-column: 1;
          }
        }
      `}</style>

      <div className="edit-contract-container">
        <h2>Edit Contract #{id}</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div>
            <label htmlFor="Client_Name"><FiUser /> Client Name:</label>
            <input
              id="Client_Name"
              type="text"
              name="Client_Name"
              value={formData.Client_Name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="Quantity"><FiHash /> Quantity:</label>
            <input
              id="Quantity"
              type="number"
              name="Quantity"
              value={formData.Quantity}
              onChange={handleChange}
              required
              min={1}
            />
          </div>

          <div>
            <label htmlFor="Delivery_location"><FiMapPin /> Delivery Location:</label>
            <input
              id="Delivery_location"
              type="text"
              name="Delivery_location"
              value={formData.Delivery_location}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="Delivery_deadline"><FiClock /> Delivery Deadline:</label>
            <input
              id="Delivery_deadline"
              type="date"
              name="Delivery_deadline"
              value={formData.Delivery_deadline?.slice(0, 10) || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="Contract_Date"><FiCalendar /> Contract Date:</label>
            <input
              id="Contract_Date"
              type="date"
              name="Contract_Date"
              value={formData.Contract_Date?.slice(0, 10) || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="Created_by"><FiUser /> Created By:</label>
            <input
              id="Created_by"
              type="text"
              name="Created_by"
              value={formData.Created_by}
              onChange={handleChange}
              required
            />
          </div>

          <div className="current-file">
            <label><FiFileText /> Current Contract File:</label>
            {formData.Contr_file_path ? (
              <a
                href={`http://localhost:8000/uploads/contracts/${formData.Contr_file_path}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Existing File
              </a>
            ) : (
              <p>No file uploaded</p>
            )}
          </div>

          <div className="upload-file">
            <label htmlFor="contractFile"><FiUpload /> Upload New Contract File (optional):</label>
            <input
              id="contractFile"
              type="file"
              name="contractFile"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.jpg,.png"
            />
          </div>

          <div style={{ gridColumn: '1 / 3' }}>
            <label htmlFor="DescriptionOfGood"><FiFileText /> Description of Goods:</label>
            <textarea
              id="DescriptionOfGood"
              name="DescriptionOfGood"
              value={formData.DescriptionOfGood}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ gridColumn: '1 / 3' }}>
            <button type="submit"><FiCheckCircle style={{ marginRight: '8px', verticalAlign: 'middle' }} />Update Contract</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditContract;
