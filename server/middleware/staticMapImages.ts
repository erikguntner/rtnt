import staticClient from '@mapbox/mapbox-sdk/services/static';
import { multiLineString, convertLength } from '@turf/helpers';
import bbox from '@turf/bbox';
import WebMercatorViewport from 'viewport-mercator-project';
import simplify from 'simplify-geojson';


const staticMapImage = handler => async (req, res) => {

  const staticMbxClient = staticClient({ accessToken: process.env.MAPBOX_TOKEN });
  const { lines, distance } = req.body;
  const multiLine = multiLineString(lines, {
    "stroke-width": 4,
    "stroke": "#0070f3",
  });
  const distanceInMiles = convertLength(distance, 'meters', 'miles');
  const tolerance = distanceInMiles < 10 ? .0001 : .001;
  const geoJson = simplify(multiLine, tolerance);
  const width = 640;
  const height = 360;

  const bBox = bbox(geoJson);
  const { longitude, latitude, zoom } = new WebMercatorViewport({
    width,
    height,
  }).fitBounds(
    [
      [bBox[0], bBox[1]],
      [bBox[2], bBox[3]],
    ],
    {
      padding: 40,
    }
  );

  try {

    const response = await staticMbxClient.getStaticImage({
      ownerId: 'mapbox',
      styleId: 'streets-v11',
      width,
      height,
      position: {
        coordinates: [longitude, latitude],
        zoom
      },
      overlays: [
        {
          geoJson
        },
      ]
    })
      .send()

    const body = response.body;
    const buffer = Buffer.from(body, "binary");
    req.buffer = buffer;

  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: 'unsuccessful map' });
  }

  return handler(req, res);
};

export default staticMapImage;
