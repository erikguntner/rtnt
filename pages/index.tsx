import React from 'react';
import { NextPage } from 'next';

import Map from '../features/Map/Map';
import Notifications from '../features/Map/Notifications';

const Home: NextPage<{}> = () => {
  return (
    <>
      <Map />
      <Notifications />
    </>
  );
};

export default Home;
