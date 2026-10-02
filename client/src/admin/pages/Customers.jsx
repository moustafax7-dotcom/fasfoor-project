import { useEffect, useState } from 'react';
import CustomerDetailPanel from '../components/customers/CustomerDetailPanel.jsx';
import { getCustomers } from '../../services/customerService.js';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { getCustomers().then((res) => setCustomers(res.data || [])).catch(() => setError('تعذر تحميل العملاء')).finally(() => setLoading(false)); }, []);
  const filtered = customers.filter((c) => !search || c.name?.includes(search) || c.phone?.includes(search));

  return (
    <div className="admin-customers-page">
      <div className="admin-page-header"><h1>العملاء</h1></div>
      <div className="admin-filters"><input placeholder="ابحث باسم العميل أو رقم الهاتف..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
      {loading && <div className="page-loading">جاري التحميل...</div>}
      {error && <div className="page-error">{error}</div>}
      {!loading && (
        <table className="admin-table">
          <thead><tr><th>العميل</th><th>رقم الهاتف</th><th>عدد الطلبات</th><th>آخر طلب</th><th>إجراءات</th></tr></thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td><td>{c.phone}</td><td>{c.totalOrders}</td>
                <td className="table-muted">{c.lastOrderAt ? new Date(c.lastOrderAt).toLocaleDateString('ar-EG') : '—'}</td>
                <td><button onClick={() => setSelected(c)}>عرض التفاصيل</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <CustomerDetailPanel customer={selected} onClose={() => setSelected(null)} />
    </div>
  );
};
export default Customers;
