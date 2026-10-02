import { useEffect, useState } from 'react';
import OrderCard from '../components/orders/OrderCard.jsx';
import { useCustomerAuth } from '../context/CustomerAuthContext.jsx';
import { getMyProfile } from '../services/customerAuthService.js';

const MyOrders = () => {
  const { isAuthenticated } = useCustomerAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    getMyProfile().then((res) => setOrders(res.data.orders || [])).catch(() => setError('تعذر تحميل الطلبات')).finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) return <main className="page-error">برجاء تسجيل الدخول لعرض طلباتك</main>;

  return (
    <main className="my-orders-page">
      <h1>الطلبات السابقة</h1>
      {loading && <div className="page-loading">جاري التحميل...</div>}
      {error && <div className="page-error">{error}</div>}
      {!loading && !error && !orders.length && <div className="menu-empty">لا يوجد طلبات سابقة بعد</div>}
      <div className="orders-list">{orders.map((o) => <OrderCard key={o._id} order={o} />)}</div>
    </main>
  );
};
export default MyOrders;
