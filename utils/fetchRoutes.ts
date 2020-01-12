import fetch from 'isomorphic-unfetch';

export const fetchRoutes = async (points: number[][]) => {
  try {
    const response = await fetch('http://localhost:3000/api/path', {
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
  } catch (err) {
    console.log(err);
    throw err;
  }
};
