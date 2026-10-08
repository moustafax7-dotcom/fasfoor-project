import PageIntro from '../components/common/PageIntro.jsx';
import StatePanel from '../components/common/StatePanel.jsx';
import { useEffect, useState } from 'react';
import OrderCard from '../components/orders/OrderCard.jsx';
import { useCustomerAuth } from '../context/CustomerAuthContext.jsx';
import { getMyProfile } from '../services/customerAuthService.js';

const MyOrders = () => {
  const { isAuthenticated, customer } = useCustomerAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) { setOrders([]); setLoading(false); return; }
    let active = true; setOrders([]); setLoading(true); setError(null);
    getMyProfile().then((res) => { if (active) setOrders(res.data.orders || []); }).catch(() => { if (active) setError('تعذر تحميل الطلبات'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [isAuthenticated, customer?.id]);

  if (!isAuthenticated) return <main className="my-orders-page"><PageIntro title="طلباتي" /><StatePanel title="طلباتك محفوظة في حسابك" description="سجّل دخولك لمتابعة حالة طلبك وعرض الطلبات السابقة." to="/login" actionLabel="تسجيل الدخول" /></main>;

  return (
    <main className="my-orders-page">
      <PageIntro title="طلباتي" description="تابع طلبك الحالي أو ارجع لتفاصيل طلباتك السابقة." />
      {loading && <div className="page-loading">جاري التحميل...</div>}
      {error && <StatePanel error title={error} onRetry={() => window.location.reload()} />}
      {!loading && !error && !orders.length && <StatePanel title="لسه مفيش طلبات سابقة" description="أول طلب ليك هيظهر هنا مع حالته وتفاصيله." to="/menu" />}
      <div className="orders-list">{orders.map((o) => <OrderCard key={o._id} order={o} />)}</div>
    </main>
  );
};
export default MyOrders;
