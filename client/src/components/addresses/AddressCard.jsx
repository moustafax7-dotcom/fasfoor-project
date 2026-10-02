const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => (
  <div className={`address-card ${address.isDefault ? 'address-card-default' : ''}`}>
    <div className="address-card-header">
      <strong>{address.label || 'عنوان'}</strong>
      {address.isDefault && <span className="default-badge">الافتراضي</span>}
    </div>
    <p>{address.fullAddress}</p>
    {address.city && <span className="address-city">{address.city}</span>}
    <div className="address-card-actions">
      {!address.isDefault && <button onClick={() => onSetDefault(address)}>تعيين كافتراضي</button>}
      <button onClick={() => onEdit(address)}>✎ تعديل</button>
      <button onClick={() => onDelete(address)}>🗑 حذف</button>
    </div>
  </div>
);
export default AddressCard;
