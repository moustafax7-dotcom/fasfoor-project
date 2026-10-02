const unitLabels = { quarter: 'ربع كيلو', half: 'نص كيلو', kilo: 'كيلو', piece: 'قطعة', plate: 'طبق', box: 'بوكس' };
const SizeSelector = ({ options = [], selected, onSelect }) => (
  <div className="size-selector">
    <h3>اختر المقاس</h3>
    <div className="size-options">
      {options.map((opt) => (
        <button key={opt.unit} className={`size-option ${selected === opt.unit ? 'size-option-active' : ''}`} onClick={() => onSelect(opt.unit)} type="button">
          <span>{opt.label || unitLabels[opt.unit] || opt.unit}</span>
          <strong>{opt.price} جنيه</strong>
        </button>
      ))}
    </div>
  </div>
);
export default SizeSelector;
