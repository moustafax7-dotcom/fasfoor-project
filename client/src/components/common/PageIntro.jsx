const PageIntro = ({ title, description, eyebrow = 'مطعم فسفور', children }) => (
  <header className="page-intro">
    <div>
      <p className="page-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {description && <p className="page-description">{description}</p>}
    </div>
    {children && <div className="page-intro-actions">{children}</div>}
  </header>
);
export default PageIntro;
