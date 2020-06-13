import React from 'react';
import { render, fireEvent } from '../../../utils/test/test-utils';
import ControlButton, { Props } from '../ControlButton';
import { faUndoAlt } from '@fortawesome/free-solid-svg-icons';

function renderControlButton(props: Partial<Props> = {}) {
  const defaultProps: Props = {
    disabled: true,
    handleClick() {
      return;
    },
    icon: faUndoAlt,
    tooltip: 'undo',
    activeState: false,
    id: 'undo',
  };

  return render(<ControlButton {...defaultProps} {...props} />);
}

describe('<ControlButton />', () => {
  test('handleClick does not fire when the button is disabled', () => {
    const handleClick = jest.fn();
    const { getByTestId } = renderControlButton({ handleClick });

    fireEvent.click(getByTestId('control-btn-undo'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('handleClick fires when the button is not disabled', () => {
    const handleClick = jest.fn();
    const { getByTestId } = renderControlButton({
      handleClick,
      disabled: false,
    });

    fireEvent.click(getByTestId('control-btn-undo'));
    expect(handleClick).toHaveBeenCalled();
  });
});
