import { NextApiRequest, NextApiResponse } from 'next';
import query from '../../server/db';

import firebaseAdmin from '../../utils/firebase/admin';
import firebase from '../../utils/firebase/client';
import API_URL from '../../utils/url';

const request = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { email } = req.body;

      const actionCodeSettings = {
        url: `${API_URL}/signin`,
        handleCodeInApp: false,
      }

      const result = await firebase.auth().sendPasswordResetEmail(email, actionCodeSettings);
      console.log(result);

      return res.status(200).json({ message: 'fun' });
    } catch (error) {
      return res
        .status(422)
        .json({ message: 'there is no account with this email' });
    }
  }
};

export default request;