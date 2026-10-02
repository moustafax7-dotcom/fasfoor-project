const Button = ({ children, variant = 'primary', ...props }) => (
  <button className={`btn btn-${variant}`} {...props}>{children}</button>
);
export default Button;
