import React from 'react';
import { NextPage, GetServerSideProps } from 'next';
import nextCookie from 'next-cookies';

import Route from '../../src/features/Route/Route';
import API_URL from '../../src/utils/url';
import { ParsedUrlQuery } from 'querystring';

interface Viewport {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
}

interface Route {
  id: number;
  user_id: string;
  created_at: string;
  name: string;
  image: string;
  start_point: number[];
  end_point: number[];
  points: number[][];
  lines: number[][][];
  distance: number;
  sports: string[];
  surface: string[];
}

const RoutePage: NextPage<{ data: Route }> = ({ data }) => {
  return <Route {...{ data }} />;
};

export const getServerSideProps: GetServerSideProps<
  {
    [key: string]: string;
  },
  ParsedUrlQuery
> = async (context) => {
  const { token } = nextCookie(context);
  const { id } = context.query;

  const response = await fetch(`${API_URL}/api/route/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      authorization: JSON.stringify(token),
    },
  });

  const data = await response.json();

  return { props: { data: data.route } };
};

export default RoutePage;
