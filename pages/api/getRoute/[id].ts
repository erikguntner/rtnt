import { NextApiRequest, NextApiResponse } from 'next';
import query from '../../../server/db';
import requireAuth from '../../../server/middleware/requireAuth';

const request = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const {
        query: { id },
      } = req

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

  } else {
  }
};

export default requireAuth(request);