import { NextApiRequest, NextApiResponse } from 'next';
import query from '../../../server/db';
import requireAuth from '../../../server/middleware/requireAuth';
import saveImageToS3 from '../../../server/middleware/saveImageToS3';
import pusher from '../../../server/services/pusher';
import staticMapImage from '../../../server/middleware/staticMapImages';

interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  units: string;
}

interface AdditionalTypes {
  user: User;
  image: string;
}

export interface Route {
  id: number;
  name: string;
  image: string;
  user_id: string;
  lines: number[][][];
  start_point: number[];
  end_point: number[];
  points: number[][];
  distance: number;
  created_at: string;
  sports: string[];
  surfaces: string[];
  city: string;
  state: string;
}

type NextApiRequestWithUser = NextApiRequest & AdditionalTypes;

const saveRoute = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { id } = req.user;
      const { name, startPoint, endPoint, lines, points, distance, sports, surfaces, city, state } = req.body;
      const { image } = req;

      pusher.trigger('save-route', 'status-update', {
        message: 'Saving route',
        progress: 15,
      });

      const results = await query(
        'insert into routes (name, image, user_id, start_point, end_point, lines, points, distance, sports, surfaces, city, state) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) returning *',
        [
          name,
          image,
          id,
          JSON.stringify(startPoint),
          JSON.stringify(endPoint),
          JSON.stringify(lines),
          JSON.stringify(points),
          distance,
          JSON.stringify(sports),
          JSON.stringify(surfaces),
          city,
          state,
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
      return res.status(400).json({
        message: 'error saving route',
      });
    }
  } else {
  }
};

// export default requireAuth(takeMapImage(saveImageToS3(saveRoute)));
export default requireAuth(staticMapImage(saveImageToS3(saveRoute)));
