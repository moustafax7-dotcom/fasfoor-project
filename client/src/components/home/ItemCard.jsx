import { useState } from 'react';
import { itemBranch } from '../../services/cartState.js';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useFavorites } from '../../context/FavoritesContext.jsx';

const ItemCard = ({ item }) => {
  const { addItem, branchId } = useCart();
  const [notice, setNotice] = useState(null);
  const { isFavorite, isPending, toggle } = useFavorites();
  const navigate = useNavigate();
  const needsDetailPage = (item.weightPrices?.length > 0) || (item.addOns?.length > 0);
  const displayPrice = item.weightPrices?.length ? item.weightPrices[0].price : item.price;

  const handleAdd = () => {
    addItem({
      itemId: item._id, name: item.name, unit: 'piece', unitPrice: item.price,
      quantity: 1, image: item.image, addOns: [],
      branchId: itemBranch(item, branchId)?._id || itemBranch(item, branchId),
    });
  };

  const handleToggleFavorite = async () => {
    let res;
    try { res = await toggle(item._id); setNotice(null); } catch { setNotice("تعذر تحديث المفضلة، جرّب تاني"); return; }
    if (res.needsLogin) navigate('/login', { state: { from: '/' } });
  };

  return (
    <div className="item-card">
      <button className={`item-fav ${isFavorite(item._id) ? 'item-fav-active' : ''}`} disabled={isPending(item._id)} aria-label={isFavorite(item._id) ? "إزالة من المفضلة" : "إضافة للمفضلة"} onClick={handleToggleFavorite}>
        {isFavorite(item._id) ? '♥' : '♡'}
      </button>
      <Link to={`/item/${item._id}`} className="item-image">
        <img src={item.image || '/images/menu/placeholder.jpg'} alt={item.name} />
      </Link>
      <div className="item-info">
        {notice && <p className="item-action-error" role="alert">{notice}</p>}
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
