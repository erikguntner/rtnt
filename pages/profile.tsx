import React from 'react';
import Router from 'next/router';
import nextCookie from 'next-cookies';
import { withAuthSync } from '../utils/auth';

const Profile = () => {
  return <div>This is the private Profile page</div>;
};

Profile.getInitialProps = async ctx => {
  // const { token } = nextCookie(ctx);
  // const redirectOnError = () =>
  //   typeof window !== 'undefined'
  //     ? Router.push('/')
  //     : ctx.res.writeHead(302, { Location: '/' }).end();
  // if (token) {
  //   try {
  //     const response = await fetch(apiUrl, {
  //       credentials: 'include',
  //       headers: {
  //         Authorization: JSON.stringify({ token }),
  //       },
  //     });
  //     if (response.ok) {
  //       const js = await response.json();
  //       console.log('js', js);
  //       return js;
  //     } else {
  //       // https://github.com/developit/unfetch#caveats
  //       return await redirectOnError();
  //     }
  //   } catch (error) {
  //     // Implementation or Network error
  //     return redirectOnError();
  //   }
  // } else {
  //   console.log('there is no token');
  //   redirectOnError();
  // }
};

export default withAuthSync(Profile);
