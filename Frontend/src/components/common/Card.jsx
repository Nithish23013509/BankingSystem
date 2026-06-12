export default function Card({ children, className = '', glow = false, ...props }) {
  return (
    <div
      className={`
        glass rounded-2xl p-4 sm:p-6
        transition-all duration-300 ease-out
        card-3d
        ${glow ? 'animate-border-glow' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
