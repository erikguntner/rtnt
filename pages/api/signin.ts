import { NextApiRequest, NextApiResponse } from 'next';
import query from '../../server/db';
import firebaseAdmin from '../../src/utils/firebase/admin';
import firebase from '../../src/utils/firebase/client';
import cookies from '../../server/middleware/cookies';

interface User {
  email: string;
  username: string;
  password: string;
}

const request = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { username, password, rememberMe } = req.body;
    let result;
    let signedInUser;

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
      return res.status(400).json({ message: 'username or password is incorrect' });
    }

    if (!result.rows[0]) {
      return res.status(400).json({ message: 'username or password is incorrect' });
    }

    // get user info from firebase
    const foundUser = await firebaseAdmin
      .auth()
      .getUser(result.rows[0].id);

    if (!foundUser) {
      return res.status(400).json({ message: 'username or password is incorrect' });
    }

    const { email } = foundUser;

    // sigin in order to generate id token
    try {
      await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

      const { user } = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      signedInUser = user;

    } catch (error) {
      return res.status(400).json({ message: 'username or password is incorrect' });
    }

    // generate id token
    const idToken = await signedInUser.getIdToken();
    console.log(idToken);

    // make sure we have a token
    if (!idToken) {
      throw new Error('Not able to create an id cookie.');
    }

    // Set session expiration to 30 days or 1.
    const expiresIn = rememberMe ? 60 * 60 * 24 * 5 * 1000 : 60 * 60 * 24 * 1 * 1000;

    const token = await firebaseAdmin
      .auth()
      .createSessionCookie(idToken, {
        expiresIn,
      });

    // singout to manage the session ourselves.
    await firebase.auth().signOut();

    res.cookie('test', 'cookie1', { httpOnly: true, maxAge: 60 * 5 });

    return res.status(200).json({
      token,
      user: {
        username,
        email,
        units: result.rows[0].units
      },
    });
  } else {
  }
};

export default cookies(request);
