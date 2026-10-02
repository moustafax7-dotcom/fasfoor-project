import { useEffect, useState, useCallback } from 'react';
import KitchenColumn from '../components/kitchen/KitchenColumn.jsx';
import { getOrders, updateOrderStatus } from '../../services/orderService.js';

const columns = [
  { status: 'ready', title: 'جاهز للتسليم' },
  { status: 'preparing', title: 'قيد التحضير' },
  { status: 'new', title: 'جديد' },
];
const REFRESH_INTERVAL = 15000;

const KitchenDisplay = () => {
  const [orders, setOrders] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const load = useCallback(() => {
    getOrders({}).then((res) => {
      const active = (res.data || []).filter((o) => ['new', 'preparing', 'ready', 'out_for_delivery', 'delivered'].includes(o.status));
      setOrders(active); setLastUpdate(new Date());
    }).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (!autoRefresh) return; const interval = setInterval(load, REFRESH_INTERVAL); return () => clearInterval(interval); }, [autoRefresh, load]);

  const handleAdvance = async (id, nextStatus) => { await updateOrderStatus(id, nextStatus); load(); };
  const today = orders.filter((o) => new Date(o.createdAt).toDateString() === new Date().toDateString());
  const countByStatus = (status) => today.filter((o) => o.status === status).length;

  return (
    <div className="kitchen-display-page">
      <div className="kitchen-topbar">
        <button className="kitchen-print-btn">🖨 طباعة التذاكر <span className="kitchen-badge">{countByStatus('new')}</span></button>
        <div className="kitchen-brand"><h1>شاشة المطبخ والطباعة</h1><p>مطعم فسفور للمأكولات البحرية</p></div>
        <button className={`kitchen-refresh-toggle ${autoRefresh ? 'on' : ''}`} onClick={() => setAutoRefresh((r) => !r)}><span className="refresh-dot" /> تحديث تلقائي: {autoRefresh ? 'مفعل' : 'متوقف'}</button>
      </div>
      <div className="kitchen-board">
        {columns.map((col) => <KitchenColumn key={col.status} title={col.title} status={col.status} orders={orders.filter((o) => o.status === col.status)} onAdvance={handleAdvance} />)}
      </div>
      <div className="kitchen-footer">
        <div><span>⏰</span><strong>{lastUpdate.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</strong></div>
        <div><span>🛒 جديد</span><strong>{countByStatus('new')}</strong></div>
        <div><span>🍲 قيد التحضير</span><strong>{countByStatus('preparing')}</strong></div>
        <div><span>✅ جاهز للتسليم</span><strong>{countByStatus('ready')}</strong></div>
        <div><span>🛵 تم التسليم للمندوب</span><strong>{countByStatus('out_for_delivery') + countByStatus('delivered')}</strong></div>
        <div className="kitchen-footer-status"><span className="status-dot" /> متصل</div>
      </div>
    </div>
  );
};
export default KitchenDisplay;
