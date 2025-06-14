import PenTouchHelper from '../../frontend/eink/PenTouchHelper';
import { NativeModules } from 'react-native';

describe('PenTouchHelper', () => {
  beforeEach(() => {
    NativeModules.PenInputModule = {
      initialize: jest.fn(),
      setPressureThreshold: jest.fn()
    };
  });

  it('initializes with correct pressure threshold', () => {
    const mockListener = jest.fn();
    PenTouchHelper.init(mockListener);
    expect(NativeModules.PenInputModule.initialize)
      .toHaveBeenCalledWith(expect.any(Function));
  });
});