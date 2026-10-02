import { useEffect, useState } from 'react';
import ZoneCard from '../components/delivery/ZoneCard.jsx';
import ZonesMapPlaceholder from '../components/delivery/ZonesMapPlaceholder.jsx';
import ZoneFormModal from '../components/delivery/ZoneFormModal.jsx';
import RepsTable from '../components/delivery/RepsTable.jsx';
import RepFormModal from '../components/delivery/RepFormModal.jsx';
import { getZones, createZone, updateZone, deleteZone, getReps, createRep, updateRep } from '../../services/deliveryService.js';
import { getBranches } from '../../services/branchService.js';

const DeliveryZones = () => {
  const [branches, setBranches] = useState([]);
  const [branchFilter, setBranchFilter] = useState('');
  const [zones, setZones] = useState([]);
  const [activeZone, setActiveZone] = useState(null);
  const [reps, setReps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoneModalOpen, setZoneModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState(null);
  const [repModalOpen, setRepModalOpen] = useState(false);
  const [editingRep, setEditingRep] = useState(null);

  const loadAll = () => {
    setLoading(true);
    Promise.all([getZones(branchFilter || undefined), getReps(branchFilter || undefined)])
      .then(([zonesRes, repsRes]) => { setZones(zonesRes.data || []); setReps(repsRes.data || []); })
      .catch(() => setError('تعذر تحميل بيانات التوصيل')).finally(() => setLoading(false));
  };

  useEffect(() => { getBranches().then((res) => setBranches(res.data || [])); }, []);
  useEffect(() => { loadAll(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchFilter]);

  const handleSaveZone = async (form) => {
    if (editingZone) await updateZone(editingZone._id, form); else await createZone(form);
    setZoneModalOpen(false); setEditingZone(null); loadAll();
  };
  const handleDeleteZone = async (id) => { if (!confirm('تأكيد حذف المنطقة؟')) return; await deleteZone(id); loadAll(); };
  const handleSaveRep = async (form) => {
    if (editingRep) await updateRep(editingRep._id, form); else await createRep(form);
    setRepModalOpen(false); setEditingRep(null); loadAll();
  };
  const handleToggleRepStatus = async (rep, status) => { await updateRep(rep._id, { status }); loadAll(); };

  return (
    <div className="admin-delivery-page">
      <div className="admin-page-header">
        <div className="delivery-header-actions">
          <button className="add-btn" onClick={() => { setEditingRep(null); setRepModalOpen(true); }}>+ إضافة مندوب</button>
          <button className="add-btn-outline" onClick={() => { setEditingZone(null); setZoneModalOpen(true); }}>✎ إضافة منطقة</button>
        </div>
        <div><h1>المندوبين ومناطق التوصيل</h1><p className="page-subtitle">إدارة المندوبين ومناطق التوصيل لكل فرع ومتابعة الأداء اللحظي</p></div>
      </div>
      <div className="admin-filters">
        <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}><option value="">كل الفروع</option>{branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}</select>
      </div>
      {loading && <div className="page-loading">جاري التحميل...</div>}
      {error && <div className="page-error">{error}</div>}
      {!loading && (
        <>
          <div className="delivery-zones-layout">
            <div className="zones-list">
              <h3>مناطق التوصيل</h3>
              {zones.map((z) => (
                <div key={z._id} className="zone-list-item">
                  <ZoneCard zone={z} active={activeZone === z._id} onClick={() => setActiveZone(z._id)} />
                  <div className="zone-item-actions"><button onClick={() => { setEditingZone(z); setZoneModalOpen(true); }}>✎</button><button onClick={() => handleDeleteZone(z._id)}>🗑</button></div>
                </div>
              ))}
              {!zones.length && <p className="menu-empty">لا توجد مناطق مسجلة</p>}
            </div>
            <ZonesMapPlaceholder zones={zones} />
          </div>
          <div className="reps-section">
            <h3>قائمة المندوبين</h3>
            <RepsTable reps={reps} onEdit={(rep) => { setEditingRep(rep); setRepModalOpen(true); }} onToggleStatus={handleToggleRepStatus} />
          </div>
        </>
      )}
      <ZoneFormModal open={zoneModalOpen} onClose={() => { setZoneModalOpen(false); setEditingZone(null); }} onSave={handleSaveZone} branches={branches} initialData={editingZone} />
      <RepFormModal open={repModalOpen} onClose={() => { setRepModalOpen(false); setEditingRep(null); }} onSave={handleSaveRep} branches={branches} initialData={editingRep} />
    </div>
  );
};
export default DeliveryZones;
