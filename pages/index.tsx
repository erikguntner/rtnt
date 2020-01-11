import React from 'react';
import { NextPage } from 'next';
import fetch from 'isomorphic-unfetch';
import Map from '../features/Map/Map';
import { withRedux } from '../utils/redux';

interface Props {
  title?: string;
  name?: string;
}

const Home: NextPage<Props> = ({ title, name }) => {
  return (
    <>
      <Map />
    </>
  );
};

Home.getInitialProps = async () => {
  const data = { username: 'example' };

  const response = await fetch('http://localhost:3000/api/posts');
  const title = await response.json();

  const postResponse = await fetch('http://localhost:3000/api/posts', {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const name = await postResponse.json();

  return { title, name };
};

export default withRedux(Home);
