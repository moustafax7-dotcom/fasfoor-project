import { useEffect, useState } from 'react';
import { getZonesPublic } from '../../services/deliveryService.js';

const ZoneSelector = ({ branchId, selectedZoneId, onSelect }) => {
  const [zones, setZones] = useState([]);
  useEffect(() => {
    if (!branchId) return;
    getZonesPublic(branchId).then((res) => {
      const list = res.data || [];
      setZones(list);
      if (list.length && !selectedZoneId) onSelect(list[0]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId]);

  if (!zones.length) return null;
  return (
    <div className="zone-selector">
      <label>منطقة التوصيل</label>
      <p className="zone-selector-hint">اختار المنطقة الأقرب لعنوانك عشان نحسب رسوم التوصيل صح</p>
      <select value={selectedZoneId || ''} onChange={(e) => onSelect(zones.find((z) => z._id === e.target.value))}>
        {zones.map((z) => <option key={z._id} value={z._id}>{z.name} — {z.deliveryFee} جنيه</option>)}
      </select>
    </div>
  );
};
export default ZoneSelector;
