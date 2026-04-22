const Input = ({ label, ...props }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        {...props}
        className="
          w-full
          rounded-xl
          border border-slate-300
          px-3 py-2
          text-sm
          outline-none
          focus:ring-2 focus:ring-slate-900
          focus:border-transparent
        "
      />
    </div>
  );
};

export default Input;
