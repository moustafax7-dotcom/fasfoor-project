import PageIntro from '../components/common/PageIntro.jsx';
import StatePanel from '../components/common/StatePanel.jsx';
import MenuItemCard from '../components/menu/MenuItemCard.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useCustomerAuth } from '../context/CustomerAuthContext.jsx';

const Favorites = () => {
  const { isAuthenticated } = useCustomerAuth();
  const { favoriteItems, loading, error, refresh } = useFavorites();

  if (!isAuthenticated) {
    return (
      <main className="favorites-page account-guest">
        <PageIntro title="المفضلة" /><StatePanel title="احتفظ بالأصناف اللي بتحبها" description="سجّل دخولك علشان ترجع لاختياراتك بسهولة." to="/login" actionLabel="تسجيل الدخول" />
      </main>
    );
  }

  return (
    <main className="favorites-page">
      <PageIntro title="المفضلة" description="اختياراتك المفضلة، جاهزة ترجع لها في أي وقت." />
      {loading && <p className="page-loading" role="status">جاري تحميل المفضلة…</p>}
      {error && <StatePanel error title={error} onRetry={refresh} />}
      {!loading && !error && !favoriteItems.length ? (
        <StatePanel title="المفضلة لسه فاضية" description="اضغط علامة القلب على أي صنف في المنيو علشان يتحفظ هنا." to="/menu" />
      ) : (
        <div className="items-grid">{favoriteItems.map((item) => <MenuItemCard key={item._id} item={item} />)}</div>
      )}
    </main>
  );
};
export default Favorites;
