import React from 'react';
import { render, fireEvent } from '../../../utils/test-utils';
import RouteCard, { Props } from '../RouteCard';

const lines = [
  [
    [-117.748926, 34.108055, 357.92],
    [-117.748928, 34.108015, 357.43],
    [-117.74859, 34.107905, 357.81],
    [-117.747425, 34.107514, 359.37],
    [-117.747321, 34.107421, 359.57],
    [-117.747046, 34.107354, 360.19],
    [-117.746685, 34.10729, 360.72],
    [-117.746414, 34.107249, 361.2],
    [-117.746036, 34.107218, 360.86],
    [-117.742611, 34.10719, 361.2],
    [-117.737908, 34.107104, 365.44],
    [-117.737687, 34.107065, 365.59],
    [-117.735545, 34.107029, 369.67],
    [-117.735547, 34.106959, 369.42],
    [-117.732307, 34.10693, 375.5],
    [-117.732277, 34.106947, 375.5],
    [-117.729301, 34.106942, 379.2],
    [-117.729232, 34.106914, 379.17],
    [-117.728921, 34.106914, 379.44],
    [-117.728842, 34.107101, 380.05],
    [-117.722716, 34.107094, 388.25],
  ],
];

function renderRouteCard(props: Partial<Props> = {}) {
  const defaultProps: Props = {
    id: 1,
    name: 'asdf',
    image: 'asdfasdf',
    lines,
    units: 'miles',
    sports: ['run'],
    surfaces: ['paved'],
  };

  return render(<RouteCard {...defaultProps} {...props} />);
}

describe('<RouteCard />', () => {
  test('should display the name of the route', async () => {
    const { getByText } = renderRouteCard();
    getByText('asdf');
  });
});
