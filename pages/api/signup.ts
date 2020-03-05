import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jwt-simple';
import query from '../../server/db';

const tokenForUser = user => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.JWT_SECRET);
};

const request = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { email, username, password } = req.body;

      if (!email || !username || !password) {
        return res
          .status(400)
          .json({ error: 'You must provide and username and password' });
      }
      // const existingUser = await User.findOne({ username: username });
      const existingUser = await query(
        'select * from users where username = $1',
        [username]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'username already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await query(
        'insert into users (email, username, password) values ($1, $2, $3) returning *',
        [email, username, hashedPassword]
      );
      const token = tokenForUser(user.rows[0]);

      return res.status(200).json({
        token,
        user: user.rows[0],
      });
    } catch (e) {
      return res.status(400).json({ message: 'There was an error signing in' });
    }
  } else {
  }
};

export default request;
