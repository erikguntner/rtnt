import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jwt-simple';
import query from '../../server/db';
import firebaseAdmin from '../../utils/firebase/admin';
import firebase from '../../utils/firebase/client';

// const tokenForUser = user => {
//   const timestamp = new Date().getTime();
//   return jwt.encode({ sub: user.id, iat: timestamp }, process.env.JWT_SECRET);
// };

// const request = async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method === 'POST') {
//     try {
//       const { email, username, password } = req.body;

//       if (!email || !username || !password) {
//         console.log('not enough info');
//         return res
//           .status(400)
//           .json({ error: 'You must provide and username and password' });
//       }
//       // const existingUser = await User.findOne({ username: username });
//       const existingUser = await query(
//         'select * from users where username = $1 or email = $2',
//         [username, email]
//       );

//       if (existingUser.rows.length > 0) {
//         console.log('existing user');
//         return res.status(400).json({ error: 'username or email already in use' });
//       }

//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);

//       const user = await query(
//         'insert into users (email, username, password) values ($1, $2, $3) returning *',
//         [email, username, hashedPassword]
//       );

//       console.log('created user');

//       const token = tokenForUser(user.rows[0]);

//       return res.status(200).json({
//         token,
//         user: user.rows[0],
//       });
//     } catch (e) {
//       console.log('error', e);
//       console.log(e.message);
//       return res.status(400).json({ message: 'There was an error signing in' });
//     }
//   } else {
//   }
// };


const request = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { email, username, password } = req.body;
    let newUser = null;

    if (!email || !username || !password) {
      console.log('not enough info');
      return res
        .status(400)
        .json({ error: 'You must provide and username and password' });
    }

    try {
      newUser = await firebaseAdmin.auth().createUser({
        email,
        password,
        displayName: username,
      })
    } catch (error) {
      console.log(error);
    }

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

    const { user } = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);

    if (!user) {
      throw new Error('No user found.');
    }

    console.log(newUser);

    const token = await user.getIdToken();

    // Set session expiration to 5 days.
    // const expiresIn = 60 * 60 * 24 * 5 * 1000;

    // const sessionCookie = await firebaseAdmin
    //   .auth()
    //   .createSessionCookie(idToken, {
    //     expiresIn,
    //   });

    // console.log('user', user);
    // console.log('token', sessionCookie);

    // const options = { maxAge: expiresIn, httpOnly: true, secure: true };

    // We manage the session ourselves.
    await firebase.auth().signOut();


    // try {
    //   // const decodedClaims = await firebaseAdmin.auth().verifySessionCookie(sessionCookie, true)
    //   // console.log('decodedClaims', decodedClaims);

    // } catch (error) {
    //   console.log('error decoding the cookie');
    //   console.log(error);
    // }

    return res.status(200).json({
      token,
      user,
    });
  } else { }
}

export default request;
