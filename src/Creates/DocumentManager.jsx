import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FieldChiefNavBar from '../Component/FieldChiefNavBar';

const allowedDocTypes = ['EBM', 'Report', 'Delivery Note'];

export default function DocumentManager() {
  const [form, setForm] = useState({
    DocID: '',
    DocumentType: allowedDocTypes[0],
    CreatedAt: '',
    uploadDocument: null,
  });
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success'); // success or error
  const [showForm, setShowForm] = useState(false);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/comewith/getAll');
      setDocuments(res.data);
    } catch (error) {
      console.error('Failed to fetch documents', error);
      setMessageType('error');
      setMessage('Failed to fetch documents.');
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, uploadDocument: e.target.files[0] }));
  };

  const resetForm = () => {
    setForm({ DocID: '', DocumentType: allowedDocTypes[0], CreatedAt: '', uploadDocument: null });
    setEditingId(null);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('DocID', form.DocID);
      formData.append('DocumentType', form.DocumentType);
      formData.append('CreatedAt', form.CreatedAt);
      formData.append('uploadDocument', form.uploadDocument);

      const res = await axios.post('http://localhost:8000/api/comewith/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessageType('success');
      setMessage(res.data.message);
      resetForm();
      fetchDocuments();
      setShowForm(false);
    } catch (error) {
      console.error(error);
      setMessageType('error');
      setMessage(error.response?.data?.message || 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await axios.delete(`http://localhost:8000/api/comewith/delete/${id}`);
      setMessageType('success');
      setMessage('Document deleted successfully');
      fetchDocuments();
    } catch (error) {
      console.error(error);
      setMessageType('error');
      setMessage('Failed to delete document');
    }
  };

  const startEdit = (doc) => {
    setEditingId(doc.id);
    setForm({
      DocID: doc.DocID,
      DocumentType: doc.DocumentType,
      CreatedAt: doc.CreatedAt.slice(0, 16),
      uploadDocument: null,
    });
    setShowForm(true);
  };

  const cancelForm = () => {
    resetForm();
    setShowForm(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await axios.put(`http://localhost:8000/api/comewith/update/${editingId}`, {
        DocID: form.DocID,
        DocumentType: form.DocumentType,
        CreatedAt: form.CreatedAt,
      });
      setMessageType('success');
      setMessage('Document updated successfully');
      resetForm();
      fetchDocuments();
      setShowForm(false);
    } catch (error) {
      console.error(error);
      setMessageType('error');
      setMessage('Failed to update document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0; padding: 0; background-color: #f5f7fa;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #34495e;
        }
        .container {
          max-width: 900px;
          margin: 2.5rem auto 4rem;
          background: #ffffff;
          padding: 2rem 2.5rem;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
        }
        h1 {
          text-align: center;
          font-size: 2.8rem;
          margin-bottom: 2rem;
          color: #2c3e50;
          font-weight: 700;
          letter-spacing: 1px;
        }
        h2 {
          margin-top: 3rem;
          margin-bottom: 1rem;
          font-weight: 600;
          border-bottom: 2px solid #2980b9;
          padding-bottom: 0.3rem;
          color: #2c3e50;
        }
        .message {
          max-width: 600px;
          margin: 1rem auto 2rem;
          padding: 1rem 1.2rem;
          border-radius: 8px;
          font-weight: 600;
          text-align: center;
          color: white;
          background-color: ${messageType === 'success' ? '#27ae60' : '#e74c3c'};
          box-shadow: 0 3px 8px rgba(0,0,0,0.15);
        }
        form {
          display: flex;
          flex-wrap: wrap;
          gap: 1.4rem 2rem;
          justify-content: space-between;
          margin-bottom: 2.5rem;
        }
        label {
          flex: 1 1 220px;
          display: flex;
          flex-direction: column;
          font-weight: 600;
          color: #34495e;
          font-size: 1rem;
        }
        label input,
        label select {
          margin-top: 6px;
          padding: 0.55rem 0.75rem;
          font-size: 1rem;
          border-radius: 6px;
          border: 1.8px solid #bdc3c7;
          transition: border-color 0.3s ease;
        }
        label input[type="file"] {
          padding: 3px 0;
        }
        label input:focus,
        label select:focus {
          border-color: #2980b9;
          outline: none;
          box-shadow: 0 0 6px #2980b9aa;
        }
        .form-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 1rem;
          flex-basis: 100%;
          justify-content: flex-start;
        }
        button {
          background-color: #2980b9;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          padding: 0.65rem 1.6rem;
          font-size: 1.05rem;
          font-weight: 600;
          transition: background-color 0.3s ease;
          box-shadow: 0 3px 7px rgb(41 128 185 / 0.4);
        }
        button:disabled {
          background-color: #95a5a6;
          cursor: not-allowed;
          box-shadow: none;
        }
        button:hover:not(:disabled) {
          background-color: #1b5f8a;
          box-shadow: 0 5px 12px rgb(27 94 138 / 0.7);
        }
        .cancel-button {
          background-color: #7f8c8d;
          box-shadow: 0 3px 7px rgb(127 140 141 / 0.4);
          transition: background-color 0.3s ease;
        }
        .cancel-button:hover {
          background-color: #616a6b;
          box-shadow: 0 5px 12px rgb(97 106 107 / 0.7);
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.95rem;
          color: #2c3e50;
          box-shadow: 0 4px 15px rgb(0 0 0 / 0.07);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 2rem;
        }
        thead {
          background-color: #2980b9;
          color: white;
          font-weight: 600;
          text-transform: uppercase;
        }
        th,
        td {
          padding: 0.9rem 1.3rem;
          border-bottom: 1px solid #ddd;
          text-align: left;
        }
        tbody tr {
          background-color: #fefefe;
          transition: background-color 0.3s ease;
        }
        tbody tr:nth-child(even) {
          background-color: #f9fbfc;
        }
        tbody tr:hover {
          background-color: #d9e9f9;
        }
        a {
          color: #2980b9;
          font-weight: 600;
          text-decoration: none;
          transition: text-decoration 0.2s ease;
        }
        a:hover {
          text-decoration: underline;
        }
        .action-buttons button {
          font-size: 0.85rem;
          padding: 0.35rem 0.8rem;
          margin-right: 0.5rem;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          transition: background-color 0.25s ease;
          box-shadow: 0 2px 6px rgb(0 0 0 / 0.1);
        }
        .edit-button {
          background-color: #f39c12;
          color: white;
        }
        .edit-button:hover {
          background-color: #d78c0d;
          box-shadow: 0 4px 9px #d78c0daa;
        }
        .delete-button {
          background-color: #e74c3c;
          color: white;
        }
        .delete-button:hover {
          background-color: #c0392b;
          box-shadow: 0 4px 9px #c0392baa;
        }

        @media (max-width: 600px) {
          form {
            flex-direction: column;
          }
          .form-actions {
            justify-content: center;
          }
          .action-buttons button {
            margin-bottom: 0.7rem;
            margin-right: 0;
            width: 100%;
          }
        }
      `}</style>

      <FieldChiefNavBar />

      <div className="container">
        <h1>Document Manager</h1>

        {message && <div className="message">{message}</div>}

        {!showForm && (
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <button onClick={() => setShowForm(true)}>Create Document</button>
          </div>
        )}

        {showForm && (
          <form onSubmit={editingId ? handleUpdate : handleSubmit} noValidate>
            <label>
              DocID
              <input
                type="text"
                name="DocID"
                value={form.DocID}
                onChange={handleChange}
                required
                placeholder="DOC001"
              />
            </label>

            <label>
              Document Type
              <select
                name="DocumentType"
                value={form.DocumentType}
                onChange={handleChange}
              >
                {allowedDocTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Created At
              <input
                type="datetime-local"
                name="CreatedAt"
                value={form.CreatedAt}
                onChange={handleChange}
                required
              />
            </label>

            {!editingId && (
              <label>
                Upload Document
                <input
                  type="file"
                  name="uploadDocument"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                  onChange={handleFileChange}
                  required
                />
              </label>
            )}

            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {editingId
                  ? loading
                    ? 'Updating...'
                    : 'Update Document'
                  : loading
                  ? 'Uploading...'
                  : 'Upload Document'}
              </button>

              <button
                type="button"
                onClick={cancelForm}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <h2>Uploaded Documents</h2>

        {documents.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
            No documents found.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>DocID</th>
                <th>Type</th>
                <th>Created At</th>
                <th>File</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.DocID}</td>
                  <td>{doc.DocumentType}</td>
                  <td>{new Date(doc.CreatedAt).toLocaleString()}</td>
                  <td>
                    <a
                      href={`http://localhost:8000/${doc.FilePath}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View File
                    </a>
                  </td>
                  <td className="action-buttons">
                    <button
                      onClick={() => startEdit(doc)}
                      className="edit-button"
                      title="Edit Document"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="delete-button"
                      title="Delete Document"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
