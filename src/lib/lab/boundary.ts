// Boundary value lab: a field that should accept whole numbers from min to max.
// The build under test has an off-by-one defect at one edge (or none).

export type BoundaryBuild = 'upper' | 'lower' | 'none';

export function accepts(v: number, min: number, max: number, build: BoundaryBuild) {
  if (build === 'upper') return v >= min && v < max;
  if (build === 'lower') return v > min && v <= max;
  return v >= min && v <= max;
}

export const partition = (v: number, min: number, max: number) =>
  v < min ? 'below range' : v > max ? 'above range' : 'in range';

export function coverage(min: number, max: number, values: number[]) {
  const has = (x: number) => values.includes(x);
  return [
    { label: `Just below minimum (${min - 1})`, hit: has(min - 1), core: true },
    { label: `At minimum (${min})`, hit: has(min), core: true },
    { label: `At maximum (${max})`, hit: has(max), core: true },
    { label: `Just above maximum (${max + 1})`, hit: has(max + 1), core: true },
    { label: `Just above minimum (${min + 1})`, hit: has(min + 1), core: false },
    { label: `Just below maximum (${max - 1})`, hit: has(max - 1), core: false },
    { label: 'A typical value inside the range', hit: values.some((v) => v > min + 1 && v < max - 1), core: false },
  ];
}

export const sets = {
  two: (min: number, max: number) => [min - 1, min, max, max + 1],
  three: (min: number, max: number) => [min - 1, min, min + 1, max - 1, max, max + 1],
  robust: (min: number, max: number) => [min - 1, min, min + 1, Math.floor((min + max) / 2), max - 1, max, max + 1],
};
