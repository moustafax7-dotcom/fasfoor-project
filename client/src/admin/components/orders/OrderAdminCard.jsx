import { useState } from 'react';
import { getNextOrderAction, unitLabels } from '../../../services/orderWorkflow.js';
const timeAgo = (date) => {
  const diffMin = Math.floor((Date.now() - new Date(date)) / 60000);
  return diffMin < 60 ? `منذ ${diffMin} دقيقة` : `منذ ${Math.floor(diffMin / 60)} ساعة`;
};
const OrderAdminCard = ({ order, onUpdateStatus }) => {
  const [showCancelReason, setShowCancelReason] = useState(false);
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const action = getNextOrderAction(order);
  const changeStatus = async (status, cancelReason) => {
    if (saving) return; setSaving(true); setError(null);
    try { await onUpdateStatus(order._id, status, cancelReason); setShowCancelReason(false); }
    catch (err) { setError(err.response?.data?.message || 'تعذر تحديث الطلب، حدّث القائمة وحاول تاني'); }
    finally { setSaving(false); }
  };
  return (
    <div className="order-admin-card">
      <div className="order-admin-top"><span className="order-time">{timeAgo(order.createdAt)}</span><span className="order-id">#{order.orderNumber}</span></div>
      <div className="order-admin-customer">
        <span className="branch-pill">📍 {order.branch?.name}</span>
        <h4>{order.customer?.name}</h4>
        <span className="delivery-type">{order.deliveryType === 'delivery' ? 'توصيل' : 'استلام من الفرع'}</span>
      </div>
      <ul className="order-admin-items">{order.items?.map((it, i) => <li key={i}>× {it.quantity} {it.name} · {unitLabels[it.unit] || it.unit}{!!it.addOns?.length && <small>الإضافات: {it.addOns.map((addon) => addon.name).join("، ")}</small>}</li>)}</ul>
      {order.notes && <p className="order-notes">ملاحظات: {order.notes}</p>}
      <div className="order-admin-footer"><span className="order-total">{order.total} جنيه</span></div>
      {order.status === 'cancelled' && order.cancelReason && <p className="cancel-reason">السبب: {order.cancelReason}</p>}
      {action && !showCancelReason && (
        <div className="order-admin-actions">
          <button className="update-status-btn" disabled={saving} onClick={() => changeStatus(action.next)}>{saving ? "جاري الحفظ…" : action.label}</button>
          <button disabled={saving} className="cancel-order-btn" onClick={() => setShowCancelReason(true)}>إلغاء</button>
        </div>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
      {showCancelReason && (
        <div className="cancel-reason-box">
          <input aria-label="سبب الإلغاء" maxLength={250} placeholder="سبب الإلغاء..." value={reason} onChange={(e) => setReason(e.target.value)} />
          <button disabled={saving || !reason.trim()} onClick={() => changeStatus("cancelled", reason.trim())}>تأكيد الإلغاء</button><button type="button" disabled={saving} onClick={() => setShowCancelReason(false)}>رجوع</button>
        </div>
      )}
    </div>
  );
};
export default OrderAdminCard;
