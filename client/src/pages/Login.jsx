import { useState } from 'react';
import { customerReturnPath, normalizeDigits } from '../services/customerNavigation.js';
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

  const redirectTo = customerReturnPath(location.state?.from);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (submitting) return;
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
    if (submitting) return;
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
          <p className="auth-sub">الدخول برقم الهاتف وكود تحقق. لو الخدمة غير متاحة، هتظهر لك رسالة واضحة.</p>
          <label htmlFor="customer-phone">رقم الهاتف</label>
          <input id="customer-phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" required minLength={11} maxLength={11} pattern="01[0-9]{9}" value={phone} onChange={(e) => setPhone(normalizeDigits(e.target.value).replace(/[^0-9]/g, ""))} placeholder="01xxxxxxxxx" />
          {isNewUser && (
            <>
              <label htmlFor="customer-name">الاسم (أول مرة تدخل بالرقم ده)</label>
              <input id="customer-name" autoComplete="name" maxLength={80} required value={name} onChange={(e) => setName(e.target.value)} />
              {showReferral ? (
                <>
                  <label htmlFor="referral-code">كود دعوة (اختياري)</label>
                  <input id="referral-code" value={referralCode} onChange={(e) => setReferralCode(e.target.value)} placeholder="لو حد رشحلك" />
                </>
              ) : (
                <button type="button" className="link-btn referral-toggle" onClick={() => setShowReferral(true)}>عندك كود دعوة؟</button>
              )}
            </>
          )}
          {error && <div className="form-error" role="alert">{error}</div>}
          <button type="submit" className="auth-submit" disabled={submitting}>{submitting ? 'جاري الإرسال...' : 'إرسال كود التحقق'}</button>
        </form>
      )}
      {step === 'otp' && (
        <form className="auth-form" onSubmit={handleVerify}>
          <h1>أدخل الكود</h1>
          <p className="auth-sub">بعتنالك كود تحقق على {phone}</p>
          <label htmlFor="verification-code">كود التحقق (6 أرقام)</label>
          <input id="verification-code" type="text" dir="ltr" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" required minLength={6} maxLength={6} value={otp} onChange={(e) => setOtp(normalizeDigits(e.target.value).replace(/[^0-9]/g, ""))} placeholder="000000" />
          {error && <div className="form-error" role="alert">{error}</div>}
          <button type="submit" className="auth-submit" disabled={submitting}>{submitting ? 'جاري التحقق...' : 'تأكيد الدخول'}</button>
          <p className="auth-switch"><button type="button" className="link-btn" disabled={submitting} onClick={() => { setStep("phone"); setOtp(""); setError(null); }}>تغيير الرقم</button></p>
        </form>
      )}
    </main>
  );
};
export default Login;
