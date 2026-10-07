import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [navigationOpen, setNavigationOpen] = useState(false);
  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <img src="/images/logo/logo.jpg" alt="فسفور" className="admin-logo" />
        <button className="admin-menu-toggle" type="button" aria-controls="admin-navigation" aria-expanded={navigationOpen} onClick={() => setNavigationOpen(!navigationOpen)}>أقسام الإدارة</button>
        <nav id="admin-navigation" aria-label="أقسام الإدارة" className={navigationOpen ? 'admin-nav-expanded' : ''} onClick={() => setNavigationOpen(false)}>
          <NavLink to="/admin" end>نظرة عامة</NavLink>
          <NavLink to="/admin/orders">الطلبات</NavLink>
          <NavLink to="/admin/items">الأصناف والأسعار</NavLink>
          <NavLink to="/admin/categories">أقسام المنيو</NavLink>
          <NavLink to="/admin/inventory">المخزون والتنبيهات</NavLink>
          <NavLink to="/admin/branches">الفروع</NavLink>
          <NavLink to="/admin/offers">العروض</NavLink>
          <NavLink to="/admin/coupons">الكوبونات والولاء</NavLink>
          <NavLink to="/admin/delivery">المندوبين والتوصيل</NavLink>
          <NavLink to="/admin/kitchen" target="_blank">شاشة المطبخ</NavLink>
          <NavLink to="/admin/customers">العملاء</NavLink>
          <NavLink to="/admin/reports">التقارير</NavLink>
          <NavLink to="/admin/permissions">صلاحيات الموظفين</NavLink>
          <NavLink to="/admin/price-log">سجل تغييرات الأسعار</NavLink>
          <NavLink to="/admin/settings">الإعدادات</NavLink>
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
