import React from 'react';
import ElevationProfile, { Props } from '../ElevationProfile';
import {
  exampleRoute,
  render,
  waitForDomChange,
} from '../../../utils/test/test-utils';

function renderElevationProfile(props: Partial<Props> = {}) {
  const defaultProps: Props = {
    showElevation: true,
    lines: [],
    units: 'miles',
    setDistanceAlongPath: jest.fn(),
  };

  return render(<ElevationProfile {...defaultProps} {...props} />);
}

describe('<ElevationProfile />', () => {
  test('shows text when there is no line present', async () => {
    const { getByText, queryByTestId } = renderElevationProfile();
    expect(
      getByText('Create a line to see the elevation chart')
    ).toBeInTheDocument();
    expect(queryByTestId('elevation-profile')).not.toBeInTheDocument();
  });

  test('shows svg when there is a line present in state', async () => {
    const { queryByText, getByTestId, debug } = renderElevationProfile({
      lines: exampleRoute.lines,
    });
    expect(getByTestId('elevation-profile')).toBeInTheDocument();
    expect(
      queryByText('Create a line to see the elevation chart')
    ).not.toBeInTheDocument();
  });
});
