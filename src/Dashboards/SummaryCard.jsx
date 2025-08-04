import React from 'react';

const SummaryCard = ({ title, value, color }) => {
  const cardStyle = {
    backgroundColor: color,
    borderRadius: '16px',
    padding: '20px',
    color: '#fff',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    transition: '0.3s ease',
  };

  const cardHover = {
    ...cardStyle,
    transform: 'scale(1.03)',
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
    >
      <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>{title}</h4>
      <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{value}</p>
    </div>
  );
};

export default SummaryCard;
