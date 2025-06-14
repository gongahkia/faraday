import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { EpdController } from '../eink/EpdController';
import EinkText from '../eink/EinkText';

export default function ChatHistory({ messages }) {
  const [displayMessages, setDisplayMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 15; 

  useEffect(() => {
    const newMessages = messages.slice(-itemsPerPage);
    setDisplayMessages(newMessages);
    
    const refreshTimer = setTimeout(() => {
      EpdController.partialRefresh();
    }, 500);

    return () => clearTimeout(refreshTimer);
  }, [messages]);

  const totalPages = Math.ceil(messages.length / itemsPerPage);
  
  return (
    <View style={styles.container}>
      {displayMessages.map((msg, index) => (
        <Bubble 
          key={index}
          text={msg.content}
          isUser={msg.role === 'user'}
        />
      ))}
      
      <PaginationControls
        current={currentPage}
        total={totalPages}
        onPageChange={setCurrentPage}
      />
    </View>
  );
}

const Bubble = React.memo(({ text, isUser }) => (
  <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
    <EinkText 
      text={text}
      fontSize={12}
      ditherLevel={2}
    />
  </View>
));

const PaginationControls = ({ current, total, onPageChange }) => (
  <View style={styles.pagination}>
    <EinkButton
      text="< Prev"
      onPress={() => onPageChange(Math.max(0, current - 1))}
      disabled={current === 0}
    />
    <EinkText text={`Page ${current + 1} of ${total}`} />
    <EinkButton
      text="Next >"
      onPress={() => onPageChange(Math.min(total - 1, current + 1))}
      disabled={current === total - 1}
    />
  </View>
);

const styles = {
  container: {
    padding: 8,
    backgroundColor: '#fff',
    minHeight: '80vh'
  },
  bubble: {
    marginVertical: 4,
    padding: 8,
    borderRadius: 12,
    maxWidth: '80%'
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#f0f0f0'
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  }
};