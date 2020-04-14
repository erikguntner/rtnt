import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'isomorphic-unfetch';

const request = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    console.log('starting request');
    const { points } = req.body;

    const pointString = points
      .map(point => `point=${point[1]},${point[0]}&`)
      .join('');

    try {
      const response = await fetch(
        `https://graphhopper.com/api/1/route?${pointString}vehicle=foot&debug=true&elevation=true&legs=true&details=street_name&key=${process.env.GRAPH_HOPPER_KEY}&type=json&points_encoded=false`
      );
      const data = await response.json();
      console.log('ending request');
      res.status(200).json({ data: data.paths[0] });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: 'There was an error ' });
    }
  } else {
  }
};

export default request;
