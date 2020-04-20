import { NextApiRequest, NextApiResponse } from 'next';
import query from '../../server/db';
import firebaseAdmin from '../../utils/firebase/admin';
import firebase from '../../utils/firebase/client';

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

export default request;
