import { useState } from 'react';
const StockCountModal = ({ open, item, onClose, onSave }) => {
  const [actualQuantity, setActualQuantity] = useState('');
  const [note, setNote] = useState('');
  if (!open || !item) return null;
  const diff = actualQuantity !== '' ? Number(actualQuantity) - item.quantityAvailable : null;
  const handleSubmit = (e) => { e.preventDefault(); onSave(item._id, { actualQuantity, note }); setActualQuantity(''); setNote(''); };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2>جرد مخزون — {item.name}</h2>
        <p className="table-desc">الكمية المسجلة بالنظام: {item.quantityAvailable} {item.unit}</p>
        <label>الكمية الفعلية بعد العد ({item.unit})</label>
        <input type="number" required min="0" step="0.1" value={actualQuantity} onChange={(e) => setActualQuantity(e.target.value)} />
        {diff !== null && !Number.isNaN(diff) && <p className={diff < 0 ? 'diff-negative' : 'diff-positive'}>الفرق: {diff > 0 ? '+' : ''}{diff.toFixed(1)} {item.unit}</p>}
        <label>ملاحظات (اختياري)</label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="سبب الفرق إن وجد..." />
        <div className="modal-actions"><button type="button" className="modal-cancel" onClick={onClose}>إلغاء</button><button type="submit" className="modal-save">تأكيد الجرد</button></div>
      </form>
    </div>
  );
};
export default StockCountModal;
