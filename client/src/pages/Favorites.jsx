import { Link } from 'react-router-dom';
import MenuItemCard from '../components/menu/MenuItemCard.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useCustomerAuth } from '../context/CustomerAuthContext.jsx';

const Favorites = () => {
  const { isAuthenticated } = useCustomerAuth();
  const { favoriteItems } = useFavorites();

  if (!isAuthenticated) {
    return (
      <main className="favorites-page account-guest">
        <h1>المفضلة</h1><p>سجّل دخولك لعرض الأصناف المفضلة عندك</p>
        <Link to="/login" className="hero-order-btn">تسجيل الدخول</Link>
      </main>
    );
  }

  return (
    <main className="favorites-page">
      <h1>المفضلة</h1>
      {!favoriteItems.length ? (
        <div className="menu-empty">لسه مضفتش أي صنف للمفضلة. اضغط ♡ على أي صنف في المنيو عشان يتحفظ هنا.</div>
      ) : (
        <div className="items-grid">{favoriteItems.map((item) => <MenuItemCard key={item._id} item={item} />)}</div>
      )}
    </main>
  );
};
export default Favorites;
