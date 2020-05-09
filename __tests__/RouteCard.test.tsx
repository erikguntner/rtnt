import React from 'react';
import { render } from '@testing-library/react';
import RouteCard, { Props } from '../features/RouteList/RouteCard';

const defaultProps: Props = {
  id: 1,
  name: 'fun run',
  image: '',
  lines: [[[1, 2]]],
  units: 'miles',
  sports: ['run'],
  surfaces: ['paved'],
};

describe('<RouteCard />', () => {
  test('renders deploy link', () => {
    const { getByTestId } = render(<RouteCard {...defaultProps} />);

    // const { getByText } = renderRouteCard();
    // const linkElement = getByText(
    //   /Instantly deploy your Next\.js site to a public URL with ZEIT Now\./
    // );
    // expect(linkElement).toBeInTheDocument();
  });
});
