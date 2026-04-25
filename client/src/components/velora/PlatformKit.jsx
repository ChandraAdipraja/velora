import { motion } from "framer-motion";

const cardClassName =
  "rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl";

export const pageMotion = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: "easeOut" },
};

export const GlassCard = ({
  children,
  className = "",
  hover = true,
  ...props
}) => (
  <motion.div
    whileHover={hover ? { y: -4 } : undefined}
    transition={{ type: "spring", stiffness: 260, damping: 24 }}
    className={`${cardClassName} ${className}`}
    {...props}
  >
    {children}
  </motion.div>
);

export const SectionHeader = ({ label, title, description, action }) => (
  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div className="max-w-3xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-champagne">
        {label}
      </p>
      <h2 className="mt-2 text-3xl font-semibold text-navy sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
          {description}
        </p>
      )}
    </div>
    {action ? <div>{action}</div> : null}
  </div>
);

export const Badge = ({ children, tone = "neutral", className = "" }) => {
  const tones = {
    neutral: "border-white/70 bg-white/80 text-navy",
    gold: "border-[rgba(200,168,106,0.25)] bg-[rgba(200,168,106,0.12)] text-[#92723b]",
    navy: "border-[rgba(19,34,63,0.14)] bg-[rgba(19,34,63,0.08)] text-navy",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    danger: "border-rose-200 bg-rose-50 text-rose-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
};

export const MetricCard = ({
  label,
  value,
  detail,
  icon: Icon,
  trend,
  className = "",
}) => (
  <GlassCard className={`p-5 ${className}`}>
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted">
          {label}
        </p>
        <p className="mt-3 text-3xl font-semibold text-navy">{value}</p>
        {detail && <p className="mt-2 text-sm text-muted">{detail}</p>}
      </div>
      {Icon ? (
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(19,34,63,0.06)] text-navy">
          <Icon className="h-5 w-5" />
        </span>
      ) : null}
    </div>
    {trend && (
      <p className="mt-5 text-sm font-medium text-champagne">{trend}</p>
    )}
  </GlassCard>
);

export const MiniBars = ({ values = [], accent = false }) => (
  <div className="flex h-20 items-end gap-2">
    {values.map((value, index) => (
      <div
        key={`${value}-${index}`}
        className="flex-1 rounded-full bg-white/60 p-1"
      >
        <div
          className={`w-full rounded-full ${accent ? "bg-champagne" : "bg-navy/80"}`}
          style={{ height: `${Math.max(18, value)}%` }}
        />
      </div>
    ))}
  </div>
);

export const TimelineItem = ({ label, value, tone = "neutral" }) => (
  <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/70 bg-white/70 px-4 py-3">
    <span className="text-sm text-muted">{label}</span>
    <span
      className={`text-sm font-semibold ${tone === "gold" ? "text-champagne" : "text-navy"}`}
    >
      {value}
    </span>
  </div>
);
