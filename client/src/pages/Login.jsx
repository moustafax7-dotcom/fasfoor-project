import { useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext.jsx';
import { sendOtp } from '../services/customerAuthService.js';

const Login = () => {
  const { loginWithOtp } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [referralCode, setReferralCode] = useState(searchParams.get('ref') || '');
  const [showReferral, setShowReferral] = useState(!!searchParams.get('ref'));
  const [isNewUser, setIsNewUser] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from || '/account';

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(null); setSubmitting(true);
    try {
      await sendOtp(phone, name || undefined, referralCode || undefined);
      setStep('otp');
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === 'الاسم مطلوب لأول تسجيل') { setIsNewUser(true); setError('أول مرة تدخل بالرقم ده؟ اكتب اسمك وجرّب تاني'); }
      else setError(msg || 'تعذر إرسال كود التحقق');
    } finally { setSubmitting(false); }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null); setSubmitting(true);
    try {
      await loginWithOtp(phone, otp);
      navigate(redirectTo, { replace: true });
    } catch (err) { setError(err.response?.data?.message || 'الكود غير صحيح'); }
    finally { setSubmitting(false); }
  };

  return (
    <main className="auth-page">
      {step === 'phone' && (
        <form className="auth-form" onSubmit={handleSendOtp}>
          <h1>تسجيل الدخول</h1>
          <p className="auth-sub">هنبعتلك كود تحقق برسالة على رقمك — مفيش باسورد تتذكره</p>
          <label>رقم الهاتف</label>
          <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01xxxxxxxxx" />
          {isNewUser && (
            <>
              <label>الاسم (أول مرة تدخل بالرقم ده)</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} />
              {showReferral ? (
                <>
                  <label>كود دعوة (اختياري)</label>
                  <input value={referralCode} onChange={(e) => setReferralCode(e.target.value)} placeholder="لو حد رشحلك" />
                </>
              ) : (
                <button type="button" className="link-btn referral-toggle" onClick={() => setShowReferral(true)}>عندك كود دعوة؟</button>
              )}
            </>
          )}
          {error && <div className="page-error">{error}</div>}
          <button type="submit" className="auth-submit" disabled={submitting}>{submitting ? 'جاري الإرسال...' : 'إرسال كود التحقق'}</button>
        </form>
      )}
      {step === 'otp' && (
        <form className="auth-form" onSubmit={handleVerify}>
          <h1>أدخل الكود</h1>
          <p className="auth-sub">بعتنالك كود تحقق على {phone}</p>
          <label>كود التحقق (6 أرقام)</label>
          <input type="text" required maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="000000" />
          {error && <div className="page-error">{error}</div>}
          <button type="submit" className="auth-submit" disabled={submitting}>{submitting ? 'جاري التحقق...' : 'تأكيد الدخول'}</button>
          <p className="auth-switch"><button type="button" className="link-btn" onClick={() => setStep('phone')}>تغيير الرقم</button></p>
        </form>
      )}
    </main>
  );
};
export default Login;
