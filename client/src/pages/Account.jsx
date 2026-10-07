import PageIntro from '../components/common/PageIntro.jsx';
import StatePanel from '../components/common/StatePanel.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext.jsx';

const Account = () => {
  const { customer, logout, isAuthenticated } = useCustomerAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <main className="account-page account-guest">
        <PageIntro title="حسابي" /><StatePanel title="كل تفاصيلك في مكان واحد" description="سجّل دخولك علشان تتابع طلباتك، وتحفظ عناوينك وأصنافك المفضلة." to="/login" actionLabel="تسجيل الدخول" />
      </main>
    );
  }

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <main className="account-page">
      <PageIntro title="حسابي" description="طلباتك، عناوينك واختياراتك المفضلة." />
      <div className="account-card">
        <div className="account-identity"><span className="account-avatar" aria-hidden="true">{customer.name?.trim().slice(0,1) || "ف"}</span><div><h2>{customer.name}</h2><p>{customer.email || 'لا يوجد بريد إلكتروني مسجل'}</p><p dir="ltr">{customer.phone}</p></div></div>
        <Link className="edit-profile-btn" to="/account/addresses">إدارة عناوين التوصيل</Link>
      </div>
      <div className="account-quick-links">
        <Link to="/account/orders">طلباتي</Link>
        <Link to="/account/loyalty">نقاطي ومستواي</Link>
        <Link to="/account/favorites">المفضلة</Link>
        <Link to="/account/addresses">عناويني</Link>
      </div>
      <button className="logout-btn" onClick={handleLogout}>تسجيل خروج</button>
    </main>
  );
};
export default Account;
