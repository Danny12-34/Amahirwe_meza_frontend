import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const [statusCounts, setStatusCounts] = useState({
    'In progress': 0,
    Complete: 0,
    Canceled: 0,
    'Next Month': 0,
    Upcoming: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get('http://localhost:8000/api/v1/contracts/getAll');
        const contracts = res.data.data || [];

        const counts = {
          'In progress': 0,
          Complete: 0,
          Canceled: 0,
          'Next Month': 0,
          Upcoming: 0,
        };

        contracts.forEach(contract => {
          const statusRaw = contract.Status || 'In progress';
          const normalized = statusRaw.trim().toLowerCase();

          if (normalized === 'in progress' || normalized === 'pending') {
            counts['In progress']++;
          } else if (normalized === 'complete' || normalized === 'completed') {
            counts.Complete++;
          } else if (normalized === 'next month') {
            counts['Next Month']++;
          } else if (normalized === 'upcoming') {
            counts.Upcoming++;
          } else if (normalized === 'canceled' || normalized === 'cancelled') {
            counts.Canceled++;
          } else {
            console.warn(`Unknown status found: "${statusRaw}"`);
          }
        });

        setStatusCounts(counts);
      } catch (err) {
        console.error('Failed to fetch contracts:', err);
        setError('Failed to load contract data.');
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const data = {
    labels: ['In progress', 'Complete', 'Canceled', 'Next Month', 'Upcoming'],
    datasets: [
      {
        label: 'Contracts',
        data: [
          statusCounts['In progress'],
          statusCounts.Complete,
          statusCounts.Canceled,
          statusCounts['Next Month'],
          statusCounts.Upcoming,
        ],
        backgroundColor: ['#FACC15', '#10B981', '#EF4444', '#3B82F6', '#FB923C'], // add orange for Upcoming
        borderWidth: 1,
        radius: '80%',
      },
    ],
  };

  const total = data.datasets[0].data.reduce((acc, val) => acc + val, 0);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#333',
          font: {
            size: 14,
            family: 'Arial',
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const percentage = total ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const chartContainerStyle = {
    height: '300px',
    width: '100%',
    padding: '10px',
    boxSizing: 'border-box',
  };

  if (loading) return <p style={{ padding: 10 }}>Loading chart...</p>;
  if (error) return <p style={{ padding: 10, color: 'red' }}>{error}</p>;

  return (
    <div style={chartContainerStyle}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
