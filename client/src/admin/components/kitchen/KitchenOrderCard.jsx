import { useEffect, useState } from 'react';
const actionMap = {
  new: { next: 'preparing', label: 'عاجل 🔥', urgent: true },
  preparing: { next: 'ready', label: 'جاهز ✔' },
  ready: { next: 'out_for_delivery', label: 'تسليم للمندوب' },
};
const formatElapsed = (createdAt) => {
  const diff = Math.floor((Date.now() - new Date(createdAt)) / 1000);
  const h = String(Math.floor(diff / 3600)).padStart(2, '0');
  const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
  const s = String(diff % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
};
const KitchenOrderCard = ({ order, onAdvance }) => {
  const [elapsed, setElapsed] = useState(formatElapsed(order.createdAt));
  const action = actionMap[order.status];
  useEffect(() => { const timer = setInterval(() => setElapsed(formatElapsed(order.createdAt)), 1000); return () => clearInterval(timer); }, [order.createdAt]);
  return (
    <div className={`kitchen-order-card col-${order.status}`}>
      <div className="kitchen-order-top"><span className="kitchen-timer">⏱ {elapsed}</span><span className="kitchen-order-id">#{order.orderNumber}</span></div>
      <div className="kitchen-order-customer"><span>{order.customer?.name || 'عميل'}</span><span>👤</span></div>
      <span className="kitchen-branch-pill">📍 {order.branch?.name}</span>
      <ul className="kitchen-items">{order.items?.map((it, i) => <li key={i}>{it.quantity} × {it.name}</li>)}</ul>
      <div className="kitchen-order-time">الوقت: {new Date(order.createdAt).toLocaleDateString('ar-EG', { month: '2-digit', day: '2-digit' })} {new Date(order.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
      {action && <button className={`kitchen-action-btn ${action.urgent ? 'urgent' : ''}`} onClick={() => onAdvance(order._id, action.next)}>{action.label}</button>}
    </div>
  );
};
export default KitchenOrderCard;
