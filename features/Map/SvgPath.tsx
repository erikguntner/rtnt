import React, { useEffect } from 'react';
import * as turfHelpers from '@turf/helpers';
import { SVGOverlay } from 'react-map-gl';
import { scaleLinear, select, line, mouse, max } from 'd3';

interface ElevationData {
  distance: number;
  segDistance: number;
  elevation: number;
}

interface Props {
  points: number[][][];
  elevationData?: ElevationData[][] | null;
  mapRef?: React.MutableRefObject<any>;
  setDistanceAlongPath?: React.Dispatch<React.SetStateAction<number>>;
  units?: 'miles' | 'kilometers';
}

const SvgPath: React.FC<Props> = ({
  points,
  elevationData = null,
  setDistanceAlongPath,
  units,
}) => {
  function mouseMove() {
    const data = elevationData.flat();

    const mouseCoords = mouse(this);
    const path = select('.route-path');
    let beginning = 0;
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    //@ts-ignore
    let end = path.node().getTotalLength();
    let pos = null;

    const xValue = (d) =>
      turfHelpers.convertLength(d.distance, 'meters', units);

    const xScale = scaleLinear()
      .domain([0, max(data, xValue)])
      .range([0, end]);

    while (true) {
      const target = Math.floor((beginning + end) / 2);
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      //@ts-ignore
      pos = path.node().getPointAtLength(target);
      if (
        (target === end || target === beginning) &&
        pos.x !== mouseCoords[0]
      ) {
        break;
      }
      if (pos.x > mouseCoords[0]) end = target;
      else if (pos.x < mouseCoords[0]) beginning = target;
      else break; //position found
    }

    setDistanceAlongPath(+xScale.invert(pos.x) - 1.2);
  }

  useEffect(() => {
    console.log('im reloadingggg');
    if (elevationData !== null) {
      const path = select('.route-path');
      path.attr('pointer-events', 'all');
      // .on('mouseout', mouseOut)
      // .on('mouseover', mouseOver)
      // .on('mousemove', mouseMove);
    }
  }, [elevationData]);

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
        // onMouseMove={handleMouseMove}
      />
    );
  };

  return <SVGOverlay redraw={redraw} />;
};

export default SvgPath;
