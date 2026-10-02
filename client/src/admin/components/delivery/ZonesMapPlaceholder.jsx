const ZonesMapPlaceholder = ({ zones = [] }) => (
  <div className="zones-map-placeholder">
    <div className="zones-map-grid">
      {zones.map((z) => (
        <div key={z._id} className="zone-block" style={{ borderColor: z.color, background: `${z.color}22` }}>
          <span className="zone-block-name" style={{ color: z.color }}>{z.name}</span>
          {z.description && <span className="zone-block-desc">{z.description}</span>}
        </div>
      ))}
    </div>
    <p className="zones-map-note">📍 عرض تقريبي للمناطق — الخريطة التفاعلية الكاملة تحتاج ربط خدمة خرائط لاحقًا (Leaflet/Google Maps)</p>
  </div>
);
export default ZonesMapPlaceholder;
