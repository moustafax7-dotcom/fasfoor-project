import { useState, useEffect } from 'react';
const emptyForm = { label: '', fullAddress: '', city: '', isDefault: false };
const AddressFormModal = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(emptyForm);
  useEffect(() => {
    setForm(initialData ? { label: initialData.label || '', fullAddress: initialData.fullAddress, city: initialData.city || '', isDefault: initialData.isDefault } : emptyForm);
  }, [initialData, open]);
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
        <h2>{initialData ? 'تعديل العنوان' : 'إضافة عنوان جديد'}</h2>
        <label>اسم العنوان (المنزل، الشغل...)</label>
        <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="المنزل" />
        <label>العنوان بالتفصيل</label>
        <textarea required value={form.fullAddress} onChange={(e) => setForm({ ...form, fullAddress: e.target.value })} />
        <label>المدينة</label>
        <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="القاهرة" />
        <label className="inline-checkbox">
          <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
          تعيين كعنوان افتراضي
        </label>
        <div className="modal-actions">
          <button type="button" className="modal-cancel" onClick={onClose}>إلغاء</button>
          <button type="submit" className="modal-save">حفظ</button>
        </div>
      </form>
    </div>
  );
};
export default AddressFormModal;
