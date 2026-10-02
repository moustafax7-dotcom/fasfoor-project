import { useState } from 'react';
const SupplyModal = ({ open, item, onClose, onSave }) => {
  const [quantity, setQuantity] = useState('');
  const [note, setNote] = useState('');
  if (!open || !item) return null;
  const handleSubmit = (e) => { e.preventDefault(); onSave(item._id, { quantity, note }); setQuantity(''); setNote(''); };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2>تسجيل توريد — {item.name}</h2>
        <p className="table-desc">الكمية الحالية: {item.quantityAvailable} {item.unit}</p>
        <label>الكمية الموردة ({item.unit})</label>
        <input type="number" required min="0.1" step="0.1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <label>ملاحظات (اختياري)</label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="اسم المورد، رقم الفاتورة..." />
        <div className="modal-actions"><button type="button" className="modal-cancel" onClick={onClose}>إلغاء</button><button type="submit" className="modal-save">تسجيل التوريد</button></div>
      </form>
    </div>
  );
};
export default SupplyModal;
