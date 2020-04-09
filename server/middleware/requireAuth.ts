import jwt from 'jwt-simple';
import query from '../db';

const requireAuth = handler => async (req, res) => {
  if (!('authorization' in req.headers) && !req.cookies.token) {
    console.log('auth header missing');
    return res.status(401).send('Authorization header missing');
  }

  try {
    const token = req.cookies.token ? req.cookies.token : JSON.parse(req.headers.authorization);

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const { sub } = jwt.decode(token, process.env.JWT_SECRET);

    const results = await query('select * from users where id = $1', [sub]);
    req.user = results.rows[0];
  } catch (e) {
    return res.status(400).json({ message: 'user is not authneticated' });
  }

  return handler(req, res);
};

export default requireAuth;
