import { NextApiRequest, NextApiResponse } from 'next';
import query from '../../../server/db';
import requireAuth from '../../../server/middleware/requireAuth';
import takeMapImage from '../../../server/middleware/takeMapImage';
import saveImageToS3 from '../../../server/middleware/saveImageToS3';
import pusher from '../../../server/services/pusher';

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

const saveRoute = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { id } = req.user;
      const { name, lines, points, totalDistance, sports, surfaces } = req.body;
      const { image } = req;

      pusher.trigger('save-route', 'status-update', {
        message: 'Saving route',
        progress: 15,
      });

      const results = await query(
        'insert into routes (name, image, user_id, lines, points, distance, sports, surfaces) values ($1, $2, $3, $4, $5, $6, $7, $8) returning *',
        [
          name,
          image,
          id,
          JSON.stringify(lines),
          JSON.stringify(points),
          JSON.stringify(totalDistance),
          JSON.stringify(sports),
          JSON.stringify(surfaces),
        ]
      );

      const route = results.rows[0];

      pusher.trigger('save-route', 'status-update', {
        message: 'Saving route',
        progress: 0,
      });

      return res.status(200).json({
        message: 'this is was a success',
        route,
      });
    } catch (err) {
      console.log(err);

      return res.status(400).json({
        message: 'error saving route',
      });
    }
  } else {
  }
};

export default requireAuth(takeMapImage(saveImageToS3(saveRoute)));