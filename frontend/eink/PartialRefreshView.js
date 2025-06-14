import React, { useEffect } from 'react';
import { View } from 'react-native';
import EpdController from './EpdController';

export default function PartialRefreshView({ children }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      EpdController.partialRefresh();
    }, 500); 

    return () => clearTimeout(timer);
  }, [children]);

  return <View>{children}</View>;
}
