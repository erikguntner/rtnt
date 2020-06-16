import React from 'react';
import Map from '../Map';
import { render, fireEvent, waitFor } from '../../../utils/test/test-utils';
import WebMercatorViewport from 'viewport-mercator-project';
import { _MapContext as MapContext } from 'react-map-gl';
import userEvent from '@testing-library/user-event';

const mockStaticContext = {
  viewport: new WebMercatorViewport({
    width: 800,
    height: 600,
    latitude: -37.81482,
    longitude: 144.96679,
    zoom: 14,
  }),
};

function renderMap(props: Partial<{}> = {}) {
  const defaultProps = {};

  return render(
    <MapContext.Provider
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      //@ts-ignore
      value={mockStaticContext}
    >
      <Map {...defaultProps} {...props} />
    </MapContext.Provider>
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

    userEvent.click(distanceIndicator);
    await waitFor(() => getByText('km'));

    userEvent.click(distanceIndicator);
    await waitFor(() => getByText('mi'));
  });

  test('clicking on elevation button toggles elevation chart', async () => {
    const { getByTestId, getByText, queryByText } = renderMap();
    const elevationToggle = getByTestId('control-btn-elevation');

    userEvent.click(elevationToggle);
    expect(
      getByText('Create a line to see the elevation chart')
    ).toBeInTheDocument();

    userEvent.click(elevationToggle);
    expect(
      queryByText('Create a line to see the elevation chart')
    ).not.toBeInTheDocument();
  });
});
