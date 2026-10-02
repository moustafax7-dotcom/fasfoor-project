const BranchAdminCard = ({ branch, onToggleOpen, onEdit }) => (
  <div className="branch-admin-card">
    <div className="branch-admin-header"><h3>{branch.name}</h3><label className="switch"><input type="checkbox" checked={branch.isOpen} onChange={() => onToggleOpen(branch)} /><span className="slider" /></label></div>
    <span className={branch.isOpen ? 'open-dot' : 'closed-dot'}>{branch.isOpen ? 'مفتوح' : 'مغلق'}</span>
    <div className="branch-admin-categories">{(branch.enabledCategories || []).map((c) => <span key={c._id} className="cat-pill">{c.name}</span>)}</div>
    <div className="branch-admin-meta"><span>📞 {branch.phone}</span><span>📍 {branch.city}</span><span>💰 حد أدنى للطلب: {branch.minimumOrderValue} ج</span></div>
    <button className="edit-branch-btn" onClick={() => onEdit(branch)}>✎ تعديل الفرع</button>
  </div>
);
export default BranchAdminCard;
