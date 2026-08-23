/**
 * A deterministic QR-style block for the in-app UPI payment mock.
 *
 * Intentionally not a scannable code — it stands in for the customer's own
 * UPI VPA, which is generated on the device. The real, scannable Play Store
 * QR lives in the Download section and is generated at build time.
 */
export default function QrBlock({
  size = 96,
  className,
  color = 'currentColor',
}: {
  size?: number;
  className?: string;
  color?: string;
}) {
  const grid = 21;
  const cells: React.ReactNode[] = [];

  // Seeded LCG — same pattern on server and client, so no hydration mismatch.
  let seed = 20250822;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };

  const inFinder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= grid - 7 && y < 7) || (x < 7 && y >= grid - 7);

  for (let y = 0; y < grid; y += 1) {
    for (let x = 0; x < grid; x += 1) {
      if (inFinder(x, y)) continue;
      if (rand() > 0.52) {
        cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />);
      }
    }
  }

  const finder = (fx: number, fy: number) => (
    <g key={`f-${fx}-${fy}`}>
      <rect x={fx} y={fy} width="7" height="7" />
      <rect x={fx + 1} y={fy + 1} width="5" height="5" fill="var(--qr-bg, #fff)" />
      <rect x={fx + 2} y={fy + 2} width="3" height="3" />
    </g>
  );

  return (
    <svg
      viewBox={`0 0 ${grid} ${grid}`}
      width={size}
      height={size}
      className={className}
      fill={color}
      shapeRendering="crispEdges"
      role="img"
      aria-label="UPI payment QR code"
    >
      {cells}
      {finder(0, 0)}
      {finder(grid - 7, 0)}
      {finder(0, grid - 7)}
    </svg>
  );
}
