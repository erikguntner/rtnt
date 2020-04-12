import React from 'react';
import WebMercatorViewport from '@math.gl/web-mercator';
import { SVGOverlay } from 'react-map-gl';
import {
  area,
  axisLeft,
  axisBottom,
  scaleLinear,
  scaleBand,
  extent,
  select,
  selectAll,
  curveMonotoneX,
  line,
  mouse,
  max,
} from 'd3';

interface Props {
  points: number[][][];
  mapRef: React.MutableRefObject<any>;
  setPointAlongPath: React.Dispatch<React.SetStateAction<number[]>>;
}

const SvgPath: React.FC<Props> = ({ points, mapRef, setPointAlongPath }) => {
  const handleMouseMove = (event) => {
    const bounds = event.target.getBoundingClientRect();
    const container = mapRef.current.getCanvasContainer();
    const x = event.clientX - container.offsetLeft;
    const y = event.clientY - container.offsetTop - 64;
    console.log(mapRef.current);
    const {
      width,
      height,
      scale,
      tileZoom,
      _center,
      _pitch,
    } = mapRef.current.transform;
    console.log(scale);

    const viewport = new WebMercatorViewport({
      width,
      height,
      longitude: _center.lng,
      latitude: _center.lat,
      zoom: tileZoom,
      pitch: _pitch,
    });

    const coords = viewport.unproject([x, y], scale);
    setPointAlongPath(coords);
  };

  const redraw = ({ project }) => {
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
        onMouseMove={handleMouseMove}
      />
    );
  };

  return <SVGOverlay redraw={redraw} />;
};

export default SvgPath;
