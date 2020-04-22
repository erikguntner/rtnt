import { calculateDistance, abbreviatedDistance } from './calculateDistance';

export const formatGPXFile = (lines: number[][][], distance: number[], units: 'miles' | 'kilometers'): string => {
  const distanceInUnits = calculateDistance(lines, units, 2);
  const unitsAbbrev = abbreviatedDistance(units);
  const points = lines.reduce((accum, curr) => accum.concat(curr));

  let string = '';

  string += '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  string += '<gpx version="1.1" creator="https://rtnt.now.sh.com" xmlns="http://www.topografix.com/GPX/1/1">';
  string += '<metadata>';
  string += '<name>' + distanceInUnits + '-' + unitsAbbrev + '-route</name>';
  string += '<link href="https://rtnt.now.csh"><text>Run Tracker</text></link>'
  string += '</metadata>';
  string += '<rte>';
  for (let i = 0; i < points.length; i++) {
    string += '<rtept lat=' + points[i][1] + ' lon=' + points[i][0] + ' />'
  }
  string += '</rte>';
  string += '</gpx>';

  return string;
}


export const downloadGPXFile = (
  lines: number[][][],
  distance: number[],
  units: 'miles' | 'kilometers'
) => {
  const data = formatGPXFile(lines, distance, units);
  const blob = new Blob([data], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.download = `${distance[distance.length - 1]}-${units}.gpx`;
  link.href = url;
  document.body.appendChild(link); // Required for this to work in FireFox
  link.click();
};