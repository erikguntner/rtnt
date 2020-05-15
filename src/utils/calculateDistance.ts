import * as turfHelpers from '@turf/helpers';
import length from '@turf/length';

export const calculateDistance = (data: number[][][], units: 'miles' | 'kilometers', precision = 1): string => {
  const flattened = data.reduce((accum, curr) => accum.concat(curr));
  const lineString = turfHelpers.lineString(flattened);

  return length(lineString, { units }).toFixed(precision);
};

export const abbreviatedDistance = (units: string): string => {
  if (units === 'miles') {
    return 'mi';
  } else {
    return 'km';
  }
};

export default calculateDistance;