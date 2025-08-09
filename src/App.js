import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//contracts
import ContractList from './Listes/ContractList';
import AddContract from './Creates/AddContract';
import EditContract from './Updates/EditContract';
import OnlyviewContract_field from './Listes/ViewsOnly/OnlyviewContract_field';


//clients
import ClientList from './Listes/ClientList';
import CreateClient from './Creates/CreateClient';
import UpdateClient from './Updates/UpdateClient';
// import Navbar from './Component/Navbar';

//suppliers
import SupplierList from './Listes/SupplierList';
import CreateSupplier from './Creates/CreateSupplier';
import SupplierLstViewOnlyField from './Listes/ViewsOnly/SupplierListViewOnlyField';
import UpdateSupplier from './Updates/UpdateSupplier';
import SupplierLstViewOnly from './Listes/ViewsOnly/SupplierListViewOnly';
//purchase order
import PurchaseOrderList from './Listes/PurchaseOrderList';
import CreatePurchaseOrder from './Creates/CreatePurchaseOrder';
import UpdatePurchaseOrder from './Updates/UpdatePurchaseOrder';
import Purchaseorder from './Listes/ViewsOnly/purchaseorder(requests)';
import  PurchaseOrderListField from './Listes/ViewsOnly/PurchaseOrderListField';


//SuppliesOrder
import SupplyOrderList from './Listes/SupplyOrderList';
import CreateSupplyOrder from './Creates/CreateSupplyOrder';
import UpdateSupplyOrder from './Updates/UpdateSupplyOrder';

//Dashboards
import ProcurementDashboard from './Dashboards/ProcurementsDash';
import OperationDash from './Dashboards/OperationDash';
import MDdash from './Dashboards/MDdash';
import OnlyviewContract from './Listes/ViewsOnly/OnlyviewContract';
import FieldChiefDashboard from './Dashboards/FieldChiefDashboard';

//Field Chief
import CashRequest from './Creates/CashRequest';
import CashRequestList from './Listes/CashRequestList';
import EstimationList from './Listes/EstimationList';
import CreateEstimation from './Creates/CreateEstimation';
import EstimationEdit from './Updates/EstimationEdit';
import DocumentManager from './Creates/DocumentManager';
import TrashDocuments from './Creates/TrashDocuments';

const App = () => {
  return (
    <div>
      {/* Internal CSS */}
      <style>
        {`
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
          }

          .navbar {
            background-color: #1e3a8a;
            padding: 1rem;
            color: white;
            text-align: center;
            font-size: 1.5rem;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }

          .navbar a {
            color: white;
            text-decoration: none;
            margin: 0 15px;
            font-weight: bold;
          }

          .navbar a:hover {
            text-decoration: underline;
          }

          .app-container {
            padding: 100px 20px 20px; /* Top padding accounts for fixed navbar */
          }
        `}
      </style>

      <Router>
        <div className="app-container">
          <Routes>

            {/* Contract */}

            <Route path="/" element={<ContractList />} />
            <Route path="/contracts/create" element={<AddContract />} />
            <Route path="/contracts/update/:id" element={<EditContract />} />
            <Route path="/contracts/List" element={<ContractList/>} />
            <Route path="/contractviewonly" element={<OnlyviewContract/>} />
            <Route path="/contractviewonlyField" element={<OnlyviewContract_field/>} />


            {/* Clients */}

            <Route path="/clients/create" element={<CreateClient />} />
            <Route path="/clients/List" element={<ClientList />} />
            <Route path="/clients/update/:id" element={<UpdateClient />} />

            {/* Suppliers */}
            <Route path="/supliers/create" element={< CreateSupplier/>} />
            <Route path="/suppliers/List" element={<SupplierList />} />
            <Route path="/suppliers/ListOpera" element={<SupplierLstViewOnly />} />
            <Route path="/suppliers/Listfield" element={<SupplierLstViewOnlyField />} />
            <Route path="/suppliers/update/:id" element={<UpdateSupplier />} />

            {/* Purchase order */}
            <Route path="/purchaseorder/create" element={< CreatePurchaseOrder/>} />
            <Route path="/purchaseorder/List" element={<PurchaseOrderList />} />
            <Route path="/purchaseorder/update/:id" element={<UpdatePurchaseOrder />} />
            <Route path="/purchaseorderOnly" element={<Purchaseorder />} />
            <Route path="/purchaseorderOnlyField" element={<PurchaseOrderListField />} />

            {/* Supply order */}
            <Route path="/supplieorder/create" element={< CreateSupplyOrder/>} />
            <Route path="/supplieorder/List" element={<SupplyOrderList />} />
            <Route path="/supplieorder/update/:id" element={<UpdateSupplyOrder />} />

            {/*dashboards*/}
            <Route path="/procDash" element={<ProcurementDashboard  />} />
            <Route path="/operacDash" element={<OperationDash />} />
            <Route path="/MD_Dash" element={<MDdash />} />
            <Route path="/FC_Dash" element={<FieldChiefDashboard />} />

            {/* FIELD CHIEF */}

            <Route path="/CashRequest/create" element={< CashRequest/>} />
            <Route path="/CashRequest/List" element={<CashRequestList/>} />
            <Route path="/Estimation/List" element={<EstimationList/>} />
            <Route path="/Estimation/create" element={<CreateEstimation/>} />
            <Route path="/estimation/update/:id" element={<EstimationEdit/>} />

            {/* FIELD CHIEF DOCUMENTS*/}


            <Route path="/comewith/create" element={< DocumentManager/>} />

            {/* Trash */}

            <Route path="/Trash/create" element={< TrashDocuments/>} />


          </Routes>
        </div>
      </Router>
      
    </div>
    
  );
};

export default App;
