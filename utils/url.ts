// const API_URL =
//   process.env.NODE_ENV === 'production'
//     ? 'https://rtnt.now.sh'
//     : 'http://localhost:3000';

console.log(process.env.NOW_URL);

const API_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NOW_URL
    : 'http://localhost:3000';

export default API_URL;
