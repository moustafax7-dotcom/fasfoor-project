import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoyaltyProgressBar from '../components/loyalty/LoyaltyProgressBar.jsx';
import { useCustomerAuth } from '../context/CustomerAuthContext.jsx';
import { getMyProfile } from '../services/customerAuthService.js';

const tierIcons = ['🥉', '🥈', '🥇'];

const LoyaltyStatus = () => {
  const { isAuthenticated } = useCustomerAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    getMyProfile().then((res) => setData(res.data)).catch(() => setError('تعذر تحميل بيانات النقاط')).finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <main className="loyalty-page account-guest">
        <h1>نقاطي ومستواي</h1><p>سجّل دخولك لعرض نقاطك ومستوى عضويتك</p>
        <Link to="/login" className="hero-order-btn">تسجيل الدخول</Link>
      </main>
    );
  }

  if (loading) return <div className="page-loading">جاري التحميل...</div>;
  if (error) return <div className="page-error">{error}</div>;

  const { customer, currentTier, loyaltyConfig } = data;
  const sortedTiers = [...(loyaltyConfig?.tiers || [])].sort((a, b) => a.minPoints - b.minPoints);
  const currentIndex = sortedTiers.findIndex((t) => t.name === currentTier?.name);
  const nextTier = sortedTiers[currentIndex + 1];

  return (
    <main className="loyalty-page">
      <h1>نقاطي ومستواي</h1>
      <div className="loyalty-points-card">
        <span className="loyalty-points-label">رصيدك الحالي</span>
        <strong className="loyalty-points-value">{customer.loyaltyPoints} نقطة</strong>
        {currentTier && <span className="loyalty-current-tier">{tierIcons[currentIndex] || '🏅'} {currentTier.name} — خصم {currentTier.discountPercent}% على طلباتك</span>}
      </div>
      {currentTier && <LoyaltyProgressBar points={customer.loyaltyPoints} currentTier={currentTier} nextTier={nextTier} />}
      <div className="referral-card">
        <h3>ادعُ صحابك واكسبوا نقاط مع بعض 🎁</h3>
        <p>كل صديق يسجل بكودك، هو ياخد 50 نقطة وانت كمان تاخد 50 نقطة فورًا</p>
        <div className="referral-code-box">
          <span>{customer.referralCode}</span>
          <button onClick={() => navigator.clipboard.writeText(customer.referralCode)}>نسخ الكود</button>
        </div>
      </div>
      <div className="loyalty-tiers-overview">
        <h3>كل المستويات</h3>
        <div className="tiers-grid">
          {sortedTiers.map((t, i) => (
            <div key={t.name} className={`tier-card ${t.name === currentTier?.name ? 'tier-card-active' : ''}`}>
              <span className="tier-icon">{tierIcons[i] || '🏅'}</span>
              <strong>{t.name}</strong><span className="tier-points">{t.minPoints}+ نقطة</span><span className="tier-discount">خصم {t.discountPercent}%</span>
            </div>
          ))}
        </div>
      </div>
      <div className="loyalty-rules-note">
        <h3>إزاي تكسب نقاط؟</h3>
        <ul>{(loyaltyConfig?.rules || []).map((r) => <li key={r}>{r}</li>)}</ul>
      </div>
    </main>
  );
};
export default LoyaltyStatus;
