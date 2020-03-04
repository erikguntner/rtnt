import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jwt-simple';
import query from '../../server/db';
import { QueryArrayResult } from 'pg';

const tokenForUser = user => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.JWT_SECRET);
};

interface User {
  email: string;
  username: string;
  password: string;
}

const request = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(422)
          .json({ error: 'You must provide and username and password' });
      }

      const user: QueryArrayResult<User[]> = await query(
        'select * from users where username = $1',
        [username]
      );

      if (user.rows.length === 0) {
        return res.status(422).json({ error: 'Could not find user' });
      }

      const isMatch = await bcrypt.compare(password, user.rows[0].password);

      if (!isMatch) {
        return res.status(422).json({ message: 'password was not a match' });
      }

      const token = tokenForUser(user.rows[0]);

      return res.status(200).json({
        token,
        user: user.rows[0],
      });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: 'There was an error ' });
    }
  } else {
  }
};

export default request;
