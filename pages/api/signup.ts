import { NextApiRequest, NextApiResponse } from 'next';
import query from '../../server/db';
import firebaseAdmin from '../../utils/firebase/admin';
import firebase from '../../utils/firebase/client';

const request = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { email, username, password } = req.body;

    // check if all necessary fields are provided
    if (!email || !username || !password) {
      console.log('not enough info');
      return res
        .status(400)
        .json({ message: 'You must provide and username and password' });
    }

    // query for username in database because we cant do so in firebase
    const usernameInDb = await query('select * from users where username = $1', [username]);

    // check if username exists
    if (usernameInDb.rows[0]) {
      console.log('username exists');
      return res
        .status(400)
        .json({ message: 'username in use' });
    }

    try {
      // create new user
      await firebaseAdmin.auth().createUser({
        email,
        password,
        displayName: username,
      })
    } catch (error) {
      // throw error if fields are not valid
      return res
        .status(400)
        .json({ message: error.message });
    }

    // signin to get uid
    const { user } = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);

    if (!user) {
      throw new Error('No user found.');
    }

    const { uid } = user;

    try {
      // save user to db
      const newUser = await query('insert into users (id, username) values ($1, $2) returning *', [uid, username]);
    } catch (error) {
      return res
        .status(400)
        .json({ message: 'error saving user' });
    }

    const idToken = await user.getIdToken();

    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    const token = await firebaseAdmin
      .auth()
      .createSessionCookie(idToken, {
        expiresIn,
      });

    // We manage the session ourselves.
    await firebase.auth().signOut();

    return res.status(200).json({
      token,
      user: {
        username,
        email,
      },
    });
  } else { }
}

export default request;
