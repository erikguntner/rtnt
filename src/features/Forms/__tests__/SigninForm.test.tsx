import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
  waitFor,
} from '../../../utils/test/test-utils';
import SigninForm from '../SigninForm';

function renderSinginForm(props: Partial<{}> = {}) {
  return render(<SigninForm {...props} />);
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
