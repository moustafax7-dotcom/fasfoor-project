import { useState } from 'react';
import { Link } from 'react-router-dom';
import KitchenColumn from '../components/kitchen/KitchenColumn.jsx';
import { updateOrderStatus } from '../../services/orderService.js';
import { unitLabels } from '../../services/orderWorkflow.js';
import { useOrderFeed } from '../../hooks/useOrderFeed.js';

const columns = [
  { status: 'ready', title: 'جاهز للتسليم' },
  { status: 'preparing', title: 'قيد التحضير' },
  { status: 'new', title: 'جديد' },
];
const KitchenDisplay = () => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { orders, loading, refreshing, error, lastUpdated, refresh } = useOrderFeed('', autoRefresh);
  const activeOrders = orders.filter((order) => ['new', 'preparing', 'ready'].includes(order.status));
  const today = orders.filter((order) => new Date(order.createdAt).toDateString() === new Date().toDateString());
  const count = (status) => today.filter((order) => order.status === status).length;
  const handleAdvance = async (id, status) => { await updateOrderStatus(id, status); refresh(); };
  return (
    <div className="kitchen-display-page">
      <div className="kitchen-topbar">
        <button className="kitchen-print-btn" type="button" disabled={!activeOrders.length || !!error || refreshing} onClick={() => window.print()}>طباعة الطلبات الحالية <span className="kitchen-badge">{activeOrders.length}</span></button>
        <div className="kitchen-brand"><h1>شاشة المطبخ</h1><p>مطعم فسفور للمأكولات البحرية</p><Link to="/admin/orders">العودة للطلبات</Link></div>
        <div className="kitchen-refresh-controls"><button className={`kitchen-refresh-toggle ${autoRefresh ? 'on' : ''}`} type="button" aria-pressed={autoRefresh} onClick={() => setAutoRefresh((value) => !value)}>تحديث كل 15 ثانية: {autoRefresh ? 'مفعل' : 'متوقف'}</button><button className="kitchen-print-btn" type="button" disabled={refreshing} onClick={refresh}>{refreshing ? 'جاري التحديث…' : 'تحديث الآن'}</button></div>
      </div>
      {loading && <p role="status">جاري تحميل الطلبات…</p>}
      {error && <p className="kitchen-error" role="alert">{error}</p>}
      <div className="kitchen-board">{columns.map((column) => <KitchenColumn key={column.status} title={column.title} status={column.status} orders={activeOrders.filter((order) => order.status === column.status)} onAdvance={handleAdvance} />)}</div>
      <div className="kitchen-footer">
        <div><span>آخر تحديث ناجح</span><strong>{lastUpdated ? lastUpdated.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—'}</strong></div>
        <div><span>جديد اليوم</span><strong>{count('new')}</strong></div><div><span>قيد التحضير اليوم</span><strong>{count('preparing')}</strong></div><div><span>جاهز اليوم</span><strong>{count('ready')}</strong></div>
        <div className={`kitchen-footer-status ${error ? 'disconnected' : ''}`} role="status">{error ? 'تعذر الاتصال' : refreshing ? 'جاري التحديث' : lastUpdated ? 'تم جلب البيانات' : 'في انتظار البيانات'}</div>
      </div>
      <section className="kitchen-print-tickets" aria-label="تذاكر طباعة المطبخ">{activeOrders.map((order) => (
        <article className="kitchen-ticket" key={order._id}>
          <h2>فسفور · طلب #{order.orderNumber}</h2><p>{order.branch?.name} · {order.deliveryType === 'pickup' ? 'استلام من الفرع' : 'توصيل'}</p>
          <p>{new Date(order.createdAt).toLocaleString('ar-EG')}</p><p>{order.customer?.name} {order.customer?.phone}</p>
          <ul>{order.items?.map((item, index) => <li key={index}><strong>{item.quantity} × {item.name}</strong> · {unitLabels[item.unit] || item.unit}{!!item.addOns?.length && <p>الإضافات: {item.addOns.map((addon) => addon.name).join('، ')}</p>}</li>)}</ul>
          {order.notes && <p><strong>ملاحظات: </strong>{order.notes}</p>}{order.deliveryType === 'delivery' && <p><strong>العنوان: </strong>{order.deliveryAddress?.fullAddress}</p>}<p>الإجمالي: {order.total} جنيه · الدفع عند الاستلام</p>
        </article>
      ))}</section>
    </div>
  );
};
export default KitchenDisplay;
