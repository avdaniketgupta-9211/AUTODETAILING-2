export function cn(...classes: Array<string | number | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const pad2 = (n: number) => String(n).padStart(2, "0");
