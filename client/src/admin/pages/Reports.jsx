import { useEffect, useState } from 'react';
import { getBranchPerformance } from '../../services/reportService.js';
import { getBranches } from '../../services/branchService.js';

const Reports = () => {
  const [performance, setPerformance] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getBranchPerformance(), getBranches()])
      .then(([perfRes, branchesRes]) => { setPerformance(perfRes.data); setBranches(branchesRes.data || []); })
      .catch(() => setError('تعذر تحميل التقارير')).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">جاري التحميل...</div>;
  if (error) return <div className="page-error">{error}</div>;

  const totalSales = performance?.stats?.reduce((sum, s) => sum + s.totalSales, 0) || 0;
  const totalOrders = performance?.stats?.reduce((sum, s) => sum + s.totalOrders, 0) || 0;
  const totalCancelled = performance?.cancelled?.reduce((sum, c) => sum + c.cancelledCount, 0) || 0;
  const findBranchName = (id) => branches.find((b) => b._id === id)?.name || 'غير معروف';

  return (
    <div className="admin-reports-page">
      <div className="admin-page-header"><h1>الفروع والتقارير</h1></div>
      <div className="stats-grid">
        <div className="stat-card"><span className="stat-title">إجمالي المبيعات</span><div className="stat-value">{totalSales.toLocaleString('ar-EG')} ج</div></div>
        <div className="stat-card"><span className="stat-title">إجمالي الطلبات</span><div className="stat-value">{totalOrders}</div></div>
        <div className="stat-card"><span className="stat-title">الطلبات الملغاة</span><div className="stat-value">{totalCancelled}</div></div>
      </div>
      <div className="branch-performance-table">
        <h3>مبيعات كل فرع</h3>
        <table className="admin-table">
          <thead><tr><th>الفرع</th><th>إجمالي المبيعات</th><th>عدد الطلبات</th><th>الطلبات الملغاة</th></tr></thead>
          <tbody>
            {performance?.stats?.map((s) => (
              <tr key={s._id}>
                <td>{findBranchName(s._id)}</td><td>{s.totalSales.toLocaleString('ar-EG')} ج</td><td>{s.totalOrders}</td>
                <td>{performance.cancelled.find((c) => c._id === s._id)?.cancelledCount || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Reports;
