import bbox from '@turf/bbox';
import * as turfHelpers from '@turf/helpers';
import WebMercatorViewport from 'viewport-mercator-project';

export const getViewport = (
  height: number,
  width: number,
  lines: number[][][],
  padding = 20
) => {
  console.log(height, width);

  const geoJson = turfHelpers.multiLineString(lines);
  const bBox = bbox(geoJson);
  const viewport = new WebMercatorViewport({
    width,
    height,
  }).fitBounds(
    [
      [bBox[0], bBox[1]],
      [bBox[2], bBox[3]],
    ],
    {
      padding,
    }
  );

  console.log(viewport);

  return viewport;
};