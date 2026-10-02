import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useFavorites } from '../../context/FavoritesContext.jsx';

const ItemCard = ({ item }) => {
  const { addItem } = useCart();
  const { isFavorite, toggle } = useFavorites();
  const navigate = useNavigate();
  const needsDetailPage = (item.weightPrices?.length > 0) || (item.addOns?.length > 0);
  const displayPrice = item.weightPrices?.length ? item.weightPrices[0].price : item.price;

  const handleAdd = () => {
    addItem({
      itemId: item._id, name: item.name, unit: 'piece', unitPrice: item.price,
      quantity: 1, image: item.image, addOns: [],
      branchId: item.branches?.[0]?._id || item.branches?.[0],
    });
  };

  const handleToggleFavorite = async () => {
    const res = await toggle(item._id);
    if (res.needsLogin) navigate('/login', { state: { from: '/' } });
  };

  return (
    <div className="item-card">
      <button className={`item-fav ${isFavorite(item._id) ? 'item-fav-active' : ''}`} onClick={handleToggleFavorite}>
        {isFavorite(item._id) ? '♥' : '♡'}
      </button>
      <Link to={`/item/${item._id}`} className="item-image">
        <img src={item.image || '/images/menu/placeholder.jpg'} alt={item.name} />
      </Link>
      <div className="item-info">
        <Link to={`/item/${item._id}`}><h4>{item.name}</h4></Link>
        {item.description && <p>{item.description}</p>}
        <div className="item-footer">
          {needsDetailPage ? (
            <Link to={`/item/${item._id}`} className="item-add">اختر المقاس</Link>
          ) : (
            <button className="item-add" onClick={handleAdd}>+ أضف</button>
          )}
          <span className="item-price">{displayPrice} جنيه</span>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
