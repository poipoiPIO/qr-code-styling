export const calculateStarPoints = (
  cx: number,
  cy: number,
  outerRadius: number,
  innerRadius: number,
  arms: number
): [number, number][] => {
  const pairNumbers = 2 * arms;
  const results: [number, number][] = new Array(pairNumbers);
  const angle = Math.PI / arms;

  for (let i = 0; i < pairNumbers; i++) {
    const r = !(i & 1) ? outerRadius : innerRadius;
    const currX = cx + Math.cos(i * angle) * r;
    const currY = cy + Math.sin(i * angle) * r;
    results[i] = [currX, currY];
  }

  return results;
};
