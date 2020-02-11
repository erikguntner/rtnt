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
      const existingUser = await User.findOne({ username: username });

      if (existingUser) {
        return res.status(422).json({ error: 'Username is in use' });
      }

      const user = new User({
        username,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;

      await user.save();

      const token = tokenForUser(user);
      return res.status(200).json({
        token,
        user: user,
      });
    } catch (e) {
      return res.status(400).json({ message: 'There was an error ' });
    }
  } else {
  }
};

export default connectDb(request);
