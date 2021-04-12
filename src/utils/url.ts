const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://rtnt.vercel.app'
    : 'http://localhost:3000';


export default API_URL;
