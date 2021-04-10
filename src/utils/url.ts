console.log('node environment', process.env.NODE_ENV);
console.log('vercel environment', process.env.VERCEL_ENV);


const API_URL =
  process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'preview'
    ? process.env.VERCEL_URL
    : 'http://localhost:3000';


export default API_URL;
