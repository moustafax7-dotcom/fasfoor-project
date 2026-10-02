import { useState, useEffect } from 'react';
const emptyForm = { name: '', branch: '', deliveryFee: '', color: '#C9A24B', description: '' };
const ZoneFormModal = ({ open, onClose, onSave, branches, initialData }) => {
  const [form, setForm] = useState(emptyForm);
  useEffect(() => { setForm(initialData ? { name: initialData.name, branch: initialData.branch?._id || '', deliveryFee: initialData.deliveryFee, color: initialData.color, description: initialData.description || '' } : emptyForm); }, [initialData, open]);
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
        <h2>{initialData ? 'تعديل المنطقة' : 'إضافة منطقة توصيل'}</h2>
        <label>اسم المنطقة</label>
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <label>الفرع</label>
        <select required value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })}><option value="" disabled>اختر الفرع</option>{branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}</select>
        <label>رسوم التوصيل (جنيه)</label>
        <input type="number" required value={form.deliveryFee} onChange={(e) => setForm({ ...form, deliveryFee: e.target.value })} />
        <label>لون التمييز</label>
        <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
        <label>وصف الحدود (اختياري)</label>
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="مثال: من شارع مكرم عبيد حتى العقاد" />
        <div className="modal-actions"><button type="button" className="modal-cancel" onClick={onClose}>إلغاء</button><button type="submit" className="modal-save">حفظ</button></div>
      </form>
    </div>
  );
};
export default ZoneFormModal;
