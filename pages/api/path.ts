import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'isomorphic-unfetch';

const request = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const {
      startLat,
      startLong,
      newLat,
      newLong,
      transportationType,
    } = req.body;
    try {
      const response = await fetch(
        `https://graphhopper.com/api/1/route?point=${startLat},${startLong}&point=${newLat},${newLong}&vehicle=car&debug=true&elevation=true&details=street_name&key=${process.env.GRAPH_HOPPER_KEY}&type=json&points_encoded=false`
      );
      const data = await response.json();
      res.status(200).json({ data: data.paths[0] });
    } catch (e) {
      res.status(400).json({ message: 'There was an error ' });
    }
  }
};

export default request;
