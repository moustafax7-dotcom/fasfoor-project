import { useEffect, useState } from 'react';
import OrderColumn from '../components/orders/OrderColumn.jsx';
import { getOrders, updateOrderStatus } from '../../services/orderService.js';
import { getBranches } from '../../services/branchService.js';

const columns = [
  { status: 'new', title: 'جديد' },
  { status: 'preparing', title: 'قيد التحضير' },
  { status: 'ready', title: 'جاهز للتسليم' },
  { status: 'out_for_delivery', title: 'خرج للتوصيل' },
  { status: 'delivered', title: 'مكتمل' },
  { status: 'cancelled', title: 'ملغي' },
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchFilter, setBranchFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrders = () => {
    setLoading(true);
    getOrders(branchFilter ? { branch: branchFilter } : {}).then((res) => setOrders(res.data || [])).catch(() => setError('تعذر تحميل الطلبات')).finally(() => setLoading(false));
  };

  useEffect(() => { getBranches().then((res) => setBranches(res.data || [])); }, []);
  useEffect(() => { loadOrders(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchFilter]);

  const handleUpdateStatus = async (id, status, cancelReason) => {
    try { await updateOrderStatus(id, status, cancelReason); loadOrders(); }
    catch { setError('تعذر تحديث حالة الطلب'); }
  };

  const filteredOrders = orders.filter((o) => !search || o.orderNumber.includes(search) || o.customer?.name?.includes(search));

  return (
    <div className="admin-orders-page">
      <div className="admin-page-header">
        <h1>الطلبات</h1>
        <div className="admin-filters">
          <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
            <option value="">كل الفروع</option>
            {branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
          <input placeholder="البحث برقم الطلب أو اسم العميل..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      {loading && <div className="page-loading">جاري التحميل...</div>}
      {error && <div className="page-error">{error}</div>}
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
