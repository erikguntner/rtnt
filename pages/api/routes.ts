import { NextApiRequest, NextApiResponse } from 'next';
import query from '../../server/db';
import requireAuth from '../../server/middleware/requireAuth';

interface UserI {
  id: number;
  email: string;
  username: string;
  password: string;
  units: string;
}

interface User {
  user: UserI;
}

type NextApiRequestWithUser = NextApiRequest & User;

const request = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const { id, units } = req.user;
      const results = await query('select * from routes where user_id = $1', [
        id,
      ]);

      const routes = results.rows;

      return res.status(200).json({ routes, units });
    } catch (err) {
      console.log(err);
      return res
        .status(422)
        .json({ message: 'there was an error returning all routes' });
    }
  } else {
  }
};

export default requireAuth(request);
