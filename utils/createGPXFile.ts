import { calculateDistance, abbreviatedDistance } from './calculateDistance';

export const formatGPXFile = (lines: number[][][], distance: number[], units: 'miles' | 'kilometers'): string => {
  const distanceInUnits = calculateDistance(lines, units, 2);
  const unitsAbbrev = abbreviatedDistance(units);
  const points = lines.reduce((accum, curr) => accum.concat(curr));
  const xml = `
  <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <gpx version="1.1" creator="https://rtnt.now.sh" xmlns="http://www.topografix.com/GPX/1/1">
    <metadata>
      <name>${distanceInUnits} ${unitsAbbrev} route</name>
      <link href="https://rtnt.now.sh">
        <text>On The Go Map</text>
      </link>
      <time>${new Date()}</time>
      <copyright author="Run Tracker">
        <year>2020</year>
      </copyright>
    </metadata>
    <rte>
      <name>${distanceInUnits} ${unitsAbbrev} route</name>
      ${points.map((point) => `<rtept lat="${point[1]}" lon="${point[0]}"/>`).join('\n')}
    </rte>
  </gpx>`;

  return xml;
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