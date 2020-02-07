import React from 'react';
import { Source, Layer } from 'react-map-gl';
import * as turf from '@turf/helpers';

interface Props {
  lines: number[][][];
}

const dataLayer = {
  id: 'path_layer',
  type: 'line',
  paint: {
    'line-width': 4,
    'line-color': '#667eea',
  },
};

const GeoJsonPath: React.FC<Props> = ({ lines }) => {
  var multiLine = turf.multiLineString(lines);

  return (
    <Source type="geojson" data={multiLine}>
      <Layer {...dataLayer} />
    </Source>
  );
};

export default GeoJsonPath;