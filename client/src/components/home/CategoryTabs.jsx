const CategoryTabs = ({ categories = [], active, onSelect }) => (
  <div className="category-tabs">
    <button className={`tab ${!active ? 'tab-active' : ''}`} onClick={() => onSelect(null)}>كل الأصناف</button>
    {categories.map((c) => (
      <button key={c._id} className={`tab ${active === c._id ? 'tab-active' : ''}`} onClick={() => onSelect(c._id)}>{c.name}</button>
    ))}
  </div>
);
export default CategoryTabs;
