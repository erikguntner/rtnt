import staticClient from '@mapbox/mapbox-sdk/services/static';
import * as turfHelpers from '@turf/helpers';
import bbox from '@turf/bbox';
import WebMercatorViewport from 'viewport-mercator-project';


const staticMapImage = handler => async (req, res) => {

  const staticMbxClient = staticClient({ accessToken: process.env.MAPBOX_TOKEN });
  const { lines } = req.body;
  const geoJson = turfHelpers.multiLineString(lines, {
    "stroke-width": 4,
    "stroke": "#0070f3",
  });

  const width = 600;
  const height = 600;

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
      padding: 80,
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
