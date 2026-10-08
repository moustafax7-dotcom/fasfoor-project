import { useEffect, useState } from 'react';
import { getZonesPublic } from '../../services/deliveryService.js';

const ZoneSelector = ({ branchId, selectedZoneId, onSelect, onStatus }) => {
  const [zones, setZones] = useState([]);
  const [error, setError] = useState(null);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setZones([]); setError(null); onSelect(null); onStatus({ ready: false, required: false });
    if (branchId) getZonesPublic(branchId).then((response) => {
      if (!active) return;
      const list = response.data || [];
      setZones(list); onStatus({ ready: true, required: !!list.length });
    }).catch(() => {
      if (active) { setError('تعذر تحميل مناطق التوصيل. حدّثها قبل تأكيد الطلب.'); onStatus({ ready: false, required: false }); }
    });
    return () => { active = false; };
  }, [branchId, revision, onSelect, onStatus]);
  if (error) return <p className="form-error" role="alert">{error} <button className="link-btn" type="button" onClick={() => setRevision((value) => value + 1)}>إعادة المحاولة</button></p>;
  if (!zones.length) return null;
  return (
    <div className="zone-selector">
      <label htmlFor="checkout-zone">منطقة التوصيل</label>
      <p className="zone-selector-hint">اختار المنطقة اللي فيها عنوانك علشان تظهر رسوم التوصيل الصحيحة.</p>
      <select id="checkout-zone" required value={selectedZoneId || ''} onChange={(event) => onSelect(zones.find((zone) => zone._id === event.target.value) || null)}>
        <option value="" disabled>اختار منطقة التوصيل</option>{zones.map((zone) => <option key={zone._id} value={zone._id}>{zone.name} — {zone.deliveryFee} جنيه</option>)}
      </select>
    </div>
  );
};
export default ZoneSelector;
