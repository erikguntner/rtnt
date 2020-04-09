import React from 'react';
import { NextPage } from 'next';
import RouteList from '../features/RouteList/RouteList';

const MyRoutes: NextPage<{}> = () => {
  return (
    <>
      <RouteList />
    </>
  );
};

export default MyRoutes;
