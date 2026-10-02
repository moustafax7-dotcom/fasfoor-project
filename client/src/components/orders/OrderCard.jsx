import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { getOrderById } from '../../services/orderService.js';

const statusLabels = { new: 'جديد', preparing: 'قيد التحضير', ready: 'جاهز للتسليم', out_for_delivery: 'خرج للتوصيل', delivered: 'تم التوصيل', cancelled: 'ملغي' };

const OrderCard = ({ order }) => {
  const { switchBranch, addItem } = useCart();
  const navigate = useNavigate();

  const handleReorder = async () => {
    const ok = switchBranch(order.branch?._id);
    if (!ok) return;
    try {
      const res = await getOrderById(order._id);
      const freshOrder = res.data;
      freshOrder.items.forEach((it) => {
        addItem({
          itemId: it.item?._id || it.item, name: it.name, unit: it.unit, unitPrice: it.unitPrice,
          quantity: it.quantity, addOns: it.addOns?.map((a) => a.name) || [], branchId: order.branch?._id,
        });
      });
      navigate('/cart');
    } catch { alert('تعذر إعادة هذا الطلب، جرّب تاني'); }
  };

  return (
    <div className="order-card">
      <div className="order-card-header">
        <span className={`order-status status-${order.status}`}>{statusLabels[order.status]}</span>
        <span className="order-branch">{order.branch?.name}</span>
      </div>
      <div className="order-card-meta"><span>#{order.orderNumber}</span><span>{new Date(order.createdAt).toLocaleDateString('ar-EG')}</span></div>
      <div className="order-card-footer"><span>{order.items?.length} أصناف</span><span className="order-total">{order.total} جنيه</span></div>
      <div className="order-card-actions">
        <button className="reorder-btn" onClick={handleReorder}>🔁 إعادة الطلب</button>
        <Link to={`/track/${order._id}`} className="track-btn">عرض التفاصيل</Link>
      </div>
    </div>
  );
};
export default OrderCard;
