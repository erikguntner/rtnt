import React from 'react';
import { NextPage } from 'next';
import Router from 'next/router';
import nextCookie from 'next-cookies';
import { withAuthSync } from '../utils/auth';

import Map from '../features/Map/Map';
import Notifications from '../features/Map/Notifications';
import { authenticateUser } from '../features/Auth/authSlice';

interface Props {}

const Home: NextPage<Props> = () => {
  return (
    <>
      <Map />
      <Notifications />
    </>
  );
};

// Home.getInitialProps = async ctx => {
//   const {
//     reduxStore: { dispatch },
//   } = ctx;
//   const url =
//     process.env.NODE_ENV === 'production'
//       ? 'https://run-tracker-next-typescript.now.sh'
//       : 'http://localhost:3000';

//   const { token } = nextCookie(ctx);

//   if (token) {
//     try {
//       const response = await fetch(`${url}/api/user`, {
//         credentials: 'include',
//         headers: {
//           Authorization: JSON.stringify({ token }),
//         },
//       });

//       const { user } = await response.json();
//       return dispatch(authenticateUser({ authenticated: token, user }));
//     } catch (error) {
//       // Implementation or Network error
//       return dispatch(
//         authenticateUser({
//           authenticated: '',
//           user: {
//             username: '',
//             email: '',
//           },
//         })
//       );
//       // return redirectOnError();
//     }
//   } else {
//     return dispatch(
//       authenticateUser({
//         authenticated: '',
//         user: {
//           username: '',
//           email: '',
//         },
//       })
//     );

//     // return redirectOnError();
//   }
// };

export default Home;
