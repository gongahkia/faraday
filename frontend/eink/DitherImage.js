import React from 'react';
import { Image } from 'react-native';
import EpdController from './EpdController';

export default function DitherImage({ source, style }) {
  return (
    <Image
      source={source}
      style={style}
      onLoadEnd={() => EpdController.partialRefresh()}
      resizeMode="contain"
      fadeDuration={0} 
    />
  );
}
