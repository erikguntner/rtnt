import React from 'react';
import Router from 'next/router';
import nextCookie from 'next-cookies';
import { withAuthSync } from '../utils/auth';

const Profile = () => {
  return <div>This is the private Profile page</div>;
};


export default withAuthSync(Profile);
