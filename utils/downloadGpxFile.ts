import { calculateDistance, abbreviatedDistance } from './calculateDistance';

const createXmlString = (lines: number[][][]): string => {
  let result = '<gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd" version="1.1" creator="runtracker"><metadata/><trk><name></name><desc></desc>'
  result += lines.reduce((accum, curr) => {
    let segmentTag = '<trkseg>';
    segmentTag += curr.map((point) => `<trkpt lat="${point[1]}" lon="${point[0]}"><ele>${point[2]}</ele></trkpt>`).join('');
    segmentTag += '</trkseg>'

    return accum += segmentTag;
  }, '');
  result += '</trk></gpx>';
  return result;
}

export const downloadGpxFile = (
  lines: number[][][],
  distance: number[],
  units: 'miles' | 'kilometers'
) => {
  const xml = createXmlString(lines);
  const url = 'data:text/json;charset=utf-8,' + xml;
  const link = document.createElement('a');
  link.download = `${distance[distance.length - 1]}-${units}.gpx`;
  link.href = url;
  document.body.appendChild(link); // Required for this to work in FireFox
  link.click();
};
