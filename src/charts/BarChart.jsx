import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BarChart = () => {
  const [monthlyCounts, setMonthlyCounts] = useState(new Array(12).fill(0));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get('http://localhost:8000/api/v1/contracts/getAll');
        const contracts = res.data.data || [];

        // Initialize counts for each month (0: Jan, 11: Dec)
        const counts = new Array(12).fill(0);

        contracts.forEach(contract => {
          if (contract.Contract_Date) {
            const date = new Date(contract.Contract_Date);
            if (!isNaN(date)) {
              const month = date.getMonth(); // 0-based month index
              counts[month]++;
            }
          }
        });

        setMonthlyCounts(counts);
      } catch (err) {
        console.error(err);
        setError('Failed to load contract data');
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Contracts',
        data: monthlyCounts,
        backgroundColor: '#3B82F6',
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#333',
          font: {
            size: 14,
            family: 'Arial',
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#333',
          font: {
            size: 12,
            family: 'Arial',
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: '#333',
          font: {
            size: 12,
            family: 'Arial',
          },
          beginAtZero: true,
          precision: 0,
        },
        grid: {
          color: '#e5e7eb',
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

  if (loading) return <p style={{ padding: 20 }}>Loading chart data...</p>;
  if (error) return <p style={{ padding: 20, color: 'red' }}>{error}</p>;

  return (
    <div style={chartContainerStyle}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
