import React from 'react';
import { NextPage } from 'next';
import Router from 'next/router';
import nextCookie from 'next-cookies';
import fetch from 'isomorphic-unfetch';
import { addRoutes } from '../features/RouteList/routeListSlice';
import RouteList from '../features/RouteList/RouteList';
import API_URL from '../utils/url';

const MyRoutes: NextPage<{}> = () => {
  return (
    <>
      <RouteList />
    </>
  );
};

// MyRoutes.getInitialProps = async (ctx) => {
//   const { token } = nextCookie(ctx);
//   const { reduxStore } = ctx;

//   const redirectOnError = () =>
//     typeof window !== 'undefined'
//       ? Router.push('/')
//       : ctx.res.writeHead(302, { Location: '/' }).end();

//   if (token) {
//     try {
//       const response = await fetch(`${API_URL}/api/routes`, {
//         credentials: 'include',
//         headers: {
//           Authorization: JSON.stringify(token),
//         },
//       });

//       if (response.ok) {
//         const { routes } = await response.json();
//         reduxStore.dispatch(addRoutes(routes));
//         return {};
//       } else {
//         console.log('response returned error');
//         // https://github.com/developit/unfetch#caveats
//         return await redirectOnError();
//       }
//     } catch (error) {
//       console.log(error);
//       // Implementation or Network error
//       return redirectOnError();
//     }
//   } else {
//     console.log('there is no token');
//     return redirectOnError();
//   }
// };

export default MyRoutes;
