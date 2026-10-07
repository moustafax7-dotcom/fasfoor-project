import { Routes, Route } from 'react-router-dom';
import Header from '../components/common/Header.jsx';
import Footer from '../components/common/Footer.jsx';
import Home from '../pages/Home.jsx';
import Menu from '../pages/Menu.jsx';
import ItemDetail from '../pages/ItemDetail.jsx';
import Branches from '../pages/Branches.jsx';
import Offers from '../pages/Offers.jsx';
import Cart from '../pages/Cart.jsx';
import Account from '../pages/Account.jsx';
import OrderTracking from '../pages/OrderTracking.jsx';
import Login from '../pages/Login.jsx';
import MyOrders from '../pages/MyOrders.jsx';
import LoyaltyStatus from '../pages/LoyaltyStatus.jsx';
import Favorites from '../pages/Favorites.jsx';
import Addresses from '../pages/Addresses.jsx';
import StatePanel from '../components/common/StatePanel.jsx';

const AppRoutes = () => (
  <div className="storefront">
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/item/:itemId" element={<ItemDetail />} />
      <Route path="/branches" element={<Branches />} />
      <Route path="/offers" element={<Offers />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/account" element={<Account />} />
      <Route path="/account/orders" element={<MyOrders />} />
      <Route path="/account/loyalty" element={<LoyaltyStatus />} />
      <Route path="/account/favorites" element={<Favorites />} />
      <Route path="/account/addresses" element={<Addresses />} />
      <Route path="/track/:orderId" element={<OrderTracking />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<main className="not-found-page"><StatePanel title="الصفحة دي مش موجودة" description="ممكن الرابط يكون اتغير. ارجع للرئيسية أو اختار صفحة من القائمة." to="/" actionLabel="العودة للرئيسية" /></main>} />
    </Routes>
    <Footer />
  </div>
);
export default AppRoutes;
