import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AdminLayout from '../admin/components/layout/AdminLayout.jsx';

import AdminLogin from '../admin/pages/AdminLogin.jsx';
import Dashboard from '../admin/pages/Dashboard.jsx';
import Orders from '../admin/pages/Orders.jsx';
import Items from '../admin/pages/Items.jsx';
import Categories from '../admin/pages/Categories.jsx';
import Inventory from '../admin/pages/Inventory.jsx';
import Branches from '../admin/pages/Branches.jsx';
import Offers from '../admin/pages/Offers.jsx';
import CouponsLoyalty from '../admin/pages/CouponsLoyalty.jsx';
import DeliveryZones from '../admin/pages/DeliveryZones.jsx';
import KitchenDisplay from '../admin/pages/KitchenDisplay.jsx';
import Customers from '../admin/pages/Customers.jsx';
import Reports from '../admin/pages/Reports.jsx';
import StaffPermissions from '../admin/pages/StaffPermissions.jsx';
import PriceChangeLog from '../admin/pages/PriceChangeLog.jsx';
import Settings from '../admin/pages/Settings.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

const AdminRoutes = () => (
  <Routes>
    <Route path="login" element={<AdminLogin />} />
    <Route path="kitchen" element={<ProtectedRoute><KitchenDisplay /></ProtectedRoute>} />
    <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
      <Route index element={<Dashboard />} />
      <Route path="orders" element={<Orders />} />
      <Route path="items" element={<Items />} />
      <Route path="categories" element={<Categories />} />
      <Route path="inventory" element={<Inventory />} />
      <Route path="branches" element={<Branches />} />
      <Route path="offers" element={<Offers />} />
      <Route path="coupons" element={<CouponsLoyalty />} />
      <Route path="delivery" element={<DeliveryZones />} />
      <Route path="customers" element={<Customers />} />
      <Route path="reports" element={<Reports />} />
      <Route path="permissions" element={<StaffPermissions />} />
      <Route path="price-log" element={<PriceChangeLog />} />
      <Route path="settings" element={<Settings />} />
    </Route>
  </Routes>
);
export default AdminRoutes;
