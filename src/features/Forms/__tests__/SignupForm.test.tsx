import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
  waitFor,
} from '../../../utils/test/test-utils';
import SignupForm from '../SignupForm';

function renderSignupForm(props: Partial<{}> = {}) {
  return render(<SignupForm {...props} />);
}

afterEach(cleanup);

describe('<SignupForm />', () => {
  test('shows error messages when no values are provided', async () => {
    const { queryByText, getByTestId, debug } = renderSignupForm();
    const submitButton = getByTestId('submit-btn');

    fireEvent.click(submitButton);

    await waitFor(() => {
      queryByText('Please provide an email!');
      queryByText('Please provide a username!');
      queryByText('Please provide a password!');
    });
  });

  test('must provide a valid an email', async () => {
    const {
      getByPlaceholderText,
      queryByText,
      getByTestId,
      debug,
    } = renderSignupForm();
    const emailInput = getByPlaceholderText('email');
    const submitButton = getByTestId('submit-btn');

    fireEvent.change(emailInput, { target: { value: 'notavalidemail' } });

    await waitFor(() => {
      queryByText('Please provide an email!');
    });

    fireEvent.change(emailInput, {
      target: { value: 'avalidemail@gmail.com' },
    });

    await waitFor(() => {
      expect(queryByText('Please provide an email!')).not.toBeInTheDocument();
    });
  });
});
