import { NextApiRequest, NextApiResponse } from 'next';
import query from '../../../server/db';
import requireAuth from '../../../server/middleware/requireAuth';
import AWS from 'aws-sdk';
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

interface UserI {
  id: number;
  email: string;
  username: string;
  password: string;
  units: string;
}

interface AdditionalTypes {
  user: UserI;
  image: string;
}

type NextApiRequestWithUser = NextApiRequest & AdditionalTypes;

const request = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  const {
    user,
    query: { id },
    body: { imageId }
  } = req

  if (req.method === 'GET') {
    try {

      const results = await query(
        'select * from routes where id = $1', [id]
      );

      const route = results.rows[0];
      return res.status(200).json({ route });
    } catch (err) {
      return res
        .status(422)
        .json({ message: 'there was an error fetching the route' });
    }

  } else if (req.method === 'DELETE') {
    try {
      // delete image from postgres
      const results = await query(
        'delete from routes where id = $1', [id]
      );
      const route = results.rows[0];

      // delete image from S3
      s3.deleteObject({
        Bucket: 'run-tracker-bucket',
        Key: `${user.id}/${imageId}`
      }, function (err, data) {
      })

      return res.status(200).json({ route });
    } catch (err) {
      return res
        .status(400)
        .json({ message: 'there was an error fetching the route' });
    }
  }
};

export default requireAuth(request);