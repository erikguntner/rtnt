import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jwt-simple';
import query from '../../server/db';

const request = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { token } = req.cookies;

    if (token) {
      const { sub } = await jwt.decode(token, process.env.JWT_SECRET);
      const user = await query('select * from users where id = $1', [sub]);

      return res.status(200).json({
        token,
        user: user.rows[0],
      });
    } else {
      return res.status(401).json({
        message: 'could not retrieve token',
      });
    }
  } catch (err) {
    console.log(err);

    return res.status(400).json({
      message: 'error retrieving user',
    });
  }
};

export default request;
