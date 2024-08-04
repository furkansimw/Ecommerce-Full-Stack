export const times = {
  min: 60,
  hour: 3600,
  day: 86400,
  week: 604800,
  month: 2592000,
};

export function pass(g: Date, seconds: number): boolean {
  const now = parseInt((Date.now() / 1000).toString());
  const d = parseInt((g.getTime() / 1000).toString());
  const passed = now + seconds > d;

  return passed;
}
