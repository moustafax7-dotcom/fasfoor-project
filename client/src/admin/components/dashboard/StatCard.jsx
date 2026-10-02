const StatCard = ({ title, value, subtitle, icon, linkLabel, onLinkClick }) => (
  <div className="stat-card">
    <div className="stat-card-top"><span className="stat-title">{title}</span><span className="stat-icon">{icon}</span></div>
    <div className="stat-value">{value}</div>
    {subtitle && <div className="stat-subtitle">{subtitle}</div>}
    {linkLabel && <button className="stat-link" onClick={onLinkClick}>‹ {linkLabel}</button>}
  </div>
);
export default StatCard;
