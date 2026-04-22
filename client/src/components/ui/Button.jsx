const Button = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="
        w-full
        rounded-xl
        bg-slate-900
        px-4 py-2
        text-sm
        font-semibold
        text-white
        hover:bg-slate-800
        transition
        disabled:opacity-60
      "
    >
      {children}
    </button>
  );
};

export default Button;
