import React from 'react';
import { NextPage } from 'next';
import fetch from 'isomorphic-unfetch';
import { withRedux } from '../utils/redux';

import Map from '../features/Map/Map';
import Notifications from '../features/Map/Notifications';

interface Props {
  title?: string;
  name?: string;
}

const Home: NextPage<Props> = ({ title, name }) => {
  return (
    <>
      <Map />
      <Notifications />
    </>
  );
};

export default withRedux(Home);
