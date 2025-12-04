export const generateData = (count: number, generator: (i: number) => any) =>
  Array.from({ length: count }).map((_, i) => generator(i));
