import { useState } from 'react';
import { createReview } from '../../services/reviewService.js';

const RatingPrompt = ({ orderId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!rating) return;
    try {
      await createReview({ orderId, rating, comment });
      setSubmitted(true);
    } catch (err) { setError(err.response?.data?.message || 'تعذر إرسال التقييم'); }
  };

  if (submitted) return <div className="rating-thanks">🙏 شكرًا على تقييمك، بيساعدنا نحسّن الخدمة</div>;

  return (
    <div className="rating-prompt">
      <h3>قيّم تجربتك مع الطلب ده</h3>
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((n) => <button key={n} className={n <= rating ? 'star-active' : ''} onClick={() => setRating(n)}>★</button>)}
      </div>
      <textarea placeholder="اكتب رأيك (اختياري)" value={comment} onChange={(e) => setComment(e.target.value)} />
      {error && <p className="page-error">{error}</p>}
      <button className="submit-rating-btn" onClick={handleSubmit} disabled={!rating}>إرسال التقييم</button>
    </div>
  );
};
export default RatingPrompt;
