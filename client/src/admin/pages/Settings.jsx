import { useAuth } from '../../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
const Settings = () => {
  const { admin } = useAuth();
  return (
    <div className="admin-settings-page">
      <div className="admin-page-header"><h1>الإعدادات</h1></div>
      <div className="settings-card">
        <h3>بيانات الحساب</h3>
        <div className="settings-row"><span>الاسم</span><strong>{admin?.name}</strong></div>
        <div className="settings-row"><span>الدور</span><strong>{admin?.role}</strong></div>
      </div>
      <div className="settings-card">
        <h3>إدارة إعدادات التشغيل</h3>
        <p>افتح القسم المناسب لتعديل البيانات من مكانها الأساسي.</p>
        <div className="settings-links">
          <Link to="/admin/branches">الفروع ومواعيد العمل</Link>
          <Link to="/admin/delivery">مناطق ورسوم التوصيل</Link>
          <Link to="/admin/items">الأصناف والأسعار</Link>
          <Link to="/admin/permissions">حسابات وصلاحيات الموظفين</Link>
        </div>
      </div>
    </div>
  );
};
export default Settings;
