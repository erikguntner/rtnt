import { NextApiRequest, NextApiResponse } from 'next';
import query from '../../../server/db';
import requireAuth from '../../../server/middleware/requireAuth';

const request = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { id },
  } = req

  if (req.method === 'GET') {
    try {

      const results = await query(
        'select * from routes where id = $1', [id]
      );

      const route = results.rows[0];

      return res.status(200).json({ route });
    } catch (err) {
      console.log(err);
      return res
        .status(422)
        .json({ message: 'there was an error fetching the route' });
    }

  } else if (req.method === 'DELETE') {
    try {
      const results = await query(
        'delete from routes where id = $1', [id]
      );

      const route = results.rows[0];
      console.log(route);

      return res.status(200).json({ route });
    } catch (err) {
      console.log(err);
      return res
        .status(400)
        .json({ message: 'there was an error fetching the route' });
    }
  }
};

export default requireAuth(request);