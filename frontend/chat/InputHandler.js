import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { EpdController, PenTouchHelper } from '../eink/EpdController';
import EinkButton from '../eink/EinkButton';

export default function InputHandler({ onSend, isProcessing }) {
  const [input, setInput] = useState('');
  const [isPenActive, setIsPenActive] = useState(false);

  useEffect(() => {
    const penConfig = {
      pressureThreshold: 0.3,
      color: '#000'
    };

    PenTouchHelper.init(penConfig, (event) => {
      setIsPenActive(true);
    });

    return () => PenTouchHelper.release();
  }, []);

  const handleSubmit = async () => {
    if (!input.trim() || isProcessing) return;

    try {
      onSend(input);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Eink-Refresh-Mode': 'partial'
        },
        body: JSON.stringify({
          text: input,
          context_mode: 'document'
        })
      });

      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        onReceive(chunk);
        
        EpdController.queuePartialRefresh();
      }
    } catch (error) {
      EpdController.fullRefresh();
      console.error('Chat error:', error);
    } finally {
      setInput('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Write or draw..."
        style={[
          styles.input,
          isPenActive && styles.penInput
        ]}
        editable={!isProcessing}
        multiline
        blurOnSubmit={false}
      />
      
      <EinkButton
        text="Send"
        onPress={handleSubmit}
        disabled={isProcessing}
        buttonStyle={styles.sendButton}
      />
    </View>
  );
}

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#ddd'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    minHeight: 40,
    fontSize: 14
  },
  penInput: {
    borderColor: '#000',
    backgroundColor: '#f8f8f8'
  },
  sendButton: {
    width: 80,
    height: 40
  }
};