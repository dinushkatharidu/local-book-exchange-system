// Small “design system” as plain Tailwind class strings (no @apply)
export const container = "max-w-6xl mx-auto px-4";
export const section = `${container} py-8`;
export const card = "rounded-2xl border border-slate-200 bg-white shadow-sm";
export const btn =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium shadow-sm transition hover:bg-slate-50 active:scale-[.99] focus:outline-none focus:ring-2 focus:ring-indigo-400";
export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-600 bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm transition hover:bg-indigo-700 active:scale-[.99] focus:outline-none focus:ring-2 focus:ring-indigo-400";
export const input =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-800 outline-none transition focus:ring-2 focus:ring-indigo-400 placeholder:text-slate-400";
export const textMuted = "text-slate-500";
export const h1 = "text-2xl md:text-3xl font-semibold tracking-tight";
export const h2 = "text-xl md:text-2xl font-semibold";
export const empty =
  "flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-slate-500";
