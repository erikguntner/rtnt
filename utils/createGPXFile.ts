export const createGPXFile = (): string => {
  const array = [[46.57608333, 8.89241667], [46.57608333, 8.89241667], [46.57608333, 8.89241667], [46.57608333, 8.89241667]];
  const file = `
  <?xml version="1.0" encoding="UTF-8"?>
  <gpx version="1.0">
    <name>Example gpx</name>
    <wpt lat="46.57638889" lon="8.89263889">
      <ele>2372</ele>
      <name>LAGORETICO</name>
    </wpt>
    <trk>
      <name>Example gpx</name>
      <number>1</number>
      <trkseg>
        ${array.map((point, i) => `${i === 0 ? '' : '\t\t'}<trkpt lat="${point[0]}" lon="${point[1]}" ><ele>2376</ele><time>2007-10-14T10:09:57Z</time></trkpt>\n`).join('')}
      </trkseg>
    </trk>
  </gpx>
    `

  return file;
}