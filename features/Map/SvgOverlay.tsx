import React from 'react';
import { SVGOverlay } from 'react-map-gl';

interface Props {
  point: number[];
}

const SvgOverlay: React.FC<Props> = ({ point }) => {
  const redraw = ({ project }) => {
    const [cx, cy] = project([point[0], point[1]]);
    return <circle cx={cx} cy={cy} r={4} fill="blue" />;
  };

  return <SVGOverlay redraw={redraw} />;
};

export default SvgOverlay;
