import { useState } from 'react';
const nextStatusMap = {
  new: { next: 'preparing', label: 'بدء التحضير' },
  preparing: { next: 'ready', label: 'جاهز للتسليم' },
  ready: { next: 'out_for_delivery', label: 'خرج للتوصيل' },
  out_for_delivery: { next: 'delivered', label: 'تم التوصيل' },
};
const timeAgo = (date) => {
  const diffMin = Math.floor((Date.now() - new Date(date)) / 60000);
  return diffMin < 60 ? `منذ ${diffMin} دقيقة` : `منذ ${Math.floor(diffMin / 60)} ساعة`;
};
const OrderAdminCard = ({ order, onUpdateStatus }) => {
  const [showCancelReason, setShowCancelReason] = useState(false);
  const [reason, setReason] = useState('');
  const action = nextStatusMap[order.status];
  const handleCancel = () => { if (!reason.trim()) return; onUpdateStatus(order._id, 'cancelled', reason); setShowCancelReason(false); };
  return (
    <div className="order-admin-card">
      <div className="order-admin-top"><span className="order-time">{timeAgo(order.createdAt)}</span><span className="order-id">#{order.orderNumber}</span></div>
      <div className="order-admin-customer">
        <span className="branch-pill">📍 {order.branch?.name}</span>
        <h4>{order.customer?.name}</h4>
        <span className="delivery-type">{order.deliveryType === 'delivery' ? 'توصيل' : 'استلام من الفرع'}</span>
      </div>
      <ul className="order-admin-items">{order.items?.map((it, i) => <li key={i}>× {it.quantity} {it.name}</li>)}</ul>
      <div className="order-admin-footer"><span className="order-total">{order.total} جنيه</span></div>
      {order.status === 'cancelled' && order.cancelReason && <p className="cancel-reason">السبب: {order.cancelReason}</p>}
      {action && !showCancelReason && (
        <div className="order-admin-actions">
          <button className="update-status-btn" onClick={() => onUpdateStatus(order._id, action.next)}>{action.label}</button>
          <button className="cancel-order-btn" onClick={() => setShowCancelReason(true)}>إلغاء</button>
        </div>
      )}
      {showCancelReason && (
        <div className="cancel-reason-box">
          <input placeholder="سبب الإلغاء..." value={reason} onChange={(e) => setReason(e.target.value)} />
          <button onClick={handleCancel}>تأكيد الإلغاء</button>
        </div>
      )}
    </div>
  );
};
export default OrderAdminCard;
