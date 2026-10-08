import { useState } from 'react';
import { createReview } from '../../services/reviewService.js';

const RatingPrompt = ({ orderId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!rating || saving) return;
    setSaving(true); setError(null);
    try {
      await createReview({ orderId, rating, comment });
      setSubmitted(true);
    } catch (err) { setError(err.response?.data?.message || 'تعذر إرسال التقييم'); }
    finally { setSaving(false); }
  };

  if (submitted) return <div className="rating-thanks">🙏 شكرًا على تقييمك، بيساعدنا نحسّن الخدمة</div>;

  return (
    <div className="rating-prompt">
      <h3>قيّم تجربتك مع الطلب ده</h3>
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((n) => <button key={n} className={n <= rating ? 'star-active' : ''} disabled={saving} aria-label={`${n} من 5 نجوم`} aria-pressed={n === rating} onClick={() => setRating(n)}>★</button>)}
      </div>
      <textarea aria-label="تعليق على الطلب" maxLength={500} disabled={saving} placeholder="اكتب رأيك (اختياري)" value={comment} onChange={(e) => setComment(e.target.value)} />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="submit-rating-btn" onClick={handleSubmit} disabled={!rating || saving}>{saving ? "جاري الإرسال…" : "إرسال التقييم"}</button>
    </div>
  );
};
export default RatingPrompt;
