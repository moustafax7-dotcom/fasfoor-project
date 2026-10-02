import MenuItemCard from './MenuItemCard.jsx';
const MenuGrid = ({ items = [], branchOpen = true }) => {
  if (!items.length) return <div className="menu-empty">لا توجد أصناف متاحة في هذا القسم حاليًا</div>;
  return <div className="items-grid">{items.map((item) => <MenuItemCard key={item._id} item={item} branchOpen={branchOpen} />)}</div>;
};
export default MenuGrid;
