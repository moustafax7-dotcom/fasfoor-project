import { useState, useEffect } from 'react';
const emptyForm = { label: '', fullAddress: '', city: '', isDefault: false };
const AddressFormModal = ({ open, onClose, onSave, initialData }) => {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    setError(null);
    setForm(initialData ? { label: initialData.label || '', fullAddress: initialData.fullAddress, city: initialData.city || '', isDefault: initialData.isDefault } : emptyForm);
  }, [initialData, open]);
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={async (e) => { e.preventDefault(); if (saving) return; setSaving(true); setError(null); try { await onSave(form); } catch (err) { setError(err.response?.data?.message || 'تعذر حفظ العنوان، جرّب تاني'); } finally { setSaving(false); } }}>
        <h2>{initialData ? 'تعديل العنوان' : 'إضافة عنوان جديد'}</h2>
        <label htmlFor="address-label">اسم العنوان (المنزل، الشغل...)</label>
        <input id="address-label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="المنزل" />
        <label htmlFor="full-address">العنوان بالتفصيل</label>
        <textarea id="full-address" autoComplete="street-address" required value={form.fullAddress} onChange={(e) => setForm({ ...form, fullAddress: e.target.value })} />
        <label htmlFor="address-city">المدينة</label>
        <input id="address-city" autoComplete="address-level2" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="القاهرة" />
        <label className="inline-checkbox">
          <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
          تعيين كعنوان افتراضي
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="modal-actions">
          <button type="button" className="modal-cancel" onClick={onClose}>إلغاء</button>
          <button type="submit" className="modal-save" disabled={saving}>{saving ? "جاري الحفظ…" : "حفظ العنوان"}</button>
        </div>
      </form>
    </div>
  );
};
export default AddressFormModal;
