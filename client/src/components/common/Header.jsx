import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useCustomerAuth } from '../../context/CustomerAuthContext.jsx';

const Header = () => {
  const { items } = useCart();
  const { customer, isAuthenticated } = useCustomerAuth();
  return (
    <header className="site-header">
      <nav>
        <Link to="/">الرئيسية</Link>
        <Link to="/menu">منيو الطعام</Link>
        <Link to="/branches">الفروع</Link>
        <Link to="/offers">العروض</Link>
        <Link to="/account/orders">طلباتي</Link>
      </nav>
      <div className="header-actions">
        <Link to="/account">{isAuthenticated ? customer.name.split(' ')[0] : 'حسابي'}</Link>
        <Link to="/cart">السلة ({items.length})</Link>
      </div>
      <img className="logo" src="/images/logo/logo.jpg" alt="مطعم فسفور" />
    </header>
  );
};
export default Header;
