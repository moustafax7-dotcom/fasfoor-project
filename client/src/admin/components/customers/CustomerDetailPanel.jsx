import { useEffect, useState } from 'react';
import { getCustomerOrders } from '../../../services/customerService.js';
const CustomerDetailPanel = ({ customer, onClose }) => {
  const [orders, setOrders] = useState([]);
  useEffect(() => { if (customer) getCustomerOrders(customer._id).then((res) => setOrders(res.data || [])); }, [customer]);
  if (!customer) return null;
  const initials = customer.name?.split(' ').map((w) => w[0]).slice(0, 2).join('');
  return (
    <div className="customer-panel-overlay" onClick={onClose}>
      <aside className="customer-panel" onClick={(e) => e.stopPropagation()}>
        <button className="close-panel-btn" onClick={onClose}>✕</button>
        <div className="customer-avatar">{initials}</div>
        <h2>{customer.name}</h2>
        <span className="customer-phone">{customer.phone}</span>
        <div className="customer-panel-stats">
          <div><span>تاريخ التسجيل</span><strong>{new Date(customer.createdAt).toLocaleDateString('ar-EG')}</strong></div>
          <div><span>إجمالي الطلبات</span><strong>{customer.totalOrders ?? orders.length}</strong></div>
        </div>
        {customer.addresses?.[0] && <div className="customer-address"><span>العنوان الأساسي</span><p>{customer.addresses[0].fullAddress}</p></div>}
        <div className="customer-orders-list">
          <span>الطلبات السابقة</span>
          {orders.map((o) => <div className="customer-order-row" key={o._id}><span>#{o.orderNumber}</span><span>{o.total} جنيه</span><span className="table-muted">{new Date(o.createdAt).toLocaleDateString('ar-EG')}</span></div>)}
          {!orders.length && <p className="menu-empty">لا يوجد طلبات مسجلة</p>}
        </div>
      </aside>
    </div>
  );
};
export default CustomerDetailPanel;
