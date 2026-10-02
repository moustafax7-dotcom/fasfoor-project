import { useEffect, useState } from 'react';
import InventoryTable from '../components/inventory/InventoryTable.jsx';
import SupplyModal from '../components/inventory/SupplyModal.jsx';
import StockCountModal from '../components/inventory/StockCountModal.jsx';
import InventoryFormModal from '../components/inventory/InventoryFormModal.jsx';
import { getInventoryItems, createInventoryItem, updateInventoryItem, recordSupply, recordStockCount } from '../../services/inventoryService.js';
import { getBranches } from '../../services/branchService.js';

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchFilter, setBranchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supplyItem, setSupplyItem] = useState(null);
  const [countItem, setCountItem] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const load = () => {
    setLoading(true);
    getInventoryItems({ branch: branchFilter || undefined, status: statusFilter || undefined, search: search || undefined })
      .then((res) => setItems(res.data || [])).catch(() => setError('تعذر تحميل بيانات المخزون')).finally(() => setLoading(false));
  };

  useEffect(() => { getBranches().then((res) => setBranches(res.data || [])); }, []);
  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchFilter, statusFilter, search]);

  const handleSupply = async (id, data) => { await recordSupply(id, data); setSupplyItem(null); load(); };
  const handleCount = async (id, data) => { await recordStockCount(id, data); setCountItem(null); load(); };
  const handleSaveForm = async (form) => {
    if (editingItem) await updateInventoryItem(editingItem._id, form); else await createInventoryItem(form);
    setFormOpen(false); setEditingItem(null); load();
  };

  const lowStockCount = items.filter((i) => i.status === 'low').length;

  return (
    <div className="admin-inventory-page">
      <div className="admin-page-header">
        <div><h1>إدارة المخزون والتنبيهات</h1><p className="page-subtitle">مراقبة المخزون وتنبيهات انخفاض الأصناف في الفروع</p></div>
        <button className="add-btn-outline" onClick={() => { setEditingItem(null); setFormOpen(true); }}>+ صنف مخزون جديد</button>
      </div>
      {lowStockCount > 0 && <div className="low-stock-alert">⚠ يوجد {lowStockCount} صنف وصل لحد التنبيه أو أقل — راجع التوريد</div>}
      <div className="admin-filters">
        <input placeholder="ابحث عن صنف..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="">كل الحالات</option><option value="available">متوفر</option><option value="low">منخفض</option></select>
        <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}><option value="">كل الفروع</option>{branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}</select>
      </div>
      {loading && <div className="page-loading">جاري التحميل...</div>}
      {error && <div className="page-error">{error}</div>}
      {!loading && <InventoryTable items={items} onSupply={setSupplyItem} onCount={setCountItem} onEdit={(item) => { setEditingItem(item); setFormOpen(true); }} />}
      <SupplyModal open={!!supplyItem} item={supplyItem} onClose={() => setSupplyItem(null)} onSave={handleSupply} />
      <StockCountModal open={!!countItem} item={countItem} onClose={() => setCountItem(null)} onSave={handleCount} />
      <InventoryFormModal open={formOpen} onClose={() => { setFormOpen(false); setEditingItem(null); }} onSave={handleSaveForm} branches={branches} initialData={editingItem} />
    </div>
  );
};
export default Inventory;
