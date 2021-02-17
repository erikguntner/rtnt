import { NextApiRequest, NextApiResponse } from 'next';
import firebase from '../../src/utils/firebase/client';
import API_URL from '../../src/utils/url';

const request = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { email } = req.body;

      const actionCodeSettings = {
        url: `${API_URL}/signin`,
        handleCodeInApp: false,
      }

      const result = await firebase.auth().sendPasswordResetEmail(email, actionCodeSettings);

      return res.status(200).json({ message: 'fun' });
    } catch (error) {
      return res
        .status(422)
        .json({ message: 'there is no account with this email' });
    }
  }
};

export default request;