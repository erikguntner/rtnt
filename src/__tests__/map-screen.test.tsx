import React from 'react';
import { render, screen } from '../utils/test/test-utils';
import Home from '../../pages/index';
import { Layout } from '../../pages/_app';

jest.mock('pusher-js', () => () => ({
  subscribe: () => ({
    bind: jest.fn(),
  }),
}));

describe('The Map Screen', () => {
  it('should render the buttons', async () => {
    render(
      <Layout>
        <Home />
      </Layout>,
      {
        auth: {
          user: {
            email: 'erikguntner@gmail.com',
            username: 'erik',
            units: 'miles',
          },
          authenticated: 'THIS_IS_A_FAKE_TOKEN',
        },
      }
    );

    // await waitForElementToBeRemoved(screen.getByLabelText(/loading user/i));

    screen.debug();
  });
});
