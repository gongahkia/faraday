import EpdController from '../../frontend/eink/EpdController';
import { NativeModules } from 'react-native';

describe('EpdController Native Bridge', () => {
  beforeEach(() => {
    NativeModules.EpdModule = {
      setRefreshMode: jest.fn(),
      scheduleRefresh: jest.fn(),
      configurePen: jest.fn()
    };
  });

  it('maps partial refresh to REGAL mode', () => {
    EpdController.setRefreshMode('PARTIAL');
    expect(NativeModules.EpdModule.setRefreshMode)
      .toHaveBeenCalledWith('REGAL');
  });

  it('handles pen pressure thresholds', () => {
    EpdController.configurePen(0.4);
    expect(NativeModules.EpdModule.configurePen)
      .toHaveBeenCalledWith(0.4);
  });
});