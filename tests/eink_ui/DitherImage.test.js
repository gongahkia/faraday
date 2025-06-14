import React from 'react';
import { render } from '@testing-library/react-native';
import DitherImage from '../../frontend/eink/DitherImage';
import EpdController from '../../frontend/eink/EpdController';

jest.mock('../../frontend/eink/EpdController');

describe('DitherImage Component', () => {
  it('triggers refresh after image load', () => {
    const { getByTestId } = render(
      <DitherImage 
        source={{ uri: 'test.jpg' }} 
        testID="dither-image" 
      />
    );
    
    fireEvent(getByTestId('dither-image'), 'onLoadEnd');
    expect(EpdController.partialRefresh).toHaveBeenCalled();
  });
});