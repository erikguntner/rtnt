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

interface AdditionalTypes {
  user: UserI;
  image: string;
}

type NextApiRequestWithUser = NextApiRequest & AdditionalTypes;

const request = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  if (req.method === 'PUT') {
    const { id } = req.user;
    const { units } = req.body;
    try {
      const result = await query(
        'UPDATE users SET units=($1) WHERE id=($2) RETURNING *',
        [units, id]
      );

      const data = result.rows[0];

      return res.status(200).json({ data });
    } catch (err) {
      console.log(err);
      return res.status(422).json({ error: 'error updating users units' });
    }
  } else {
  }
};

export default requireAuth(request);
