import React from 'react';
import { Text } from 'react-native';

export default function EinkText({ 
  text, 
  fontSize = 14, 
  ditherLevel = 2, 
  style 
}) {
  return (
    <Text
      style={[
        styles.base,
        { fontSize },
        ditherLevel > 1 && styles.dither,
        style
      ]}
      selectable={false} 
    >
      {text}
    </Text>
  );
}

const styles = {
  base: {
    color: '#000',
    includeFontPadding: false,
    fontFamily: 'monospace', 
    textShadowColor: '#fff',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 0
  },
  dither: {
    textShadowColor: '#888',
    textShadowOffset: { width: 0.3, height: 0.3 }
  }
};