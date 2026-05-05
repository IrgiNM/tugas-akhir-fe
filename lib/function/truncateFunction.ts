export const truncatePersen = (text: string, max: number) => {
  if (!text) return "-";
  return text.length > max ? text.slice(0, max) + "..." : text;
};