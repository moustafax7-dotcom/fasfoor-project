import { useState, useEffect } from 'react';
const emptyForm = { name: '', description: '', unit: 'كجم', branch: '', quantityAvailable: 0, alertThreshold: 10 };
const InventoryFormModal = ({ open, onClose, onSave, branches, initialData }) => {
  const [form, setForm] = useState(emptyForm);
  useEffect(() => {
    setForm(initialData ? {
      name: initialData.name, description: initialData.description || '', unit: initialData.unit,
      branch: initialData.branch?._id || '', quantityAvailable: initialData.quantityAvailable, alertThreshold: initialData.alertThreshold,
    } : emptyForm);
  }, [initialData, open]);
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
        <h2>{initialData ? 'تعديل صنف المخزون' : 'إضافة صنف مخزون جديد'}</h2>
        <label>اسم الصنف</label>
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <label>الوصف</label>
        <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="form-row">
          <div><label>وحدة القياس</label><input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} /></div>
          <div><label>الفرع</label><select required value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })}><option value="" disabled>اختر الفرع</option>{branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}</select></div>
        </div>
        <div className="form-row">
          <div><label>الكمية الحالية</label><input type="number" value={form.quantityAvailable} onChange={(e) => setForm({ ...form, quantityAvailable: e.target.value })} /></div>
          <div><label>حد التنبيه</label><input type="number" value={form.alertThreshold} onChange={(e) => setForm({ ...form, alertThreshold: e.target.value })} /></div>
        </div>
        <div className="modal-actions"><button type="button" className="modal-cancel" onClick={onClose}>إلغاء</button><button type="submit" className="modal-save">حفظ</button></div>
      </form>
    </div>
  );
};
export default InventoryFormModal;
