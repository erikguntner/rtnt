import fetch from 'isomorphic-unfetch';
import API_URL from './url';

interface Points {
  type: string;
  coordinates: number[][];
}

interface Instructions {
  distance: number;
  heading: number;
  sign: number;
  interval: number[];
  text: string;
  time: number;
  street_name: string;
}

interface Details {
  street_name: (number | number | string)[];
}

interface ResponseData {
  distance: number;
  weight: number;
  time: number;
  transfers: number;
  points_encoded: boolean;
  bbox: number[];
  points: Points;
  instructions: Instructions[];
  legs: [];
  details: Details;
  ascend: number;
  descend: number;
  snapped_waypoints: Points;
}

export const fetchRoutes = async (
  points: number[][]
): Promise<ResponseData> => {
  try {
    const response = await fetch(`${API_URL}/api/path`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        points,
      }),
    });

    const { data } = await response.json();
    return data;
  } catch (e) {
    throw e;
  }
};
