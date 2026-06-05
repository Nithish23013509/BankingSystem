export default function Card({ children, className = '', hover = false, glow = false, ...props }) {
  return (
    <div
      className={`
        glass rounded-2xl p-6 animate-fade-in
        ${hover ? 'glass-hover cursor-pointer transition-all duration-200' : ''}
        ${glow ? 'glow-blue' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
