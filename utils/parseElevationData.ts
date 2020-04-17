import distance from '@turf/distance';
import * as turfHelpers from '@turf/helpers';

interface ElevationData {
  distance: number;
  elevation: number;
}

const parseElevationData = (lines: number[][][]): ElevationData[] => {
  let totalDistance = 0;
  const coords: number[][] = lines.flat();
  const result: ElevationData[] = [];

  for (let i = 0; i < coords.length; i++) {
    if (i === 0) {
      result.push({ distance: totalDistance, elevation: coords[i][2] });
    } else {
      const from = turfHelpers.point(coords[i - 1]);
      const to = turfHelpers.point(coords[i]);
      const elevation = coords[i][2];
      totalDistance = totalDistance + distance(from, to, { units: 'meters' });
      result.push({ distance: totalDistance, elevation });
    }
  }

  return result;
}


export default parseElevationData;