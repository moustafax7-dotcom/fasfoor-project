const AddOnsList = ({ addOns = [], selected = [], onToggle }) => {
  if (!addOns.length) return null;
  return (
    <div className="addons-list">
      <h3>إضافات (اختيارية)</h3>
      <div className="addons-grid">
        {addOns.map((a) => (
          <label key={a.name} className={`addon-option ${selected.includes(a.name) ? 'addon-selected' : ''}`}>
            <span>{a.name}</span><span className="addon-price">+ {a.price} جنيه</span>
            <input type="checkbox" checked={selected.includes(a.name)} onChange={() => onToggle(a.name)} />
          </label>
        ))}
      </div>
    </div>
  );
};
export default AddOnsList;
