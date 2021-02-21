import React from 'react';
import { NextPage } from 'next';

import Map from '../src/features/Map/Map';

const Home: NextPage<{}> = () => {
  return (
    <>
      <Map />
    </>
  );
};

export default Home;
