const variants = {
  gold: "bg-[var(--champagne)] text-white shadow-[0_18px_40px_rgba(200,168,106,0.28)] hover:-translate-y-0.5 hover:bg-[#b8914d]",
  ghost:
    "border border-[var(--border-soft)] bg-white/45 text-[var(--ink)] hover:bg-white/70",
  dark: "bg-[var(--navy)] text-white shadow-[0_18px_40px_rgba(19,34,63,0.18)] hover:-translate-y-0.5 hover:bg-[#0f1c34]",
};

const Button = ({
  children,
  variant = "dark",
  className = "",
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      {...props}
      className={`inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-300 ease-out disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
