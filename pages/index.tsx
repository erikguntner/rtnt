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

export default withRedux(Home);
