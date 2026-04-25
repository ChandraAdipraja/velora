const Input = ({ label, ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-[var(--ink)]/80">
        {label}
      </label>
      <input
        {...props}
        className="
          w-full
          rounded-2xl
          border border-[var(--border-soft)]
          bg-white/80
          px-4 py-3
          text-sm
          text-[var(--ink)]
          outline-none
          transition
          placeholder:text-slate-400
          focus:border-[var(--champagne)]
          focus:bg-white
          focus:ring-4
          focus:ring-[rgba(200,168,106,0.16)]
        "
      />
    </div>
  );
};

export default Input;
