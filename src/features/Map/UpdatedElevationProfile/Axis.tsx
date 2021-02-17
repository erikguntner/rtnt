import React, { useMemo } from 'react';
import { scaleLinear } from 'd3';

interface AxisProps {
  domain: number[];
  range: number[];
  axis?: string;
}

const Axis = ({
  domain = [0, 100],
  range = [10, 290],
  axis = 'x',
}: AxisProps) => {
  const ticks = useMemo(() => {
    const scale = scaleLinear().domain(domain).range(range).nice();
    const rangeDifference =
      axis === 'x' ? range[1] - range[0] : range[0] - range[1];

    const pixelsPerTick = axis === 'x' ? 100 : 45;
    const numberOfTicksTarget = Math.max(
      1,
      Math.floor(rangeDifference / pixelsPerTick)
    );

    return scale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      offset: scale(value),
    }));
  }, [domain.join('-'), range.join('-')]);

  return (
    <svg>
      <path
        d={['M', range[0], 6, 'v', -6, 'H', range[1], 'v', 6].join(' ')}
        fill="none"
        stroke="#718096"
      />
      {ticks.map(({ value, offset }) => (
        <g key={value} transform={`translate(${offset}, 0)`}>
          <line y2="6" stroke="#718096" />
          <text
            key={value}
            style={{
              fill: '#718096',
              fontSize: '10px',
              textAnchor: 'middle',
              transform: `translateY(${axis === 'x' ? 20 : 24}px) translateX(${
                axis === 'x' ? 0 : 4
              }px) rotate(${axis === 'x' ? 0 : -90}deg)`,
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default Axis;
