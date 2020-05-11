import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jwt-simple';
import query from '../../server/db';
import firebaseAdmin from '../../utils/firebase/admin';
import requireAuth from '../../server/middleware/requireAuth';

import AWS from 'aws-sdk';
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

interface UserI {
  id: string;
  email: string;
  username: string;
  units: string;
}

interface AdditionalTypes {
  user: UserI;
  image: string;
}

type NextApiRequestWithUser = NextApiRequest & AdditionalTypes;

const request = async (req: NextApiRequestWithUser, res: NextApiResponse) => {

  const { id, units } = req.user;

  if (req.method === 'GET') {

    try {
      const user = await query('select * from users where id = $1', [
        id,
      ]);

      const { email, displayName } = await firebaseAdmin.auth().getUser(id);

      return res.status(200).json({
        token: 'token',
        user: {
          username: displayName,
          email,
          units
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        message: 'could not retrieve token',
      });
    }

  } else if (req.method === 'DELETE') {
    console.log(id);
    try {
      //retrieve all image urls
      const imageUrls = await query('select image from routes where user_id = $1', [id]);

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      //@ts-ignore
      const keys = imageUrls.rows.map(({ image }) => {
        const strings = image.split('/');
        return {
          Key: `${strings[3]}/${strings[4]}`
        }
      });

      // delete images from s3
      s3.deleteObjects({
        Bucket: 'run-tracker-bucket',
        Delete: {
          Objects: keys
        }
      }, function (err, data) {
      })

      // delete all rows from tables
      const deletedRoutes = await query('delete from routes where user_id = $1', [id]);
      const deletedActivities = await query('delete from activities where user_id = $1', [id]);
      const deletedUser = await query('delete from users where id = $1', [id]);

      // delete user from firebase
      await firebaseAdmin.auth().deleteUser(id);

      return res.status(200).json({
        token: '',
        user: deletedUser.rows[0],
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        message: 'error deleting user',
      });
    }
  }
};

export default requireAuth(request);
