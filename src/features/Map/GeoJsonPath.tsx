import React from 'react';
import { Source, Layer, LayerProps } from 'react-map-gl';
import * as turf from '@turf/helpers';

interface Props {
  lines: number[][][];
}

// const GeoJsonPath: React.FC<Props> = ({ lines }) => {
//   const multiLine = turf.multiLineString(lines);
//   const dataLayer: LayerProps = {
//     id: `path_layer`,
//     type: 'line',
//     paint: {
//       'line-width': 4,
//       'line-color': '#667eea',
//     },
//   };

//   return (
//     <Source type="geojson" data={multiLine}>
//       <Layer {...dataLayer} />
//     </Source>
//   );
// };

const GeoJsonPath: React.FC<Props> = ({ lines }) => {
  return (
    <>
      {lines.map((line, i) => {
        const multiLine = turf.lineString(line, {
          startPoint: line[0],
          endPoint: line[line.length - 1],
        });
        const dataLayer: LayerProps = {
          id: `path_layer_${i}`,
          type: 'line',
          paint: {
            'line-width': 4,
            'line-color': '#667eea',
          },
        };
        return (
          <Source key={`${line[0]}`} type="geojson" data={multiLine}>
            <Layer {...dataLayer} />
          </Source>
        );
      })}
    </>
  );
};

export default React.memo(GeoJsonPath);
