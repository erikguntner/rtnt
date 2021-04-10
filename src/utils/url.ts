const API_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.VERCEL_URL
    : 'http://localhost:3000';


export default API_URL;
