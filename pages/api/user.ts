import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../server/models/user';
import connectDb from '../../server/middleware/connectDb';
import jwt from 'jwt-simple';

const request = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!('authorization' in req.headers)) {
    return res.status(401).send('Authorization header missing');
  }

  const { token } = await JSON.parse(req.headers.authorization);
  const { sub } = await jwt.decode(token, process.env.JWT_SECRET);
  const user = await User.findById(sub);

  return res.status(200).json({
    token,
    user,
  });
};

export default connectDb(request);
