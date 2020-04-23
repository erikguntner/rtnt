import React from 'react';
import { NextPage } from 'next';
import ActivityForm from '../features/Activity/ActivityForm';

const MyRoutes: NextPage<{}> = () => {
  return (
    <div>
      <ActivityForm />
    </div>
  );
};

export default MyRoutes;
