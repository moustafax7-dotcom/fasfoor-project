const BranchSelector = ({ branches = [], selected, onChange }) => (
  <select value={selected || ''} onChange={(e) => onChange(e.target.value)}>
    <option value="" disabled>اختر فرعك</option>
    {branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
  </select>
);
export default BranchSelector;
