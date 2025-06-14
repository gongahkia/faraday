import { NativeModules } from 'react-native';

const { PenInputModule } = NativeModules;

export default {
  init(listener) {
    PenInputModule.initialize((event) => {
      EpdController.partialRefresh();
      listener(event);
    });
  },

  setPressureThreshold(threshold) {
    PenInputModule.setPressureThreshold(threshold);
  }
};