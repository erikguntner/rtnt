import React from 'react';
import { Source, Layer } from 'react-map-gl';
import * as turf from '@turf/helpers';

interface Props {
  line: number[][];
  transparent?: boolean;
  width?: number;
  i: number;
}

const GeoJsonPath: React.FC<Props> = ({ line, width = 4, i }) => {
  const multiLine = turf.lineString(line);
  const dataLayer = {
    id: `path_layer-${i}`,
    type: 'line',
    paint: {
      'line-width': width,
      'line-color': '#667eea',
    },
  };

  return (
    <Source type="geojson" data={multiLine}>
      <Layer {...dataLayer} />
    </Source>
  );
};

export default GeoJsonPath;
