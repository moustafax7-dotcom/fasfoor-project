import { useAuth } from '../../context/AuthContext.jsx';
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
        <h3>معلومات إضافية</h3>
        <p className="menu-empty">إعدادات المطعم العامة (ساعات العمل الافتراضية، رسوم التوصيل، بيانات التواصل) هتتضاف هنا لاحقًا حسب احتياج الإدارة.</p>
      </div>
    </div>
  );
};
export default Settings;
