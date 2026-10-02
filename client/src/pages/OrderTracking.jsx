import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import OrderTimeline from '../components/tracking/OrderTimeline.jsx';
import RatingPrompt from '../components/tracking/RatingPrompt.jsx';
import { getOrderById } from '../services/orderService.js';

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOrderById(orderId).then((res) => setOrder(res.data)).catch(() => setError('تعذر إيجاد هذا الطلب')).finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="page-loading">جاري التحميل...</div>;
  if (error || !order) return <div className="page-error">{error}</div>;

  return (
    <main className="tracking-page">
      <h1>تتبع طلبك</h1>
      <div className="tracking-header-card">
        <div><span>رقم الطلب</span><strong>#{order.orderNumber}</strong></div>
        <div><span>الفرع</span><strong>{order.branch?.name}</strong></div>
      </div>
      <OrderTimeline order={order} />
      {order.status === 'delivered' && <RatingPrompt orderId={order._id} />}
      <div className="tracking-footer-card">
        <span>الإجمالي: {order.total} جنيه</span>
        <a href="tel:17397" className="contact-branch-btn">تواصل مع الفرع</a>
      </div>
    </main>
  );
};
export default OrderTracking;
