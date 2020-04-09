import React from 'react';
import { Provider } from 'react-redux';
import Head from 'next/head';
import Router from 'next/router';
import nextCookie from 'next-cookies';
import fetch from 'isomorphic-unfetch';
import App, { AppContext } from 'next/app';
import styled, { ThemeProvider } from 'styled-components';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import debounce from 'lodash/debounce';
import LogRocket from 'logrocket';

import Nav from '../features/Nav/Nav';
import 'mapbox-gl/src/css/mapbox-gl.css';
import { CounterProvider } from '../features/Utilities/Counter';
import withReduxStore from '../utils/withReduxStore';
import { authenticateUser } from '../features/Auth/authSlice';
import { theme, GlobalStyle } from '../utils/theme';
import { initializeStore } from '../app/store';
import API_URL from '../utils/url';

config.autoAddCss = false;

let NProgress;
let start;

if (typeof window !== 'undefined') {
  NProgress = require('nprogress');
  start = debounce(NProgress.start, 200);
}

Router.events.on('routeChangeStart', start);
Router.events.on('routeChangeComplete', () => {
  start.cancel();
  NProgress.done();
});
Router.events.on('routeChangeError', () => {
  start.cancel();
  NProgress.done();
});

if (process.env.NODE_ENV === 'development') {
  LogRocket.init('hhtrbz/run-tracker');
} else {
  LogRocket.init('hhtrbz/run-tracker-prod');
}

const Container = styled.div`
  background-color: ${(props) => props.theme.colors.gray[100]};
`;

const Layout = ({ children }) => {
  return (
    <>
      <Container>
        <Head>
          <title>Run Tracker</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Nav />
        <>{children}</>
      </Container>
    </>
  );
};

class MyApp extends App {
  // static async getInitialProps({ Component, ctx }: AppContext) {
  //   const { reduxStore } = ctx;

  //   const { token } = nextCookie(ctx);

  //   // if token exists, use token to log user in serverside when app loads
  //   if (token) {
  //     try {
  //       const response = await fetch(`${API_URL}/api/user`, {
  //         credentials: 'include',
  //         headers: {
  //           Authorization: JSON.stringify({ token }),
  //         },
  //       });

  //       const { user } = await response.json();
  //       reduxStore.dispatch(authenticateUser({ authenticated: token, user }));
  //     } catch (error) {
  //       // Implementation or Network error
  //       console.log(error);
  //       return {
  //         pageProps: Component.getInitialProps
  //           ? await Component.getInitialProps(ctx)
  //           : {},
  //       };
  //     }
  //   }

  //   return {
  //     pageProps: Component.getInitialProps
  //       ? await Component.getInitialProps(ctx)
  //       : {},
  //   };
  // }

  render() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    //@ts-ignore
    // const { Component, pageProps, reduxStore } = this.props;
    const { Component, pageProps } = this.props;
    const initStore = initializeStore();

    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Provider store={initStore}>
          <CounterProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </CounterProvider>
        </Provider>
      </ThemeProvider>
    );
  }
}

// export default withReduxStore(MyApp);
export default MyApp;
