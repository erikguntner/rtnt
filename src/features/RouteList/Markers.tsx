import React from 'react';
import { Circle, useMap } from 'react-leaflet';

interface MarkersProps {
  start_point: number[];
  end_point: number[];
}

const Markers = ({ start_point, end_point }: MarkersProps) => {
  const map = useMap();

  const scale = 5 / map?.getZoom();
  console.log

  return (
    <>
      <Circle
        center={[start_point[1], start_point[0]]}
        pathOptions={{
          fill: true,
          fillOpacity: 1,
          fillColor: '#68d391',
          stroke: true,
          color: '#fff',
        }}
        radius={scale}
      />
      <Circle
        center={[end_point[1], end_point[0]]}
        pathOptions={{
          fill: true,
          fillOpacity: 1,
          fillColor: '#e53e3e',
          stroke: true,
          color: '#fff',
        }}
        radius={scale}
      />
    </>
  );
};

export default Markers;
