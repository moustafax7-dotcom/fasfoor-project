const BranchCard = ({ branch, onSelect }) => {
  const categoryNames = (branch.enabledCategories || []).map((c) => c.name).join(' • ');
  return (
    <div className="branch-page-card">
      <div className="branch-page-image"><img src={branch.image || '/images/branches/placeholder.jpg'} alt={branch.name} /></div>
      <div className="branch-page-info">
        <span className="branch-page-tag">فرع</span>
        <h3>{branch.name}</h3>
        {categoryNames && <p className="branch-page-categories">{categoryNames}</p>}
        <div className="branch-page-meta">
          <div><span className="meta-label">ساعات العمل</span><span>{branch.workingHours?.from} - {branch.workingHours?.to}</span></div>
          <div><span className="meta-label">للاتصال</span><span>{branch.phone}</span></div>
          <div><span className="meta-label">الموقع</span><span>{branch.city}</span></div>
        </div>
        <span className={`branch-status ${branch.isOpen ? 'open' : 'closed'}`}>{branch.isOpen ? 'مفتوح الآن' : 'مغلق حاليًا'}</span>
        <button className="select-branch-btn" onClick={() => onSelect(branch)}>اختار الفرع</button>
      </div>
    </div>
  );
};
export default BranchCard;
