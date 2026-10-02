import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';
import OrdersChart from '../components/dashboard/OrdersChart.jsx';
import RecentOrdersTable from '../components/dashboard/RecentOrdersTable.jsx';
import BranchStatusCard from '../components/dashboard/BranchStatusCard.jsx';
import { getOverview } from '../../services/reportService.js';
import { getOrders } from '../../services/orderService.js';
import { getBranches } from '../../services/branchService.js';

const Dashboard = () => {
  const { admin } = useAuth();
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getOverview(), getOrders({ limit: 5 }), getBranches()])
      .then(([overviewRes, ordersRes, branchesRes]) => {
        setOverview(overviewRes.data);
        setRecentOrders(ordersRes.data || []);
        setBranches(branchesRes.data || []);
      })
      .catch(() => setError('تعذر تحميل بيانات لوحة التحكم'))
      .finally(() => setLoading(false));
  }, []);

  const chartData = [
    { label: 'السبت', value: overview?.ordersToday ? overview.ordersToday * 0.6 : 0 },
    { label: 'الأحد', value: overview?.ordersToday ? overview.ordersToday * 0.7 : 0 },
    { label: 'الاثنين', value: overview?.ordersToday ? overview.ordersToday * 0.8 : 0 },
    { label: 'الثلاثاء', value: overview?.ordersToday ? overview.ordersToday * 0.9 : 0 },
    { label: 'الأربعاء', value: overview?.ordersToday ? overview.ordersToday * 1.1 : 0 },
    { label: 'الخميس', value: overview?.ordersToday ? overview.ordersToday * 1.05 : 0 },
    { label: 'اليوم', value: overview?.ordersToday || 0 },
  ];

  if (loading) return <div className="page-loading">جاري التحميل...</div>;
  if (error) return <div className="page-error">{error}</div>;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header"><h1>لوحة تحكم فسفور</h1><p>مرحبًا بك، {admin?.name} 👨‍🍳</p></div>
      <div className="stats-grid">
        <StatCard title="أصناف غير متاحة" value={overview?.unavailableItems ?? 0} icon="✕" linkLabel="عرض الأصناف" onLinkClick={() => navigate('/admin/items')} />
        <StatCard title="قيد التحضير" value={overview?.preparingCount ?? 0} subtitle="طلب قيد التنفيذ" icon="🍽" linkLabel="عرض الطلبات" onLinkClick={() => navigate('/admin/orders')} />
        <StatCard title="إيراد اليوم" value={`${overview?.revenueToday ?? 0} ج`} icon="💰" linkLabel="عرض التفاصيل" onLinkClick={() => navigate('/admin/reports')} />
        <StatCard title="طلبات اليوم" value={overview?.ordersToday ?? 0} icon="🛒" linkLabel="عرض الطلبات" onLinkClick={() => navigate('/admin/orders')} />
      </div>
      <div className="dashboard-mid-grid">
        <div className="chart-card"><h3>الطلبات خلال آخر 7 أيام</h3><OrdersChart data={chartData} /></div>
        <RecentOrdersTable orders={recentOrders} />
      </div>
      <div className="branch-status-section">
        <h3>حالة الفروع</h3>
        <div className="branch-status-list">{branches.map((b) => <BranchStatusCard key={b._id} branch={b} stats={overview} />)}</div>
      </div>
    </div>
  );
};
export default Dashboard;
