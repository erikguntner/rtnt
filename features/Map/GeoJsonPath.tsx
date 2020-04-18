import React from 'react';
import { Source, Layer } from 'react-map-gl';
import * as turf from '@turf/helpers';

interface Props {
  lines: number[][][];
  transparent?: boolean;
  width?: number;
}

const GeoJsonPath: React.FC<Props> = ({
  lines,
  transparent = false,
  width = 4,
}) => {
  const multiLine = turf.multiLineString(lines);
  const dataLayer = {
    id: 'path_layer',
    type: 'line',
    paint: {
      'line-width': width,
      'line-color': transparent ? '' : '#667eea',
    },
  };

  return (
    <Source type="geojson" data={multiLine}>
      <Layer {...dataLayer} />
    </Source>
  );
};

export default GeoJsonPath;
