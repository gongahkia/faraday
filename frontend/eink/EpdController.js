import { NativeModules, DeviceEventEmitter } from 'react-native';

const { EpdModule } = NativeModules;

export default {

  PARTIAL: 'PARTIAL',
  FULL: 'FULL',

  setRefreshMode(mode) {
    EpdModule.setRefreshMode(mode);
  },

  partialRefresh() {
    EpdModule.scheduleRefresh('PARTIAL');
  },

  fullRefresh() {
    EpdModule.scheduleRefresh('FULL');
  },

  configurePen(pressureThreshold = 0.3) {
    EpdModule.configurePen(pressureThreshold);
  },

  addRefreshListener(callback) {
    return DeviceEventEmitter.addListener('EpdRefresh', callback);
  }
};