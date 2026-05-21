// Palette per task spec: teal/emerald/sky/amber/purple
// plus the pink already used in seed data so existing classes look consistent.
const CLASS_PALETTE = [
  "#0d9488", // teal-600
  "#10b981", // emerald-500
  "#0ea5e9", // sky-500
  "#f59e0b", // amber-500
  "#a855f7", // purple-500
  "#ec4899", // pink-500
] as const;

export function classColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) & 0xffffffff;
  }
  const idx = Math.abs(hash) % CLASS_PALETTE.length;
  return CLASS_PALETTE[idx];
}
