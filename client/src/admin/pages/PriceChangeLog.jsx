import { useEffect, useState } from 'react';
import { getPriceChangeLogs } from '../../services/priceLogService.js';
import { getBranches } from '../../services/branchService.js';

const PriceChangeLog = () => {
  const [logs, setLogs] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchFilter, setBranchFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => { setLoading(true); getPriceChangeLogs({ branch: branchFilter || undefined, search: search || undefined }).then((res) => setLogs(res.data || [])).finally(() => setLoading(false)); };
  useEffect(() => { getBranches().then((res) => setBranches(res.data || [])); }, []);
  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchFilter, search]);

  const exportCsv = () => {
    const header = 'الصنف,الفرع,السعر السابق,السعر الجديد,السبب,عدّل بواسطة,التاريخ\n';
    const rows = logs.map((l) => [l.itemName, l.branch?.name, l.previousPrice, l.newPrice, l.reason, l.changedBy?.name, new Date(l.createdAt).toLocaleString('ar-EG')].join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob); link.download = 'سجل-تغييرات-الأسعار.csv'; link.click();
  };

  return (
    <div className="admin-price-log-page">
      <div className="admin-page-header">
        <button className="add-btn" onClick={exportCsv}>⬇ تصدير السجل</button>
        <div><h1>سجل تغييرات الأسعار</h1><p className="page-subtitle">عرض جميع التعديلات التي تمت على أسعار الأصناف في جميع الفروع</p></div>
      </div>
      <div className="admin-filters">
        <input placeholder="ابحث بالاسم أو سبب التعديل..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}><option value="">جميع الفروع</option>{branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}</select>
      </div>
      {loading && <div className="page-loading">جاري التحميل...</div>}
      {!loading && (
        <table className="admin-table price-log-table">
          <thead><tr><th>الصنف</th><th>الفرع</th><th>السعر السابق</th><th>السعر الجديد</th><th>سبب التعديل</th><th>عدّل بواسطة</th><th>التاريخ والوقت</th></tr></thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l._id}>
                <td><strong>{l.itemName}</strong></td><td>{l.branch?.name}</td><td className="table-muted">{l.previousPrice} جنيه</td>
                <td><span className={l.newPrice > l.previousPrice ? 'price-up' : 'price-down'}>{l.newPrice} جنيه {l.newPrice > l.previousPrice ? '↑' : '↓'}</span></td>
                <td>{l.reason}</td><td className="table-muted">{l.changedBy?.name}</td><td className="table-muted">{new Date(l.createdAt).toLocaleString('ar-EG')}</td>
              </tr>
            ))}
            {!logs.length && <tr><td colSpan="7" className="menu-empty">لا توجد تعديلات أسعار مسجلة بعد</td></tr>}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default PriceChangeLog;
