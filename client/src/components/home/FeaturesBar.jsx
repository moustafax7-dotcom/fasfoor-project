const features = [
  { icon: '🦐', title: 'تتبيلة فسفور', subtitle: 'سر الطعم الفريد' },
  { icon: '👨‍🍳', title: 'شيفات متخصصين', subtitle: 'خبرة في كل طبق' },
  { icon: '🏅', title: 'جودة مضمونة', subtitle: 'طازج يوميًا' },
  { icon: '🏍️', title: 'توصيل سريع', subtitle: 'لحد بابك ساخن' },
];
const FeaturesBar = () => (
  <div className="features-bar">
    <div className="feature feature-phone"><div>للطلب والاستفسار</div><strong>17397</strong></div>
    {features.map((f) => (
      <div className="feature" key={f.title}>
        <span className="feature-icon">{f.icon}</span>
        <div><strong>{f.title}</strong><div>{f.subtitle}</div></div>
      </div>
    ))}
  </div>
);
export default FeaturesBar;
