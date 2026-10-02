import { Link, useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext.jsx';

const Account = () => {
  const { customer, logout, isAuthenticated } = useCustomerAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <main className="account-page account-guest">
        <h1>حسابي</h1><p>سجّل دخولك لعرض بياناتك وطلباتك</p>
        <Link to="/login" className="hero-order-btn">تسجيل الدخول</Link>
      </main>
    );
  }

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <main className="account-page">
      <h1>حسابي</h1>
      <div className="account-card">
        <div><h2>{customer.name}</h2><p>{customer.email || 'لا يوجد بريد إلكتروني مسجل'}</p><p>{customer.phone}</p></div>
        <button className="edit-profile-btn">✎ تعديل الملف الشخصي</button>
      </div>
      <div className="account-quick-links">
        <Link to="/account/orders">🛍 طلباتي</Link>
        <Link to="/account/loyalty">🏅 نقاطي ومستواي</Link>
        <Link to="/account/favorites">♡ المفضلة</Link>
        <Link to="/account/addresses">📍 عناويني</Link>
      </div>
      <button className="logout-btn" onClick={handleLogout}>تسجيل خروج</button>
    </main>
  );
};
export default Account;
