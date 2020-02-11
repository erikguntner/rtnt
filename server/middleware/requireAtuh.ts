import jwt from 'jwt-simple';
import User from '../models/user';

const requireAuth = handler => async (req, res) => {
  try {
    const token = req.headers.authorization;

    const { sub } = jwt.decode(token, process.env.JWT_SECRET);

    const user = await User.findById(sub);
    console.log(user);
  } catch (e) {
    console.log('user is not authenticated', e);
  }

  return handler(req, res);
};

export default requireAuth;
