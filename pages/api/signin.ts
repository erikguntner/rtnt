import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jwt-simple';
import query from '../../server/db';
import firebaseAdmin from '../../utils/firebase/admin';
import firebase from '../../utils/firebase/client';

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
    const { username, password } = req.body;
    let result;

    // make sure username and password were passed
    if (!username || !password) {
      return res
        .status(422)
        .json({ error: 'You must provide an email and password' });
    }

    try {
      //check for user in db
      result = await query('select * from users where username = $1', [
        username,
      ]);

    } catch (error) {
      throw new Error(error);
    }

    // get user info from firebase
    const foundUser = await firebaseAdmin
      .auth()
      .getUser(result.rows[0].id);

    if (!foundUser) {
      throw new Error('No user found.');
    }

    const { email } = foundUser;

    // sigin in order to generate id token
    const { user } = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);

    // generate id token
    const idToken = await user.getIdToken();

    // make sure we have a token
    if (!idToken) {
      throw new Error('Not able to create an id cookie.');
    }

    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    const token = await firebaseAdmin
      .auth()
      .createSessionCookie(idToken, {
        expiresIn,
      });

    // singout to manage the session ourselves.
    await firebase.auth().signOut();

    return res.status(200).json({
      token,
      user: {
        username,
        email
      },
    });
  } else {
  }
};

// const request = async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method === 'POST') {
//     const { username, password } = req.body;

//     if (!username || !password) {
//       return res
//         .status(422)
//         .json({ error: 'You must provide and username and password' });
//     }

//     try {

//       const user = await query('select * from users where username = $1', [
//         username,
//       ]);

//       if (user.rows.length === 0) {
//         return res
//           .status(422)
//           .json({ error: 'could not find a matching username and password' });
//       }

//       // disrupting builds check
//       // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
//       //@ts-ignore
//       const isMatch = await bcrypt.compare(password, user.rows[0].password);

//       if (!isMatch) {
//         return res
//           .status(422)
//           .json({ error: 'could not find a matching username and password' });
//       }

//       const token = tokenForUser(user.rows[0]);

//       return res.status(200).json({
//         token,
//         user: user.rows[0],
//       });
//     } catch (e) {
//       console.log(e);
//       return res.status(400).json({ error: 'could not find user' });
//     }
//   } else {
//   }
// };

export default request;
