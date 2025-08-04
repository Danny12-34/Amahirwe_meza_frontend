import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../images/Logo/image.png';

const ProcurementNavbar = () => {
  return (
    <>
      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          background: linear-gradient(135deg, #050394ff, #1cc50d);
          color: white;
          padding: 14px 30px;
          display: flex;
          gap:20%;
          align-items: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          z-index: 10000;
          user-select: none;
          backdrop-filter: saturate(180%) blur(8px);
        }

        body, #root, .app-container {
          padding-top: 60px;
        }

        .logo {
          font-size: 1.8rem;
          font-weight: 800;
          letter-spacing: 1px;
          text-shadow: 1.5px 1.5px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          gap: 1px;
          cursor: default;
          
        }

        .logo img {
          width: 80px;
          height: 65px;
          object-fit: contain;
          border-radius: 90%;

        }

        nav.nav-links {
          display: flex;
          gap: 26px;
        }

        .nav-links a {
          color: white;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          padding: 6px 0;
          position: relative;
          transition: color 0.3s ease;
        }

        .nav-links a:hover {
          color: #d1ffd1;
        }

        @media (max-width: 768px) {
          .navbar {
            flex-direction: column;
            align-items: flex-start;
            padding: 14px 20px;
          }

          nav.nav-links {
            margin-top: 12px;
            flex-wrap: wrap;
            gap: 14px;
            width: 100%;
          }

          .nav-links a {
            flex: 1 1 auto;
            text-align: center;
            padding: 10px 0;
            box-shadow: none;
          }
        }
      `}</style>

      <div className="navbar">
        <div className="logo">
          <img src={logoImg} alt="Logo" />
          AMAHIRWE MEZA Ltd
        </div>
        <nav className="nav-links">
          <Link to="/procDash">Dashboard</Link>
          <Link to="/purchaseorder/List">view Purchase Order</Link>
          <Link to="/suppliers/List">view Supplier</Link>
          <Link to="/contracts/List">view All Contract</Link>
          <Link to="/contracts/List">Logout</Link>
          <Link to="/operacDash">Operation</Link>
        </nav>
      </div>
    </>
  );
};

export default ProcurementNavbar;
