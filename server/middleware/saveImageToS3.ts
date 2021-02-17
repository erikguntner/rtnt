import AWS from 'aws-sdk';
import uuid from 'uuid/v1';
import pusher from '../services/pusher';
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const saveImageToS3 = handler => async (req, res) => {
  try {
    const { id } = req.user;
    const { buffer } = req;

    const key = `${id}/${uuid()}.png`;

    const params = {
      Bucket: 'run-tracker-bucket',
      Key: key,
      Body: buffer,
      ContentEncoding: 'base64',
      ContentType: 'image/png',
    };

    pusher.trigger('save-route', 'status-update', {
      message: 'Saving image',
      progress: 30,
    });

    const response = await s3.upload(params).promise();
    req.image = response.Location;

    // req.image = image;
  } catch (e) {
    return res.status(422).json({ message: 'user error saving image to s3' });
  }

  return handler(req, res);
};

export default saveImageToS3;
