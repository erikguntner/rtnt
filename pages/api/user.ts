import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../server/models/user';
import connectDb from '../../server/middleware/connectDb';
import jwt from 'jwt-simple';

const request = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!('authorization' in req.headers)) {
    return res.status(401).send('Authorization header missing');
  }

  try {
    const { token } = await JSON.parse(req.headers.authorization);

    if (token) {
      const { sub } = await jwt.decode(token, process.env.JWT_SECRET);
      const user = await User.findById(sub);

      return res.status(200).json({
        token,
        user,
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

export default connectDb(request);
