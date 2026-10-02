const ZoneCard = ({ zone, active, onClick }) => (
  <button className={`zone-card ${active ? 'zone-card-active' : ''}`} onClick={onClick} type="button">
    <span className="zone-color-dot" style={{ background: zone.color }} />
    <span className="zone-name">{zone.name}</span>
    <span className="zone-fee">رسوم التوصيل: {zone.deliveryFee} ج</span>
  </button>
);
export default ZoneCard;
