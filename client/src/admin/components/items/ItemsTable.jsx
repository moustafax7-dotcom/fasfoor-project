const ItemsTable = ({ items = [], onToggleAvailability, onApprove, onEdit }) => (
  <table className="admin-table">
    <thead><tr><th>الصورة</th><th>الصنف</th><th>القسم</th><th>السعر</th><th>حالة التوفر</th><th>اعتماد السعر</th><th>آخر مراجعة</th><th>إجراءات</th></tr></thead>
    <tbody>
      {items.map((item) => (
        <tr key={item._id}>
          <td><img className="table-thumb" src={item.image || '/images/menu/placeholder.jpg'} alt={item.name} /></td>
          <td><strong>{item.name}</strong>{item.description && <p className="table-desc">{item.description}</p>}</td>
          <td>{item.category?.name}</td>
          <td>{item.weightPrices?.length ? item.weightPrices.map((w) => `${w.price} (${w.unit})`).join(' / ') : `${item.price} جنيه`}</td>
          <td><label className="switch"><input type="checkbox" checked={item.isAvailable} onChange={() => onToggleAvailability(item._id)} /><span className="slider" /></label></td>
          <td>{item.isPriceApproved ? <span className="badge badge-green">معتمد</span> : <button className="approve-btn" onClick={() => onApprove(item._id)}>اعتماد السعر</button>}</td>
          <td className="table-muted">{new Date(item.updatedAt).toLocaleDateString('ar-EG')}</td>
          <td><button className="edit-btn" onClick={() => onEdit(item)}>✎</button></td>
        </tr>
      ))}
    </tbody>
  </table>
);
export default ItemsTable;
