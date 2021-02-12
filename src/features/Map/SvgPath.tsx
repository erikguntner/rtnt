import React from 'react';
import { SVGOverlay } from 'react-map-gl';

interface Props {
  points: number[][][];
}

const SvgPath = ({ points }: Props) => {
  const redraw = ({ project }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    //@ts-ignore
    const path = points.flat().reduce((accum, point, i) => {
      const [x, y] = project([point[0], point[1]]);
      if (i === 0) {
        accum += `M ${x} ${y} `;
      } else {
        accum += `L ${x} ${y} `;
      }
      return accum;
    }, '');

    return (
      <path
        d={path}
        stroke="#667eea"
        strokeWidth="4"
        fill="none"
        className="route-path"
      />
    );
  };

  return <SVGOverlay redraw={redraw} />;
};

export default SvgPath;
