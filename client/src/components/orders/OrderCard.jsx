import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { getOrderById } from '../../services/orderService.js';
import { prepareReorder } from '../../services/cartState.js';

const statusLabels = { new: 'جديد', preparing: 'قيد التحضير', ready: 'جاهز للتسليم', out_for_delivery: 'خرج للتوصيل', delivered: 'تم التوصيل', cancelled: 'ملغي' };
const OrderCard = ({ order }) => {
  const { items, replaceCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleReorder = async () => {
    if (loading) return;
    setLoading(true); setError(null);
    try {
      const response = await getOrderById(order._id);
      const result = prepareReorder(response.data);
      const messages = [
        items.length ? 'إعادة الطلب هتستبدل سلتك الحالية.' : '',
        result.pricesChanged ? 'بعض الأسعار اتغيرت. السلة هتعرض الأسعار الحالية.' : '',
        result.unavailable.length ? `اختيارات غير متاحة وهتتشال: ${result.unavailable.join('، ')}.` : '',
      ].filter(Boolean);
      if (messages.length && !window.confirm(`${messages.join('\n')}\nتكمل وتراجع السلة؟`)) return;
      if (replaceCart(result.cart)) navigate('/cart');
    } catch (err) { setError(err.response?.data?.message || err.message || 'تعذر إعادة الطلب، جرّب تاني'); }
    finally { setLoading(false); }
  };
  const status = order.deliveryType === 'pickup' && order.status === 'delivered' ? 'تم الاستلام من الفرع' : statusLabels[order.status];
  return (
    <div className="order-card">
      <div className="order-card-header"><span className={`order-status status-${order.status}`}>{status}</span><span className="order-branch">{order.branch?.name}</span></div>
      <div className="order-card-meta"><span>#{order.orderNumber}</span><span>{new Date(order.createdAt).toLocaleDateString('ar-EG')}</span></div>
      <div className="order-card-footer"><span>{order.items?.length} أصناف</span><span className="order-total">{order.total} جنيه</span></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="order-card-actions"><button className="reorder-btn" disabled={loading} onClick={handleReorder}>{loading ? 'مراجعة التوفر والأسعار…' : 'إعادة الطلب'}</button><Link to={`/track/${order._id}`} className="track-btn">عرض التفاصيل</Link></div>
    </div>
  );
};
export default OrderCard;
