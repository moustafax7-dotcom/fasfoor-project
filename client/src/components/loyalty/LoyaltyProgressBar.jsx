const LoyaltyProgressBar = ({ points, currentTier, nextTier }) => {
  if (!nextTier) return <p className="loyalty-max-tier">وصلت لأعلى مستوى عضوية 🎉 استمتع بأعلى نسبة خصم</p>;
  const range = nextTier.minPoints - currentTier.minPoints;
  const progress = Math.min(100, ((points - currentTier.minPoints) / range) * 100);
  const remaining = nextTier.minPoints - points;
  return (
    <div className="loyalty-progress">
      <div className="loyalty-progress-track"><div className="loyalty-progress-fill" style={{ width: `${progress}%` }} /></div>
      <p>محتاج {remaining} نقطة كمان للوصول لـ {nextTier.name}</p>
    </div>
  );
};
export default LoyaltyProgressBar;
