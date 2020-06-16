import React from 'react';
import { server, rest } from '../../../utils/test/server';
import {
  render,
  fireEvent,
  waitFor,
  getByPlaceholderText,
} from '../../../utils/test/test-utils';
import userEvent from '@testing-library/user-event';
import { within } from '@testing-library/dom';
import { routes } from '../../../utils/test/data';
import RouteList from '../RouteList';

const renderRouteList = (props: Partial<{}> = {}, preloadedState = {}) => {
  const defaultProps = {};
  return render(<RouteList {...defaultProps} {...props} />, preloadedState);
};

describe('<RouteList />', () => {
  test('renders fetched routes in list', async () => {
    const { findByText } = renderRouteList();

    expect(await findByText(/back and forth/i)).toBeInTheDocument();
    expect(await findByText(/new route/i)).toBeInTheDocument();
    expect(await findByText(/new route/i)).toBeInTheDocument();
    expect(await findByText(/2 routes/i)).toBeInTheDocument();
  });

  test('renders text if no routes are returned', async () => {
    server.use(
      rest.get('/api/routes', async (req, res, ctx) => {
        return res(ctx.json({ routes: [], units: 'miles' }));
      })
    );

    const { findByText, queryByText } = renderRouteList();

    expect(await findByText(/No Routes/i)).toBeInTheDocument();
    expect(await findByText(/0 routes/i)).toBeInTheDocument();
    expect(await queryByText(/back and forth/i)).not.toBeInTheDocument();
    expect(await queryByText(/new route/i)).not.toBeInTheDocument();
  });

  test('filters routes by keyword', async () => {
    const {
      debug,
      findByText,
      queryByText,
      getByPlaceholderText,
    } = renderRouteList();

    expect(await findByText(/back and forth/i)).toBeInTheDocument();

    const keywordInput = getByPlaceholderText('Filter by keyword');

    await userEvent.type(keywordInput, 'back');

    // check if it renders correct routes
    expect(await findByText(/1 routes/i)).toBeInTheDocument();
    expect(await findByText(/back and forth/i)).toBeInTheDocument();
    expect(await queryByText(/new route/i)).not.toBeInTheDocument();
    // check if it shows proper filter badge
    expect(await queryByText(/Keyword: back/i)).toBeInTheDocument();

    // click filter badge to remove filter
    userEvent.click(await findByText(/Keyword: back/i));
    expect(await queryByText(/Keyword: back/i)).not.toBeInTheDocument();
    expect(await queryByText(/new route/i)).toBeInTheDocument();
    expect(await findByText(/back and forth/i)).toBeInTheDocument();
  });

  test('sorting defaults to newest to oldest', async () => {
    const { getByText, queryAllByTestId, findByText } = renderRouteList();

    expect(await findByText(/2 routes/i)).toBeInTheDocument();

    const routeCards = await queryAllByTestId(/route-card-title/i);
    expect(routeCards[0]).toHaveTextContent('new route');
    expect(routeCards[1]).toHaveTextContent('back and forth');
  });

  test('sorts routes in order of oldest to newest', async () => {
    const { getByText, queryAllByTestId, findByText } = renderRouteList();

    // wait for routes to load
    expect(await findByText(/2 routes/i)).toBeInTheDocument();

    const select = getByText(/Sort By:/i);

    userEvent.click(select);
    userEvent.click(getByText(/Sort By: Oldest/i));

    const routeCards = await queryAllByTestId(/route-card-title/i);
    expect(routeCards[0]).toHaveTextContent('back and forth');
    expect(routeCards[1]).toHaveTextContent('new route');
  });

  test('sorts routes in order of shortest to longest', async () => {
    const { getByText, queryAllByTestId, findByText } = renderRouteList();

    // wait for routes to load
    expect(await findByText(/2 routes/i)).toBeInTheDocument();
    // find the select component
    const select = getByText(/Sort By:/i);
    // select the sort by shortest option
    userEvent.click(select);
    userEvent.click(getByText(/Sort By: Shortest/i));
    // assert order of components
    const routeCards = await queryAllByTestId(/route-card-title/i);
    expect(routeCards[0]).toHaveTextContent('back and forth');
    expect(routeCards[1]).toHaveTextContent('new route');
  });

  test('sorts routes in order of longest to shortes', async () => {
    const { getByText, queryAllByTestId, findByText } = renderRouteList();

    // wait for routes to load
    expect(await findByText(/2 routes/i)).toBeInTheDocument();

    const select = getByText(/Sort By:/i);

    userEvent.click(select);
    userEvent.click(getByText(/Sort By: Longest/i));

    const routeCards = await queryAllByTestId(/route-card-title/i);
    expect(routeCards[0]).toHaveTextContent('new route');
    expect(routeCards[1]).toHaveTextContent('back and forth');
  });
});
