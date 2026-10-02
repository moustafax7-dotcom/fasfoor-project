const OfferCard = ({ offer, onOrder }) => (
  <div className="offer-card">
    <div className="offer-image">
      <img src={offer.image || '/images/offers/placeholder.jpg'} alt={offer.title} />
      <span className="offer-price-badge">{offer.price} جنيه</span>
    </div>
    <div className="offer-info">
      <h3>{offer.title}</h3>
      {offer.description && <p>{offer.description}</p>}
      {(offer.servesFrom || offer.servesTo) && <span className="offer-serves">يكفي {offer.servesFrom} - {offer.servesTo} أفراد</span>}
      <button className="order-offer-btn" onClick={() => onOrder(offer)}>🦐 اطلب العرض</button>
    </div>
  </div>
);
export default OfferCard;
