import ItemCard from './ItemCard.jsx';
const MostOrdered = ({ items = [] }) => {
  if (!items.length) return null;
  return (
    <section className="most-ordered">
      <h2>الأكثر طلبًا</h2>
      <div className="items-grid">{items.map((item) => <ItemCard key={item._id} item={item} />)}</div>
    </section>
  );
};
export default MostOrdered;
