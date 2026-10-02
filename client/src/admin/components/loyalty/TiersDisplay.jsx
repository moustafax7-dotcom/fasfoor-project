const tierIcons = ['🥉', '🥈', '🥇'];
const TiersDisplay = ({ tiers = [] }) => (
  <div className="tiers-grid">
    {[...tiers].reverse().map((t, i) => (
      <div className="tier-card" key={t.name}>
        <span className="tier-icon">{tierIcons[tiers.length - 1 - i] || '🏅'}</span>
        <strong>{t.name}</strong><span className="tier-points">{t.minPoints}+ نقطة</span><span className="tier-discount">خصم {t.discountPercent}% على الطلبات</span>
      </div>
    ))}
  </div>
);
export default TiersDisplay;
