import * as turfHelpers from '@turf/helpers';

export const calculateDistance = (data, units, precision = 1): string => {
  const arrLength = data[data.length - 1].length;
  const distance = data[data.length - 1][arrLength - 1].distance;
  return turfHelpers.convertLength(distance, 'meters', units).toFixed(precision);
};

export const abbreviatedDistance = (units: string): string => {
  if (units === 'miles') {
    return 'mi';
  } else {
    return 'km';
  }
};

export default calculateDistance;