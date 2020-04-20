import { NextApiRequest, NextApiResponse } from 'next';
import query from '../../server/db';
import firebaseAdmin from '../../utils/firebase/admin';
import firebase from '../../utils/firebase/client';

const request = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      console.log('not enough info');
      return res
        .status(400)
        .json({ error: 'You must provide and username and password' });
    }

    try {
      await firebaseAdmin.auth().createUser({
        email,
        password,
        displayName: username,
      })
    } catch (error) {
      console.log(error);
    }

    const { user } = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);

    if (!user) {
      throw new Error('No user found.');
    }

    const { uid } = user;

    try {
      const newUser = await query('insert into users (id, username) values ($1, $2) returning *', [uid, username]);
      console.log(newUser.rows[0]);
    } catch (error) {
      console.log('error saving to db');
    }

    const idToken = await user.getIdToken();

    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    const token = await firebaseAdmin
      .auth()
      .createSessionCookie(idToken, {
        expiresIn,
      });

    // const options = { maxAge: expiresIn, httpOnly: true, secure: true };

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
