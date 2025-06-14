import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import EpdController from './EpdController';

export default function EinkButton({ 
  text, 
  onPress, 
  disabled,
  buttonStyle 
}) {
  const handlePress = () => {
    EpdController.partialRefresh();
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]}
      onPress={handlePress}
      disabled={disabled}
      delayPressIn={50} 
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = {
  button: {
    padding: 8,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 4,
    backgroundColor: '#fff'
  },
  text: {
    color: '#000',
    textAlign: 'center',
    fontSize: 14
  }
};