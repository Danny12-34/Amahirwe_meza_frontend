// components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <>
      <style>{`
        // .navbar {
        //   background-color: #2563eb;
        //   color: white;
        //   padding: 2px 4px;
        //   display: flex;
        //   justify-content: space-between;
        //   align-items: center;
        //   gape: 20%;
        // }

        // .navbar a {
        //   color: white;
        //   margin-left: 16px;
        //   text-decoration: none;
        //   font-weight: bold;
        // }

        // .navbar a:hover {
        //   text-decoration: underline;
        // }
      `}</style>

      <div className="navbar">
        <div className="logo">Contract Manager</div>
        <div>
          <Link to="/">Home</Link>
          <Link to="/procDash">Procurement Dashboard</Link>
          <Link to="/purchaseorder/List">Purchase_order List</Link>
          <Link to="/supplieorder/List">Suppliy_order List</Link>
          <Link to="/suppliers/List">Supplier List</Link>
          <Link to="/contracts/create">Add Contract</Link>
          <Link to="/clients/List">Client List</Link>
          <Link to="/about">About</Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
