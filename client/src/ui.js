// client/src/ui.js

// page shells
export const pageBg = "min-h-screen bg-slate-50 text-slate-800";
export const section = "mx-auto max-w-6xl px-4"; // general inner width
export const container = section; // alias used by Navbar

// headings
export const h1 = "text-2xl font-semibold tracking-tight";
export const h2 = "text-xl font-semibold tracking-tight";

// form bits
export const label = "mb-1 block text-sm font-medium text-slate-700";
export const input =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none " +
  "focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition";

// buttons & cards
export const btn =
  "inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm " +
  "shadow-sm hover:bg-slate-50 active:bg-slate-100 transition";
export const card = "rounded-2xl border border-slate-200 bg-white shadow-sm";

// helpers
export const empty =
  "rounded-xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-slate-500";
export const skeleton = "animate-pulse rounded-md bg-slate-200/80";
