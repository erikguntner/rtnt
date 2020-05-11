import React from 'react';
import { render } from '@testing-library/react';

import RouteCard, { Props } from '../features/RouteList/RouteCard';

const defaultProps: Props = {
  id: 1,
  name: 'asdf',
  image: 'asdfasdf',
  lines: [[[234, 2523]]],
  units: 'miles',
  sports: ['run'],
  surfaces: ['paved'],
};

function renderRouteCard(props: Partial<Props> = {}) {
  return render(<RouteCard {...defaultProps} {...props} />);
}

describe('<RouteCard />', () => {
  test('should display a blank login form, with remember me checked by default', async () => {
    const { getByLabelText } = render(<RouteCard {...defaultProps} />);
    // ???
  });
});
