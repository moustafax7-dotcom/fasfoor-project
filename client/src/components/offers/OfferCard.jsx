const OfferCard = ({ offer }) => (
  <div className="offer-card">
    <div className="offer-image">
      {offer.image ? <img src={offer.image} alt={offer.title} loading="lazy" /> : <div className="offer-image-placeholder">فسفور</div>}
      <span className="offer-price-badge">{offer.price} جنيه</span>
    </div>
    <div className="offer-info">
      <h3>{offer.title}</h3>
      {offer.description && <p>{offer.description}</p>}
      {(offer.servesFrom || offer.servesTo) && <span className="offer-serves">يكفي {offer.servesFrom} - {offer.servesTo} أفراد</span>}
      <a className="order-offer-btn" href="tel:17397">استفسر عن العرض</a>
    </div>
  </div>
);
export default OfferCard;
