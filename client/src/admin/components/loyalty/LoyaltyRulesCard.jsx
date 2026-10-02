const LoyaltyRulesCard = ({ config, onEdit }) => (
  <div className="loyalty-rules-card">
    <div className="loyalty-rules-header">
      <div><h3>برنامج ولاء العملاء</h3><p>يكسب العملاء النقاط مع كل طلب ويمكنهم استبدالها بمكافآت</p></div>
      <button className="add-btn" onClick={onEdit}>✎ تعديل البرنامج</button>
    </div>
    <ul className="loyalty-rules-list">{(config?.rules || []).map((r) => <li key={r}>{r}</li>)}</ul>
  </div>
);
export default LoyaltyRulesCard;
