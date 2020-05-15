import React from 'react';
import { NextPage } from 'next';
import ActivityLog from '../../src/features/ActivityLog/ActivityLog';

const MyRoutes: NextPage<{}> = () => {
  return <ActivityLog />;
};

export default MyRoutes;
