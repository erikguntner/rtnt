import React from 'react';
import { server, rest } from '../../../utils/test/server';
import { render, fireEvent, waitFor } from '../../../utils/test/test-utils';
import { configStore } from '../../../reducers/store';
import { Provider } from 'react-redux';
import RouteList from '../RouteList';

const renderRouteList = (props: Partial<{}> = {}, initialState = {}) => {
  const defaultProps = {};
  return render(
    <Provider store={configStore}>
      <RouteList {...defaultProps} {...props} />
    </Provider>
  );
};

describe('<RouteList />', () => {
  test('renders fetched routes in list', async () => {
    const { debug, findByText, queryByText } = renderRouteList();

    expect(await findByText(/back and forth/i)).toBeInTheDocument();
    expect(await findByText(/new route/i)).toBeInTheDocument();
  });

  test('renders text if no routes are returned', async () => {
    server.use(
      rest.get('/api/routes', async (req, res, ctx) => {
        return res(ctx.json({ routes: [], units: 'miles' }));
      })
    );

    const { debug, findByText, queryByText } = renderRouteList();

    expect(await findByText(/No Routes/i)).toBeInTheDocument();
    expect(await queryByText(/back and forth/i)).not.toBeInTheDocument();

    debug();
  });
});
