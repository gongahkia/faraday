import React from 'react';
import { render } from '@testing-library/react-native';
import PartialRefreshView from '../../frontend/eink/PartialRefreshView';
import EpdController from '../../frontend/eink/EpdController';

jest.mock('../../frontend/eink/EpdController');

describe('PartialRefreshView', () => {
  it('schedules refresh after render', () => {
    render(
      <PartialRefreshView>
        <></>
      </PartialRefreshView>
    );
    
    jest.runAllTimers();
    expect(EpdController.partialRefresh).toHaveBeenCalled();
  });
});