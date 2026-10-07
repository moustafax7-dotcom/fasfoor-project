import { useEffect, useState } from 'react';
import OrderColumn from '../components/orders/OrderColumn.jsx';
import { updateOrderStatus } from '../../services/orderService.js';
import { getBranches } from '../../services/branchService.js';
import { useOrderFeed } from '../../hooks/useOrderFeed.js';

const columns = [
  { status: 'new', title: 'جديد' },
  { status: 'preparing', title: 'قيد التحضير' },
  { status: 'ready', title: 'جاهز للتسليم' },
  { status: 'out_for_delivery', title: 'خرج للتوصيل' },
  { status: 'delivered', title: 'مكتمل' },
  { status: 'cancelled', title: 'ملغي' },
];

const Orders = () => {
  const [branches, setBranches] = useState([]);
  const [branchFilter, setBranchFilter] = useState('');
  const [search, setSearch] = useState('');
  const [filterError, setFilterError] = useState(null);
  const { orders, loading, refreshing, error, lastUpdated, refresh } = useOrderFeed(branchFilter);
  useEffect(() => { getBranches().then((res) => setBranches(res.data || [])).catch(() => setFilterError('تعذر تحميل الفروع')); }, []);

  const handleUpdateStatus = async (id, status, cancelReason) => {
    try { await updateOrderStatus(id, status, cancelReason); } finally { refresh(); }
  };

  const filteredOrders = orders.filter((o) => !search || o.orderNumber?.toLowerCase().includes(search.trim().toLowerCase()) || o.customer?.name?.includes(search));

  return (
    <div className="admin-orders-page">
      <div className="admin-page-header">
        <h1>الطلبات</h1>
        <div className="admin-filters">
          <select aria-label="تصفية حسب الفرع" value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
            <option value="">كل الفروع</option>
            {branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
          <input aria-label="البحث في الطلبات" placeholder="البحث برقم الطلب أو اسم العميل..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="order-feed-toolbar"><span>آخر تحديث ناجح: {lastUpdated ? lastUpdated.toLocaleTimeString('ar-EG') : '—'} · تحديث تلقائي كل 15 ثانية</span><button type="button" className="edit-btn" onClick={refresh} disabled={refreshing}>{refreshing ? 'جاري التحديث…' : 'تحديث الآن'}</button></div>
      {filterError && <p className="form-error" role="alert">{filterError}</p>}
      {loading && <div className="page-loading">جاري التحميل...</div>}
      {error && <div className="form-error" role="alert">{error}</div>}
      {!loading && (
        <div className="orders-board">
          {columns.map((col) => (
            <OrderColumn key={col.status} title={col.title} status={col.status}
              count={filteredOrders.filter((o) => o.status === col.status).length}
              orders={filteredOrders.filter((o) => o.status === col.status)}
              onUpdateStatus={handleUpdateStatus} />
          ))}
        </div>
      )}
    </div>
  );
};
export default Orders;
