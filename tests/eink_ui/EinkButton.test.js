import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import EinkButton from '../../frontend/eink/EinkButton';
import EpdController from '../../frontend/eink/EpdController';

jest.mock('../../frontend/eink/EpdController');

describe('EinkButton Component', () => {
  it('triggers partial refresh on press', () => {
    const mockPress = jest.fn();
    const { getByText } = render(
      <EinkButton text="Test Button" onPress={mockPress} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(mockPress).toHaveBeenCalled();
    expect(EpdController.partialRefresh).toHaveBeenCalled();
  });

  it('maintains E-Ink friendly styling when disabled', () => {
    const { getByText } = render(
      <EinkButton text="Disabled" disabled={true} />
    );
    const button = getByText('Disabled');
    expect(button.parent.props.style.backgroundColor).toBe('#fff');
  });
});