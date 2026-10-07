import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import OrderTimeline from '../components/tracking/OrderTimeline.jsx';
import RatingPrompt from '../components/tracking/RatingPrompt.jsx';
import { getOrderById } from '../services/orderService.js';
import { useCustomerAuth } from '../context/CustomerAuthContext.jsx';
import PageIntro from '../components/common/PageIntro.jsx';
import StatePanel from '../components/common/StatePanel.jsx';

const OrderTracking = () => {
  const { orderId } = useParams();
  const { isAuthenticated } = useCustomerAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    let active = true;
    setLoading(true); setOrder(null); setError(null);
    getOrderById(orderId)
      .then((res) => { if (active) setOrder(res.data); })
      .catch(() => { if (active) setError('تعذر تحميل الطلب. تأكد إنك داخل بنفس الحساب اللي عمل الطلب.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [orderId, isAuthenticated]);

  if (!isAuthenticated) return <main className="tracking-page"><PageIntro title="تتبع طلبك" /><StatePanel title="سجّل دخولك لمتابعة الطلب" description="تفاصيل الطلب متاحة لصاحب الحساب اللي عمله." to="/login" actionLabel="تسجيل الدخول" /></main>;
  if (loading) return <div className="page-loading">جاري التحميل...</div>;
  if (error || !order) return <main className="tracking-page"><StatePanel error title={error || 'الطلب غير موجود'} to="/account/orders" actionLabel="عرض طلباتي" /></main>;

  return (
    <main className="tracking-page">
      <PageIntro title="تتبع طلبك" description="حالة طلبك حسب آخر تحديث من المطعم." />
      <div className="tracking-header-card">
        <div><span>رقم الطلب</span><strong>#{order.orderNumber}</strong></div>
        <div><span>الفرع</span><strong>{order.branch?.name}</strong></div>
      </div>
      <OrderTimeline order={order} />
      {order.status === 'delivered' && <RatingPrompt orderId={order._id} />}
      <div className="tracking-footer-card">
        <span>الإجمالي: {order.total} جنيه</span>
        <a href={`tel:${order.branch?.phone || '17397'}`} className="contact-branch-btn">تواصل مع الفرع</a>
      </div>
    </main>
  );
};
export default OrderTracking;
