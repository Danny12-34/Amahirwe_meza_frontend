import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ProcurementNavbar from '../Component/ProcurementNavbar';

const EstimationEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        description: '',
        quantity: '',
        u_p_coting: '',
        t_p_coting: '',
        u_p_market: '',
        t_p_market: '',
        tva: '',
        exc_tva: '',
        three_perc: '',
        t_taxes: '',
        refund: '',
        profit: '',
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEstimation = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/estimation/${id}`);
                if (res.data) {
                    setForm({
                        description: res.data.description || '',
                        quantity: res.data.quantity || '',
                        u_p_coting: res.data.u_p_coting || '',
                        t_p_coting: res.data.t_p_coting || '',
                        u_p_market: res.data.u_p_market || '',
                        t_p_market: res.data.t_p_market || '',
                        tva: res.data.tva || '',
                        exc_tva: res.data.exc_tva || '',
                        three_perc: res.data.three_perc || '',
                        t_taxes: res.data.t_taxes || '',
                        refund: res.data.refund || '',
                        profit: res.data.profit || '',
                    });
                } else {
                    setError('Estimation not found');
                }
            } catch (err) {
                setError('Failed to fetch estimation');
            } finally {
                setLoading(false);
            }
        };
        fetchEstimation();
    }, [id]);

    useEffect(() => {
        const qty = parseFloat(form.quantity) || 0;
        const unitPrice = parseFloat(form.u_p_coting) || 0;

        const t_p_coting = qty * unitPrice;
        const u_p_market = unitPrice * 1.1;
        const t_p_market = qty * u_p_market;

        const tva = t_p_coting * 0.18;
        const exc_tva = t_p_coting - tva;
        const three_perc = t_p_coting * 0.03;
        const t_taxes = tva + three_perc;
        const refund = t_taxes * 0.1;

        const profit = t_p_market - t_p_coting - t_taxes + refund;

        setForm((prev) => ({
            ...prev,
            t_p_coting: t_p_coting.toFixed(2),
            u_p_market: u_p_market.toFixed(2),
            t_p_market: t_p_market.toFixed(2),
            tva: tva.toFixed(2),
            exc_tva: exc_tva.toFixed(2),
            three_perc: three_perc.toFixed(2),
            t_taxes: t_taxes.toFixed(2),
            refund: refund.toFixed(2),
            profit: profit.toFixed(2),
        }));
    }, [form.quantity, form.u_p_coting]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (['description', 'quantity', 'u_p_coting'].includes(name)) {
            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8000/api/estimation/update/${id}`, form);
            alert('Estimation updated successfully');
            navigate('/estimation/list');
        } catch (err) {
            alert('Failed to update estimation');
            console.error(err);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div className="container">
            <ProcurementNavbar />

            <style>{`
  .container {
    max-width: 1200px;
    margin: 30px auto;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #fff;
    padding: 3% 4%;
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  }
  h2 {
    text-align: center;
    color: #1e293b;
    margin-bottom: 30px;
    font-weight: 700;
    font-size: 2rem;
  }
  form {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 3 columns */
    gap: 25px 40px; /* vertical and horizontal gaps */
  }
  label {
    display: block;
    font-weight: 600;
    margin-bottom: 8px;
    color: #334155;
    font-size: 1rem;
  }
  input[type="text"],
  input[type="number"] {
    width: 100%;
    padding: 10px 14px;
    font-size: 1rem;
    border: 1.8px solid #cbd5e1;
    border-radius: 8px;
    transition: border-color 0.3s ease;
  }
  input[type="text"]:focus,
  input[type="number"]:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 8px #2563ebaa;
  }
  input[readonly] {
    background-color: #f9fafb;
    color: #64748b;
    font-weight: 600;
  }
  .button-container {
    grid-column: 1 / -1;
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-top: 20px;
  }
  button[type="submit"] {
    flex: 1;
    padding: 14px 0;
    background-color: #2563eb;
    border: none;
    border-radius: 10px;
    color: white;
    font-weight: 700;
    font-size: 1.1rem;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(37, 99, 235, 0.4);
    transition: background-color 0.3s ease;
  }
  button[type="submit"]:hover {
    background-color: #1d4ed8;
  }
  .cancel-link {
    flex: 1;
    padding: 14px 0;
    background-color: #9ca3af;
    color: white;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
    text-align: center;
    box-shadow: 0 3px 6px rgba(156, 163, 175, 0.5);
    transition: background-color 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cancel-link:hover {
    background-color: #6b7280;
  }

  @media (max-width: 992px) {
    form {
      grid-template-columns: repeat(2, 1fr); /* fallback to 2 columns on smaller screens */
    }
  }

  @media (max-width: 600px) {
    form {
      grid-template-columns: 1fr; /* fallback to 1 column on mobile */
    }
  }
`}</style>


            <h2>Edit Estimation</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Description:</label>
                    <input
                        type="text"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Quantity:</label>
                    <input
                        type="number"
                        name="quantity"
                        value={form.quantity}
                        onChange={handleChange}
                        required
                        step="any"
                    />
                </div>

                <div>
                    <label>Unit Price Coting (U_P_Coting):</label>
                    <input
                        type="number"
                        name="u_p_coting"
                        value={form.u_p_coting}
                        onChange={handleChange}
                        required
                        step="any"
                    />
                </div>

                <div>
                    <label>Total Price Coting (T_P_Coting):</label>
                    <input type="number" name="t_p_coting" value={form.t_p_coting} readOnly />
                </div>

                <div>
                    <label>Unit Price Market (U_P_Market):</label>
                    <input type="number" name="u_p_market" value={form.u_p_market} readOnly />
                </div>

                <div>
                    <label>Total Price Market (T_P_Market):</label>
                    <input type="number" name="t_p_market" value={form.t_p_market} readOnly />
                </div>

                <div>
                    <label>TVA:</label>
                    <input type="number" name="tva" value={form.tva} readOnly />
                </div>

                <div>
                    <label>Exc TVA:</label>
                    <input type="number" name="exc_tva" value={form.exc_tva} readOnly />
                </div>

                <div>
                    <label>3%:</label>
                    <input type="number" name="three_perc" value={form.three_perc} readOnly />
                </div>

                <div>
                    <label>Total Taxes (T_Taxes):</label>
                    <input type="number" name="t_taxes" value={form.t_taxes} readOnly />
                </div>

                <div>
                    <label>Refund:</label>
                    <input type="number" name="refund" value={form.refund} readOnly />
                </div>

                <div>
                    <label>Profit:</label>
                    <input type="number" name="profit" value={form.profit} readOnly />
                </div>

                <div className="button-container">
                    <button type="submit">Save Changes</button>
                    <Link to="/estimation/list" className="cancel-link">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default EstimationEdit;
