import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
  waitFor,
  act,
} from '../../../utils/test/test-utils';
import SigninForm from '../SigninForm';

import { configStore } from '../../../reducers/store';
import { Provider } from 'react-redux';

function renderSinginForm(props: Partial<{}> = {}) {
  return render(
    <Provider store={configStore}>
      <SigninForm {...props} />
    </Provider>
  );
}

afterEach(cleanup);

describe('<SigninForm />', () => {
  test('shows error messages when no values are provided', async () => {
    const { queryByText, getByTestId, debug } = renderSinginForm();
    const submitButton = getByTestId('submit-btn');

    fireEvent.click(submitButton);

    await waitFor(() => {
      queryByText('Please provide a username!');
      queryByText('Please provide a password!');
    });
  });

  test('redirect on submit', async () => {
    const {
      queryByText,
      getByText,
      getByTestId,
      getByPlaceholderText,
      debug,
    } = renderSinginForm();
    const submitButton = getByTestId('submit-btn');
    const usernameInput = getByPlaceholderText('username');
    const passwordInput = getByPlaceholderText('password');

    // fireEvent.change(usernameInput, { target: { value: 'erikguntner' } });
    // fireEvent.change(passwordInput, { target: { value: 'password' } });

    // await waitFor(() => {
    //   expect(queryByText('Please provide a username!')).not.toBeInTheDocument();
    //   expect(queryByText('Please provide a password!')).not.toBeInTheDocument();
    // });

    // fireEvent.click(submitButton);

    // await waitFor(() => {
    //   getByText('Processing...');
    // });

    // debug();
  });
});
