import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useCustomerAuth } from '../../context/CustomerAuthContext.jsx';

const Header = () => {
  const { items } = useCart();
  const { customer, isAuthenticated } = useCustomerAuth();
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <header className="site-header">
      <Link to="/" className="header-brand" aria-label="فسفور — الرئيسية"><img className="logo" src="/images/logo/logo.jpg" alt="" width="52" height="52" /><span>فسفور<small>مأكولات بحرية</small></span></Link>
      <nav aria-label="التصفح الرئيسي">
        <NavLink to="/" end>الرئيسية</NavLink><NavLink to="/menu">المنيو</NavLink><NavLink to="/branches">الفروع</NavLink><NavLink to="/offers">العروض</NavLink><NavLink to="/account/orders">طلباتي</NavLink>
      </nav>
      <div className="header-actions">
        <Link to="/account" className="header-account">{isAuthenticated ? customer?.name?.split(' ')[0] || 'حسابي' : 'حسابي'}</Link>
        <Link to="/cart" className="header-cart">السلة <span>{quantity}</span></Link>
      </div>
    </header>
  );
};
export default Header;
