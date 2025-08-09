import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import FieldChiefNavBar from '../Component/FieldChiefNavBar';

const API_BASE = 'http://localhost:8000/api/Trash';
const PAGE_SIZE = 10;

export default function DocumentManager() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [form, setForm] = useState({
    DocID: '',
    Description: '',
    CreatedAt: '',
    uploadDocument: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    DocID: '',
    Description: '',
    CreatedAt: '',
  });

  // Search state: selected column and term
  const [searchColumn, setSearchColumn] = useState('DocID'); // default search column
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch documents from API
  async function fetchDocuments() {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/getAll`);
      setDocuments(res.data);
    } catch (err) {
      alert('Failed to fetch documents');
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Handle create form input changes
  const handleInputChange = e => {
    const { name, value, files } = e.target;
    if (name === 'uploadDocument') {
      setForm(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Submit create form
  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.DocID || !form.Description || !form.CreatedAt || !form.uploadDocument) {
      alert('Please fill all fields and select a file.');
      return;
    }

    const data = new FormData();
    data.append('DocID', form.DocID);
    data.append('Description', form.Description);
    data.append('CreatedAt', form.CreatedAt);
    data.append('uploadDocument', form.uploadDocument);

    try {
      await axios.post(`${API_BASE}/create`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Document created!');
      setForm({ DocID: '', Description: '', CreatedAt: '', uploadDocument: null });
      setFormVisible(false);
      fetchDocuments();
      setCurrentPage(1); // reset to first page after creating new document
    } catch (err) {
      alert('Error creating document');
    }
  };

  // Start editing a document
  const startEditing = doc => {
    setEditingId(doc.id);
    setEditForm({
      DocID: doc.DocID,
      Description: doc.Description,
      CreatedAt: doc.CreatedAt ? doc.CreatedAt.slice(0, 16) : '',
    });
  };

  // Handle edit form input changes
  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // Cancel editing mode
  const cancelEditing = () => {
    setEditingId(null);
  };

  // Submit edit form
  const submitEdit = async id => {
    if (!editForm.DocID || !editForm.Description || !editForm.CreatedAt) {
      alert('Please fill all fields.');
      return;
    }
    try {
      await axios.put(`${API_BASE}/update/${id}`, editForm);
      alert('Document updated!');
      setEditingId(null);
      fetchDocuments();
    } catch (err) {
      alert('Failed to update document');
    }
  };

  // Delete document
  const deleteDocument = async id => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      await axios.delete(`${API_BASE}/delete/${id}`);
      alert('Document deleted!');
      fetchDocuments();
    } catch (err) {
      alert('Failed to delete document');
    }
  };

  // Handle search column change (dropdown)
  const handleSearchColumnChange = e => {
    setSearchColumn(e.target.value);
    setSearchTerm(''); // reset search term when changing column
    setCurrentPage(1);
  };

  // Handle search term change (input)
  const handleSearchTermChange = e => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Filter documents based on search column and term (case-insensitive)
  const filteredDocuments = useMemo(() => {
    if (!searchTerm.trim()) return documents;

    const term = searchTerm.toLowerCase();

    return documents.filter(doc => {
      if (searchColumn === 'DocID') {
        return doc.DocID.toLowerCase().includes(term);
      }
      if (searchColumn === 'Description') {
        return doc.Description.toLowerCase().includes(term);
      }
      if (searchColumn === 'CreatedAt') {
        if (!doc.CreatedAt) return false;
        // Check ISO and formatted date string
        return (
          doc.CreatedAt.toLowerCase().includes(term) ||
          new Date(doc.CreatedAt).toLocaleString().toLowerCase().includes(term)
        );
      }
      return false;
    });
  }, [documents, searchColumn, searchTerm]);

  // Pagination calculations
  const pageCount = Math.ceil(filteredDocuments.length / PAGE_SIZE);
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Pagination controls handler
  const goToPage = page => {
    if (page < 1 || page > pageCount) return;
    setCurrentPage(page);
  };

  return (
    <div style={{ maxWidth: 1000, margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <FieldChiefNavBar />

      <h2 style={{ textAlign: 'center' }}>Document Manager</h2>

      <div style={{ marginBottom: 20, textAlign: 'center' }}>
        <button
          onClick={() => setFormVisible(v => !v)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
          }}
        >
          {formVisible ? 'Cancel' : 'Add New Document'}
        </button>
      </div>

      {/* Create form */}
      {formVisible && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: '#f9f9f9',
            padding: 20,
            borderRadius: 8,
            boxShadow: '0 0 8px rgba(0,0,0,0.1)',
            marginBottom: 40,
            maxWidth: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <h3>Create New Document</h3>
          <div style={{ marginBottom: 10 }}>
            <label>DocID: </label>
            <input
              type="text"
              name="DocID"
              value={form.DocID}
              onChange={handleInputChange}
              required
              style={{ padding: 8, width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>Description: </label>
            <input
              type="text"
              name="Description"
              value={form.Description}
              onChange={handleInputChange}
              required
              style={{ padding: 8, width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>Created At: </label>
            <input
              type="datetime-local"
              name="CreatedAt"
              value={form.CreatedAt}
              onChange={handleInputChange}
              required
              style={{ padding: 8, width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 10 }}>
            <label>Upload Document: </label>
            <input
              type="file"
              name="uploadDocument"
              onChange={handleInputChange}
              required
              accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
              style={{ width: '100%' }}
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '12px 30px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
            }}
          >
            Upload Document
          </button>
        </form>
      )}

      {/* Search controls: dropdown + input */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          justifyContent: 'center',
          marginBottom: 20,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <select
          value={searchColumn}
          onChange={handleSearchColumnChange}
          style={{ padding: 8, width: 180, boxSizing: 'border-box' }}
        >
          <option value="DocID">DocID</option>
          <option value="Description">Description</option>
          <option value="CreatedAt">Created At</option>
        </select>

        <input
          type="text"
          placeholder={`Search by ${searchColumn}`}
          value={searchTerm}
          onChange={handleSearchTermChange}
          style={{ padding: 8, width: 300, boxSizing: 'border-box' }}
        />
      </div>

      {/* Document Cards Grid */}
      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading documents...</p>
      ) : paginatedDocuments.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No documents found.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))',
            gap: 20,
          }}
        >
          {paginatedDocuments.map(doc => {
            const filename = doc.FilePath.split(/[/\\]/).pop();

            return (
              <div
                key={doc.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: 10,
                  padding: 15,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  backgroundColor: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {editingId === doc.id ? (
                  <>
                    <div>
                      <div style={{ marginBottom: 10 }}>
                        <label>DocID: </label>
                        <input
                          type="text"
                          name="DocID"
                          value={editForm.DocID}
                          onChange={handleEditChange}
                          style={{ padding: 6, width: '100%', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div style={{ marginBottom: 10 }}>
                        <label>Description: </label>
                        <input
                          type="text"
                          name="Description"
                          value={editForm.Description}
                          onChange={handleEditChange}
                          style={{ padding: 6, width: '100%', boxSizing: 'border-box' }}
                        />
                      </div>

                      <div style={{ marginBottom: 10 }}>
                        <label>Created At: </label>
                        <input
                          type="datetime-local"
                          name="CreatedAt"
                          value={editForm.CreatedAt}
                          onChange={handleEditChange}
                          style={{ padding: 6, width: '100%', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>

                    <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
                      <button
                        onClick={() => submitEdit(doc.id)}
                        style={{
                          flex: 1,
                          backgroundColor: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          padding: 8,
                          cursor: 'pointer',
                          fontWeight: 'bold',
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        style={{
                          flex: 1,
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          padding: 8,
                          cursor: 'pointer',
                          fontWeight: 'bold',
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h4 style={{ margin: '0 0 10px 0' }}>DocID: {doc.DocID}</h4>
                      <p>
                        <strong>Description:</strong> {doc.Description}
                      </p>
                      <p>
                        <strong>Created At:</strong>{' '}
                        {new Date(doc.CreatedAt).toLocaleString()}
                      </p>
                    </div>

                    <a
                      href={`http://localhost:8000/uploadedTrashDocment/${filename}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginTop: 15,
                        padding: 8,
                        backgroundColor: '#007bff',
                        color: 'white',
                        textAlign: 'center',
                        borderRadius: 6,
                        textDecoration: 'none',
                        fontWeight: 'bold',
                      }}
                    >
                      View Document
                    </a>

                    <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
                      <button
                        onClick={() => startEditing(doc)}
                        style={{
                          flex: 1,
                          backgroundColor: '#ffc107',
                          color: 'black',
                          border: 'none',
                          borderRadius: 6,
                          padding: 8,
                          cursor: 'pointer',
                          fontWeight: 'bold',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        style={{
                          flex: 1,
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: 6,
                          padding: 8,
                          cursor: 'pointer',
                          fontWeight: 'bold',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination controls */}
      {pageCount > 1 && (
        <div
          style={{
            marginTop: 30,
            display: 'flex',
            justifyContent: 'center',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '6px 12px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            Prev
          </button>

          {/* Show page numbers */}
          {Array.from({ length: pageCount }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              style={{
                padding: '6px 12px',
                fontWeight: currentPage === pageNum ? 'bold' : 'normal',
                backgroundColor: currentPage === pageNum ? '#007bff' : undefined,
                color: currentPage === pageNum ? 'white' : undefined,
                borderRadius: 4,
                cursor: 'pointer',
              }}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === pageCount}
            style={{
              padding: '6px 12px',
              cursor: currentPage === pageCount ? 'not-allowed' : 'pointer',
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
