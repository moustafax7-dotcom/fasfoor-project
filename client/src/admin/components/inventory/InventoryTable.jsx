const InventoryTable = ({ items = [], onSupply, onCount, onEdit }) => (
  <table className="admin-table">
    <thead><tr><th>الصنف</th><th>وحدة القياس</th><th>الكمية المتاحة</th><th>حد التنبيه</th><th>الفرع</th><th>آخر توريد</th><th>الحالة</th><th>إجراءات</th></tr></thead>
    <tbody>
      {items.map((item) => (
        <tr key={item._id}>
          <td><strong>{item.name}</strong>{item.description && <p className="table-desc">{item.description}</p>}</td>
          <td>{item.unit}</td>
          <td className={item.status === 'low' ? 'qty-low' : ''}>{item.quantityAvailable} {item.unit}</td>
          <td className="table-muted">{item.alertThreshold} {item.unit}</td>
          <td>{item.branch?.name}</td>
          <td className="table-muted">{item.lastSupplyDate ? new Date(item.lastSupplyDate).toLocaleDateString('ar-EG') : '—'}</td>
          <td><span className={`badge ${item.status === 'low' ? 'badge-orange' : 'badge-green'}`}>{item.status === 'low' ? 'منخفض' : 'متوفر'}</span></td>
          <td className="table-actions"><button onClick={() => onSupply(item)}>🚚 توريد</button><button onClick={() => onCount(item)}>📋 جرد</button><button onClick={() => onEdit(item)}>✎</button></td>
        </tr>
      ))}
      {!items.length && <tr><td colSpan="8" className="menu-empty">لا توجد أصناف مخزون مطابقة</td></tr>}
    </tbody>
  </table>
);
export default InventoryTable;
