import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const AdminLogin = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
          <input type="text" aria-label="اسم المستخدم أو البريد الإلكتروني" autoComplete="username" placeholder="اسم المستخدم أو البريد الإلكتروني" value={username} onChange={(e) => setUsername(e.target.value)} required />

        </div>
        <div className="admin-login-field">
          <input aria-label="كلمة المرور" autoComplete="current-password" type={showPassword ? 'text' : 'password'} placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="button" className="field-icon toggle-visibility" aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"} onClick={() => setShowPassword((s) => !s)}>{showPassword ? 'إخفاء' : 'إظهار'}</button>
        </div>
        {error && <div className="form-error" role="alert">{error}</div>}
        <button type="submit" className="admin-login-submit" disabled={submitting}>{submitting ? 'جاري الدخول...' : 'تسجيل الدخول'}</button>
        <hr />
        <Link to="/" className="admin-login-help">العودة إلى موقع فسفور</Link>
      </form>
    </div>
  );
};
export default AdminLogin;
