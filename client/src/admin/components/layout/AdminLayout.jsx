import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <img src="/images/logo/logo.jpg" alt="فسفور" className="admin-logo" />
        <nav>
          <Link to="/admin">نظرة عامة</Link>
          <Link to="/admin/orders">الطلبات</Link>
          <Link to="/admin/items">الأصناف والأسعار</Link>
          <Link to="/admin/inventory">المخزون والتنبيهات</Link>
          <Link to="/admin/branches">الفروع</Link>
          <Link to="/admin/offers">العروض</Link>
          <Link to="/admin/coupons">الكوبونات والولاء</Link>
          <Link to="/admin/delivery">المندوبين والتوصيل</Link>
          <Link to="/admin/kitchen" target="_blank">🍳 شاشة المطبخ</Link>
          <Link to="/admin/customers">العملاء</Link>
          <Link to="/admin/reports">التقارير</Link>
          <Link to="/admin/permissions">صلاحيات الموظفين</Link>
          <Link to="/admin/price-log">سجل تغييرات الأسعار</Link>
          <Link to="/admin/settings">الإعدادات</Link>
        </nav>
        <button onClick={handleLogout}>تسجيل خروج</button>
      </aside>
      <main className="admin-content">
        <div className="admin-topbar">مرحبًا، {admin?.name} — {admin?.role}</div>
        <Outlet />
      </main>
    </div>
  );
};
export default AdminLayout;
