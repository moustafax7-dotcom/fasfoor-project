import { useEffect, useState } from 'react';
import { getNextOrderAction, unitLabels } from '../../../services/orderWorkflow.js';
const formatElapsed = (createdAt) => {
  const diff = Math.max(0, Math.floor((Date.now() - new Date(createdAt)) / 1000));
  const h = String(Math.floor(diff / 3600)).padStart(2, '0');
  const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
  const s = String(diff % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
};
const KitchenOrderCard = ({ order, onAdvance }) => {
  const [elapsed, setElapsed] = useState(formatElapsed(order.createdAt));
  const action = getNextOrderAction(order);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const advance = async () => {
    if (saving) return; setSaving(true); setError(null);
    try { await onAdvance(order._id, action.next); }
    catch (err) { setError(err.response?.data?.message || 'تعذر تحديث الطلب'); }
    finally { setSaving(false); }
  };
  useEffect(() => { const timer = setInterval(() => setElapsed(formatElapsed(order.createdAt)), 1000); return () => clearInterval(timer); }, [order.createdAt]);
  return (
    <div className={`kitchen-order-card col-${order.status}`}>
      <div className="kitchen-order-top"><span className="kitchen-timer">⏱ {elapsed}</span><span className="kitchen-order-id">#{order.orderNumber}</span></div>
      <div className="kitchen-order-customer"><span>{order.customer?.name || 'عميل'}</span><span>👤</span></div>
      <span className="kitchen-branch-pill">📍 {order.branch?.name}</span>
      <ul className="kitchen-items">{order.items?.map((it, i) => <li key={i}>{it.quantity} × {it.name} · {unitLabels[it.unit] || it.unit}{!!it.addOns?.length && <small>الإضافات: {it.addOns.map((addon) => addon.name).join("، ")}</small>}{it.notes && <small>ملاحظات الصنف: {it.notes}</small>}</li>)}</ul>
      <p className="kitchen-delivery-type">{order.deliveryType === "pickup" ? "استلام من الفرع" : "توصيل"}</p>
      {order.notes && <p className="kitchen-order-notes">ملاحظات: {order.notes}</p>}
      <div className="kitchen-order-time">الوقت: {new Date(order.createdAt).toLocaleDateString('ar-EG', { month: '2-digit', day: '2-digit' })} {new Date(order.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</div>
      {error && <p className="kitchen-error" role="alert">{error}</p>}
      {action && <button className={`kitchen-action-btn ${order.status === 'new' ? 'urgent' : ''}`} disabled={saving} onClick={advance}>{saving ? "جاري الحفظ…" : action.label}</button>}
    </div>
  );
};
export default KitchenOrderCard;
