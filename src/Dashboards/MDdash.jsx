import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

// IMPORTANT: Adjust this import path to where your MDashboardNavbar.js file is actually located.
import MDashboardNavbar from '../Component/MDashboardNavbar'; // Adjust this path as needed

const MDash = () => {
    
    const [data, setData] = useState({
        operations: {},
        procurement: {},
        clients: {},
        purchaseOrders: {}, // This will now reflect contract data
        suppliers: {},
        supplierOrders: {},
        monthlyPerformance: [],
        contractsSummary: {}, // New state to hold calculated contract summaries for new bars
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getArrayFromResponse = (response) => {
            if (Array.isArray(response.data)) {
                return response.data;
            }
            if (response.data && Array.isArray(response.data.data)) {
                return response.data.data;
            }
            if (response.data && Array.isArray(response.data.results)) {
                return response.data.results;
            }
            return [];
        };

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [
                    contractsRes,
                    suppliersRes,
                    purchaseOrdersRes,
                    supplyOrdersRes,
                    clientsRes,
                ] = await Promise.all([
                    axios.get('http://localhost:8000/api/v1/contracts/getAll'),
                    axios.get('http://localhost:8000/api/v1/suppliers/getAll'),
                    axios.get('http://localhost:8000/api/v1/purchase-orders/getAll'),
                    axios.get('http://localhost:8000/api/v1/supply-orders/getAll'),
                    axios.get('http://localhost:8000/api/v1/clients/getAll'),
                ]);

                const contracts = getArrayFromResponse(contractsRes);
                const clients = getArrayFromResponse(clientsRes);
                const actualPurchaseOrders = getArrayFromResponse(purchaseOrdersRes);
                const suppliers = getArrayFromResponse(suppliersRes);
                const supplyOrders = getArrayFromResponse(supplyOrdersRes);

                // --- Data for 'Purchase Orders Status' now comes from Contracts ---
                const purchaseOrdersDataForDashboard = contracts; // This is intentional as per previous request
                // --- End of change ---

                // --- Dynamic Monthly Performance Data Calculation ---
                const monthlyDataMap = {};

                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                const addDataToMonthlyMap = (item, dateField, type) => {
                    const dateString = item[dateField];
                    if (dateString) {
                        const date = new Date(dateString);
                        if (!isNaN(date.getTime())) {
                            const month = monthNames[date.getMonth()];
                            const year = date.getFullYear();
                            const key = `${month}-${year}`;

                            if (!monthlyDataMap[key]) {
                                monthlyDataMap[key] = { month: key, clients: 0, suppliers: 0, orders: 0 };
                            }
                            monthlyDataMap[key][type]++;
                        }
                    }
                };

                const contractMonthlyStatusMap = {};

                // Populate contractMonthlyStatusMap from contracts
                contracts.forEach(contract => {
                    const date = new Date(contract.Created_at || contract.Date_Received);
                    if (!isNaN(date.getTime())) {
                        const month = monthNames[date.getMonth()];
                        const year = date.getFullYear();
                        const key = `${month}-${year}`;

                        if (!contractMonthlyStatusMap[key]) {
                            contractMonthlyStatusMap[key] = {
                                month: key,
                                'In progress': 0,
                                'Complete': 0,
                                Cancelled: 0,
                            };
                        }

                        const status = contract.Status;
                        if (status in contractMonthlyStatusMap[key]) {
                            contractMonthlyStatusMap[key][status]++;
                        }
                    }
                });

                // Helper: get last 12 months keys (chronological order)
                const getLast12Months = () => {
                    const months = [];
                    const today = new Date();
                    for (let i = 11; i >= 0; i--) {
                        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                        const key = `${monthNames[d.getMonth()]}-${d.getFullYear()}`;
                        months.push(key);
                    }
                    return months;
                };

                const last12Months = getLast12Months();

                // Fill missing months in contractMonthlyStatusMap with zeros
                const contractMonthlyStatusData = last12Months.map(monthKey => {
                    return contractMonthlyStatusMap[monthKey] || {
                        month: monthKey,
                        Completed: 0,
                        'In progress': 0,
                        'Complete': 0,
                        Cancelled: 0,
                        Approved: 0,
                        Rejected: 0,
                    };
                });

                // Similarly for monthlyDataMap (clients, suppliers, orders)
                // const monthlyDataMap = {};

                // Populate monthlyDataMap from clients, suppliers, and orders
                clients.forEach(client => addDataToMonthlyMap(client, 'Created_at', 'clients'));
                suppliers.forEach(supplier => addDataToMonthlyMap(supplier, 'Created_at', 'suppliers'));
                actualPurchaseOrders.forEach(order => addDataToMonthlyMap(order, 'Date_Received', 'orders'));

                // Fill missing months in monthlyDataMap with zeros
                const dynamicMonthlyPerformance = last12Months.map(monthKey => {
                    return monthlyDataMap[monthKey] || { month: monthKey, clients: 0, suppliers: 0, orders: 0 };
                });

                // Current month and year for filtering "new this month"
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();

                // Additional status calculations
                const inNextMonthContracts = contracts.filter(c => c.Status === 'Next Month').length;
                const cancelledContracts = contracts.filter(c => c.Status === 'Cancelled').length;
                const UpcomingContracts = contracts.filter(c => c.Status === 'Upcoming').length;

                setData({
                    operations: {
                        totalTasks: contracts.length,
                        completed: contracts.filter(c => c.Status === 'Completed').length,
                        pending: contracts.filter(c => c.Status === 'In progress').length,
                    },
                    procurement: {
                        activeRequests: contracts.filter(c => c.Status === 'Active' || c.Status === 'In progress').length,
                        approved: contracts.filter(c => c.Status === 'Approved').length,
                        rejected: contracts.filter(c => c.Status === 'Rejected').length,
                    },
                    clients: {
                        total: clients.length,
                        active: clients.filter(c => c.Status === 'Active').length,
                        inactive: clients.filter(c => c.Status === 'Inactive').length,
                        newThisMonth: clients.filter(c => {
                            const date = new Date(c.Created_at);
                            return !isNaN(date.getTime()) && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
                        }).length,
                    },
                    purchaseOrders: {
                        created: purchaseOrdersDataForDashboard.length,
                        completed: purchaseOrdersDataForDashboard.filter(item => item.Status === 'Complete').length, // fixed typo here too
                        pending: purchaseOrdersDataForDashboard.filter(item => item.Status === 'In progress').length,
                    },

                    monthlyContractStatus: contractMonthlyStatusData,

                    suppliers: {
                        total: suppliers.length,
                        approved: suppliers.filter(s => s.Verifiered === 'Y').length,
                        pending: suppliers.filter(s => s.Verifiered === 'N').length,
                        rejected: suppliers.filter(s => s.Verifiered === 'R').length,
                        newThisMonth: suppliers.filter(s => {
                            const date = new Date(s.Created_at);
                            return !isNaN(date.getTime()) && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
                        }).length,
                    },

                    supplierOrders: {
                        placed: supplyOrders.length,
                        pending: supplyOrders.filter(so => so.Status === 'Pending').length,
                        received: supplyOrders.filter(so => so.Status === 'Received').length,

                    },
                    monthlyPerformance: dynamicMonthlyPerformance,
                    contractsSummary: {
                        inNextMonth: inNextMonthContracts,
                        cancelled: cancelledContracts,
                        upcoming: UpcomingContracts,


                    },
                });

            } catch (err) {
                console.error('Error loading dashboard data:', err);
                setError('Failed to load dashboard data. Please ensure your backend is running and accessible. Also check your browser console for CORS errors. Review backend data fields.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const StatCard = ({ label, value, color = '#16a34a', textColor = '#f9fafc' }) => (
        <div
        
            style={{
                flex: '1 1 200px',
                backgroundColor: color, // use the passed color
                borderRadius: 12,
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                padding: '8px 14px',        // reduced top/bottom padding
                margin: 10,
                minWidth: 230,              // increased width
                minHeight: 150,
                color: textColor,
                fontWeight: '700',
                fontSize: '2.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            }}
            title={label}
        >
            
            <div
                style={{
                    fontSize: '1rem',
                    fontWeight: '500',
                    marginBottom: 12,
                    color: textColor,
                }}
            >
                {label}
            </div>
            {value}
        </div>
    );
<h4 style={{ marginBottom: 4, color: '#1f2937', fontSize: '1.1rem' }}>MANAGING DIRECTOR</h4>

    // Modified ProgressBar component to accept a 'color' prop
    const ProgressBar = ({ label, value, max, color }) => {
        const percent = max > 0 ? Math.min((value / max) * 100, 100) : 0;
        return (
            <div style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 6, fontWeight: '600', color: '#334155' }}>{label}</div>
                <div
                    style={{
                        background: '#e2e8f0',
                        borderRadius: 12,
                        height: 18,
                        width: '100%',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            height: '100%',
                            width: `${percent}%`,
                            backgroundColor: color || '#2563eb', // Use the passed color or default to blue
                            borderRadius: 12,
                            transition: 'width 0.4s ease-in-out',
                        }}
                    ></div>
                </div>
                <div
                    style={{
                        marginTop: 4,
                        fontSize: '0.8rem',
                        color: '#475569',
                        textAlign: 'right',
                        fontWeight: '500',
                    }}
                >
                    {value} / {max}
                </div>
            </div>
        );
    };

    const ListPanel = ({ title, items }) => (
        <div
            style={{
                backgroundColor: 'white',
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                padding: 20,
                margin: 10,
                minWidth: 280,
                flex: '1 1 300px',
            }}
        >
            <h3
                style={{
                    borderBottom: '2px solid #2563eb',
                    paddingBottom: 8,
                    marginBottom: 12,
                    color: '#2563eb',
                    fontWeight: '700',
                }}
            >
                {title}
            </h3>
            <ul style={{ listStyleType: 'disc', paddingLeft: 20, color: '#475569', fontSize: '0.9rem' }}>
                {items.length ? (
                    items.map((item, i) => <li key={i} style={{ marginBottom: 6 }}>{item}</li>)
                ) : (
                    <li>No data available.</li>
                )}
            </ul>
        </div>
    );




    const totalTasks = data.operations.totalTasks || 0;
    const completedTasks = data.operations.completed || 0;
    const pendingTasks = data.operations.pending || 0;

    const totalOrders = data.purchaseOrders.created || 0;
    const completedOrders = data.purchaseOrders.completed || 0;
    const pendingOrders = data.purchaseOrders.pending || 0;
    // These variables now correctly pull from contractsSummary
    const nextMonthContractsCount = data.contractsSummary.inNextMonth || 0;
    const cancelledContractsCount = data.contractsSummary.cancelled || 0;
    const UpcomingContractsCount = data.contractsSummary.upcoming || 0;

    const operationsPieData = [
        { name: 'Completed', value: completedTasks, color: '#059669' },
        { name: 'Pending', value: pendingTasks, color: '#ef4444' },
    ];


    const contractStatusPieData = [
        { name: 'Completed', value: data.purchaseOrders.completed || 0, color: '#10b981' },
        { name: 'In Progress', value: data.purchaseOrders.pending || 0, color: '#f59e0b' },
        { name: 'Next Month', value: nextMonthContractsCount, color: '#6366f1' },
        { name: 'Cancelled', value: cancelledContractsCount, color: '#ef4444' },
    ];

    // Updated clientSupplierBarData to include new metrics and individual colors
    const clientSupplierBarData = [
        { name: 'Clients', value: data.clients.total || 0, color: '#2563eb' },
        { name: 'Suppliers', value: data.suppliers.total || 0, color: '#d97706' },
        { name: 'Next Month Contracts', value: nextMonthContractsCount, color: '#4CAF50' },
        { name: 'Cancelled Contracts', value: cancelledContractsCount, color: '#FF5722' },
    ];

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: '#f1f5f9',
            fontFamily: "'Inter', sans-serif",
        }}>
            <MDashboardNavbar />
            

            <div
            
                style={{
                    maxWidth: 2200,
                    margin: '-40px auto 0 auto', // reduced top margin
                    padding: '10px 14px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 20,
                    backgroundColor: '#fcf9faff',
                    borderRadius: 12,
                    flexGrow: 1,
                }}
                
            >
                
                {loading && (
                    <div style={{
                        width: '100%',
                        textAlign: 'center',
                        padding: '50px',
                        fontSize: '1.2rem',
                        color: '#2563eb',
                        fontWeight: 'bold',
                    }}>
                        Loading dashboard data...
                    </div>
                )}

                {error && (
                    <div style={{
                        width: '100%',
                        textAlign: 'center',
                        padding: '50px',
                        fontSize: '1.2rem',
                        color: '#ef4444',
                        fontWeight: 'bold',
                        backgroundColor: '#fee2e2',
                        borderRadius: '8px',
                        border: '1px solid #fca5a5',
                    }}>
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <>
                        <StatCard label="Total Clients" value={data.clients.total || 'N/A'} color="#059669" />
                        <StatCard label="Total Suppliers" value={data.suppliers.total || 'N/A'} color="#d97706" />
                        <StatCard label="Total Contracts" value={totalOrders} color="#2563eb" />
                        <StatCard label="Total Supplier Orders" value={data.supplierOrders.placed || 'N/A'} color="#db2777" />

                        <div
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 12,
                                padding: 20,
                                margin: 10,
                                flex: '1 1 400px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            }}
                        >
                            <h3 style={{ borderBottom: '2px solid #2563eb', paddingBottom: 8, marginBottom: 16, color: '#2563eb' }}>
                                Suppliers Overview
                            </h3>
                            <ProgressBar label="Approved Suppliers" value={data.suppliers.approved || 0} max={data.suppliers.total || 1} color="#059669" />
                            <ProgressBar label="Pending Suppliers" value={data.suppliers.pending || 0} max={data.suppliers.total || 1} color="#f59e0b" />
                            <ProgressBar label="Rejected Suppliers" value={data.suppliers.rejected || 0} max={data.suppliers.total || 1} color="#ef4444" />

                        </div>

                        <div
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 12,
                                padding: 20,
                                margin: 10,
                                flex: '1 1 400px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            }}
                        >
                            <h3 style={{ borderBottom: '2px solid #2563eb', paddingBottom: 8, marginBottom: 16, color: '#2563eb' }}>
                                Contract Status Overview
                            </h3>
                            <ProgressBar label="Completed Contracts" value={completedOrders} max={totalOrders} color="#0bb805ff" />
                            <ProgressBar label="In Progress Contracts" value={pendingOrders} max={totalOrders} color="#f8cc05ff" />
                            {/* Passing specific colors to the progress bars */}
                            <ProgressBar label="Next Month Contracts" value={nextMonthContractsCount} max={totalOrders} color="#030185ff" />
                            <ProgressBar label="Cancelled Contracts" value={cancelledContractsCount} max={totalOrders} color="#ee1404ff" />
                            <ProgressBar label="Upcoming Contracts" value={UpcomingContractsCount} max={totalOrders} color="#048c9eff" />
                        </div>

                        <div

                            style={{
                                backgroundColor: 'white',
                                borderRadius: 12,
                                padding: 20,
                                margin: 10,
                                flex: '1 1 400px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <h3 style={{ borderBottom: '2px solid #2563eb', paddingBottom: 8, marginBottom: 16, color: '#2563eb', width: '100%', textAlign: 'center' }}>
                                Contracts Status Breakdown
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={contractStatusPieData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    >
                                        {contractStatusPieData.map((entry, index) => (
                                            <Cell key={`contract-pie-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>



                        <div
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 12,
                                padding: 20,
                                margin: 10,
                                flex: '1 1 400px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <h3 style={{ borderBottom: '2px solid #2563eb', paddingBottom: 8, marginBottom: 16, color: '#2563eb', width: '100%', textAlign: 'center' }}>
                                Overall Metrics
                            </h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={clientSupplierBarData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="value">
                                        {clientSupplierBarData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 12,
                                padding: 20,
                                margin: 10,
                                flex: '1 1 100%',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <div
                                style={{
                                    width: '70%',
                                    maxWidth: 'none',

                                    margin: '30px auto',
                                    padding: 20,
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 20,
                                    backgroundColor: '#f1f5f9',
                                    borderRadius: 12,
                                    flexGrow: 1,
                                }}
                            >
                                <h3 style={{
                                    borderBottom: '2px solid #2563eb',
                                    paddingBottom: 8,
                                    marginBottom: 16,
                                    color: '#2563eb',
                                    width: '100%',
                                    textAlign: 'center'
                                }}>
                                    Monthly Contract Status Overview
                                </h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={data.monthlyContractStatus}>
                                        <CartesianGrid strokeDasharray="6 6" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="Complete" stackId="a" fill="#10b981" />
                                        <Bar dataKey="In progress" stackId="a" fill="#f59e0b" />
                                        <Bar dataKey="Cancelled" stackId="a" fill="#ef4444" />

                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                        </div>



                        <ListPanel
                            title="Client Details"
                            items={[
                                `Active Clients: ${data.clients.active || 0}`,
                                `Inactive Clients: ${data.clients.inactive || 0}`,
                                // `New This Month: ${data.clients.newThisMonth || 0}`,
                                `Total Clients: ${data.clients.total || 0}`,
                            ]}
                        />

                        <ListPanel
                            title="Suppliers"
                            items={[
                                `Approved: ${data.suppliers.approved || 0}`,
                                `Pending: ${data.suppliers.pending || 0}`,
                                `Rejected: ${data.suppliers.rejected || 0}`,
                                `Total Suppliers: ${data.suppliers.total || 0}`,
                            ]}
                        />


                        <ListPanel
                            title="Supplier Orders"
                            items={[
                                `Orders Placed: ${data.supplierOrders.placed || 0}`,
                                `Orders Pending: ${data.supplierOrders.pending || 0}`,
                                `Orders Received: ${data.supplierOrders.received || 0}`,
                                `Total Supplier Order: ${data.supplierOrders.placed || 0}`,
                            ]}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default MDash;
