import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../server/models/user';
import connectDb from '../../server/middleware/connectDb';
import bcrypt from 'bcrypt';
import jwt from 'jwt-simple';

const tokenForUser = user => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.JWT_SECRET);
};

const request = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(422)
          .json({ error: 'You must provide and username and password' });
      }

      const user = await User.findOne({ username: username });

      if (!user) {
        console.log('no user');
        return res.status(422).json({ error: 'Could not find user' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(422).json({ message: 'password was not a match' });
      }

      const token = tokenForUser(user);

      return res.status(200).json({
        token,
      });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: 'There was an error ' });
    }
  } else {
  }
};

export default connectDb(request);
