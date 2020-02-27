import { NextApiRequest, NextApiResponse } from 'next';
import query from '../../server/db';
import requireAuth from '../../server/middleware/requireAuth';

interface User {
  id: number;
  email: string;
  username: string;
  password: string;
}

const request = async (
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) => {
  const authedUser = user;
  if (req.method === 'POST') {
    try {
      const { id } = authedUser;
      const { name, lines, elevationData, points, totalDistance } = req.body;

      const results = await query(
        'insert into routes (name, user_id, lines, elevation_data, points, total_distance) values ($1, $2, $3, $4, $5, $6) returning *',
        [
          name,
          id,
          JSON.stringify(lines),
          JSON.stringify(elevationData),
          JSON.stringify(points),
          JSON.stringify(totalDistance),
        ]
      );

      const route = results.rows[0];

      return res.status(200).json({
        message: 'this is was a success',
        route,
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        message: 'error saving route',
      });
    }
  } else if (req.method === 'GET') {
    try {
      const { id } = authedUser;
      const results = await query('select * from routes where user_id = $1', [
        id,
      ]);

      const routes = results.rows;

      return res.status(200).json({ routes });
    } catch (err) {
      return res
        .status(422)
        .json({ message: 'there was an error returning all routes' });
    }
  }
};

export default requireAuth(request);
