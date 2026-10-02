import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const AdminLogin = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setSubmitting(true);
    try {
      await login(username, password);
      navigate('/admin', { replace: true });
    } catch (err) { setError(err.response?.data?.message || 'بيانات الدخول غير صحيحة'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-brand"><img src="/images/logo/logo.jpg" alt="مطعم فسفور" /></div>
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <h1>دخول إدارة فسفور</h1>
        <div className="admin-login-field">
          <input type="text" placeholder="البريد الإلكتروني" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <span className="field-icon">👤</span>
        </div>
        <div className="admin-login-field">
          <input type={showPassword ? 'text' : 'password'} placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="button" className="field-icon toggle-visibility" onClick={() => setShowPassword((s) => !s)}>{showPassword ? '🙈' : '👁'}</button>
        </div>
        <label className="remember-me"><span>تذكرني</span><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /></label>
        {error && <div className="page-error">{error}</div>}
        <button type="submit" className="admin-login-submit" disabled={submitting}>🦐 {submitting ? 'جاري الدخول...' : 'تسجيل الدخول'}</button>
        <hr />
        <a href="tel:17397" className="admin-login-help">؟ هل تحتاج مساعدة</a>
      </form>
    </div>
  );
};
export default AdminLogin;
