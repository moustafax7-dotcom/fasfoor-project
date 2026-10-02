import { useState, useEffect } from 'react';
const emptyForm = { name: '', phone: '', branch: '', avgDeliveryMinutes: 30 };
const RepFormModal = ({ open, onClose, onSave, branches, initialData }) => {
  const [form, setForm] = useState(emptyForm);
  useEffect(() => { setForm(initialData ? { name: initialData.name, phone: initialData.phone, branch: initialData.branch?._id || '', avgDeliveryMinutes: initialData.avgDeliveryMinutes } : emptyForm); }, [initialData, open]);
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
        <h2>{initialData ? 'تعديل المندوب' : 'إضافة مندوب جديد'}</h2>
        <label>اسم المندوب</label>
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <label>رقم الهاتف</label>
        <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <label>الفرع</label>
        <select required value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })}><option value="" disabled>اختر الفرع</option>{branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}</select>
        <label>متوسط وقت التوصيل (دقيقة)</label>
        <input type="number" value={form.avgDeliveryMinutes} onChange={(e) => setForm({ ...form, avgDeliveryMinutes: e.target.value })} />
        <div className="modal-actions"><button type="button" className="modal-cancel" onClick={onClose}>إلغاء</button><button type="submit" className="modal-save">حفظ</button></div>
      </form>
    </div>
  );
};
export default RepFormModal;
