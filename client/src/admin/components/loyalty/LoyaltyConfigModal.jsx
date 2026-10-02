import { useState, useEffect } from 'react';
const LoyaltyConfigModal = ({ open, config, onClose, onSave }) => {
  const [form, setForm] = useState(null);
  useEffect(() => { if (config) setForm(JSON.parse(JSON.stringify(config))); }, [config, open]);
  if (!open || !form) return null;
  const updateTier = (i, field, value) => { const tiers = [...form.tiers]; tiers[i] = { ...tiers[i], [field]: value }; setForm({ ...form, tiers }); };
  const updateRule = (i, value) => { const rules = [...form.rules]; rules[i] = value; setForm({ ...form, rules }); };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); onSave(form); }}>
        <h2>تعديل برنامج الولاء</h2>
        <label>نقاط لكل جنيه يُنفق</label>
        <input type="number" value={form.pointsPerEGP} onChange={(e) => setForm({ ...form, pointsPerEGP: e.target.value })} />
        <label>مستويات العضوية</label>
        {form.tiers.map((t, i) => (
          <div className="form-row" key={i} style={{ marginBottom: 8 }}>
            <div><label>الاسم</label><input value={t.name} onChange={(e) => updateTier(i, 'name', e.target.value)} /></div>
            <div><label>الحد الأدنى للنقاط</label><input type="number" value={t.minPoints} onChange={(e) => updateTier(i, 'minPoints', e.target.value)} /></div>
            <div><label>نسبة الخصم %</label><input type="number" value={t.discountPercent} onChange={(e) => updateTier(i, 'discountPercent', e.target.value)} /></div>
          </div>
        ))}
        <label>القواعد المعروضة</label>
        {form.rules.map((r, i) => <input key={i} value={r} onChange={(e) => updateRule(i, e.target.value)} style={{ marginBottom: 6 }} />)}
        <div className="modal-actions"><button type="button" className="modal-cancel" onClick={onClose}>إلغاء</button><button type="submit" className="modal-save">حفظ</button></div>
      </form>
    </div>
  );
};
export default LoyaltyConfigModal;
