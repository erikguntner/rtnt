import React from 'react';
import Map from '../Map';
import { render, fireEvent, waitFor } from '../../../utils/test-utils';
import { configStore } from '../../../reducers/store';
import { Provider } from 'react-redux';

function renderMap(props: Partial<{}> = {}) {
  const defaultProps = {};

  return render(
    <Provider store={configStore}>
      <Map {...defaultProps} {...props} />
    </Provider>
  );
}

describe('<Map />', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    // reset env variables for pusher
    jest.resetModules(); // clears the cache
    process.env = { ...OLD_ENV };
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    delete process.env.NODE_ENV;
    process.env.PUSHER_KEY = 'pusher-key';
    process.env.PUSHER_CLUSTER = 'pusher-cluster';
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  test('distance indicator toggles units when clicked', async () => {
    const { getByText } = renderMap();
    const distanceIndicator = getByText('click to change units');

    fireEvent.click(distanceIndicator);
    await waitFor(() => getByText('km'));

    fireEvent.click(distanceIndicator);
    await waitFor(() => getByText('mi'));
  });

  test('clicking on elevation button toggles elevation chart', async () => {
    const { getByTestId, getByText, queryByText, debug } = renderMap();
    const elevationToggle = getByTestId('control-btn-elevation');

    fireEvent.click(elevationToggle);
    expect(
      getByText('Create a line to see the elevation chart')
    ).toBeInTheDocument();

    fireEvent.click(elevationToggle);
    expect(
      queryByText('Create a line to see the elevation chart')
    ).not.toBeInTheDocument();
  });
});
