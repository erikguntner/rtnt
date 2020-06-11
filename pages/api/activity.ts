import { NextApiRequest, NextApiResponse } from 'next';
import query from '../../server/db';
import requireAuth from '../../server/middleware/requireAuth';

interface UserI {
  id: number;
  email: string;
  username: string;
  password: string;
  units: string;
}

interface User {
  user: UserI;
}

type NextApiRequestWithUser = NextApiRequest & User;

const request = async (req: NextApiRequestWithUser, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const { id, units } = req.user;
    try {
      const results = await query(`select id, name, 
        start_date as "startDate", name, distance, elapsed_time as "elapsedTime", start_point as "startPoint", 
        end_point as "endPoint", map_image as image, city, state
        from activities where user_id = $1 
        order by start_date DESC`, [
        id,
      ]);

      const activities = results.rows;
      return res.status(200).json({ activities, units });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: 'there was an error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { id } = req.user;
      const {
        name,
        startTime,
        distance,
        time,
        start_point,
        end_point,
        image,
        lines,
        city,
        state
      } = req.body;

      const results = await query(
        'insert into activities (user_id, start_date, name, distance, elapsed_time, start_point, end_point, map_image, lines, city, state) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) returning *',
        [
          id,
          startTime,
          name,
          distance,
          time,
          JSON.stringify(start_point),
          JSON.stringify(end_point),
          image,
          JSON.stringify(lines),
          city,
          state
        ]
      );

      const activity = results.rows[0];

      return res.status(200).json({ activity });
    } catch (err) {
      console.log(err);
      return res
        .status(400)
        .json({ message: 'there was an error saving activities' });
    }
  }
};

export default requireAuth(request);