import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Router from 'next/router';
import nextCookie from 'next-cookies';
import fetch from 'isomorphic-unfetch';
import { RootState } from '../app/rootReducer';
import { addRoutes } from '../features/RouteList/routeListSlice';

const MyRoutes = () => {
  const { routes } = useSelector((state: RootState) => ({
    routes: state.routeList.routes,
  }));

  return (
    <div>
      <div>
        {routes.length && routes.map(route => <article>{route.name}</article>)}
      </div>
    </div>
  );
};

MyRoutes.getInitialProps = async ctx => {
  const { token } = nextCookie(ctx);
  const { reduxStore } = ctx;

  const redirectOnError = () =>
    typeof window !== 'undefined'
      ? Router.push('/')
      : ctx.res.writeHead(302, { Location: '/' }).end();

  if (token) {
    try {
      const url =
        process.env.NODE_ENV === 'production'
          ? 'https://rtnt.now.sh'
          : 'http://localhost:3000';

      const response = await fetch(`${url}/api/routes`, {
        credentials: 'include',
        headers: {
          Authorization: JSON.stringify(token),
        },
      });

      if (response.ok) {
        const { routes } = await response.json();
        reduxStore.dispatch(addRoutes(routes));
        return {};
      } else {
        console.log('response returned error');
        // https://github.com/developit/unfetch#caveats
        return await redirectOnError();
      }
    } catch (error) {
      console.log(error);
      // Implementation or Network error
      return redirectOnError();
    }
  } else {
    console.log('there is no token');
    return redirectOnError();
  }
};

export default MyRoutes;
