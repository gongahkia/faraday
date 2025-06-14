import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import EinkButton from '../eink/EinkButton';
import EinkText from '../eink/EinkText';
import { EpdController } from '../eink/EpdController';
import axios from 'axios';

export default function Uploader({ onUploadComplete }) {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });

      if (res.size > 50 * 1024 * 1024) {
        EpdController.fullRefresh();
        Alert.alert('Error', 'File size exceeds 50MB limit');
        return;
      }

      await uploadDocument(res);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        EpdController.fullRefresh();
        Alert.alert('Error', 'Failed to select file');
      }
    }
  };

  const uploadDocument = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    });

    try {
      await axios.post('/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setProgress(percent);
          EpdController.partialRefresh();
        },
      });

      EpdController.fullRefresh();
      onUploadComplete();
    } catch (error) {
      EpdController.fullRefresh();
      Alert.alert('Upload Failed', error.response?.data?.detail || 'Unknown error');
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <View style={styles.container}>
      <EinkText 
        text={isUploading ? `Uploading... ${progress}%` : "Select PDF Document"}
        fontSize={14}
      />
      
      <EinkButton
        text="Choose File"
        onPress={handleFileSelect}
        disabled={isUploading}
        buttonStyle={styles.button}
      />
    </View>
  );
}

const styles = {
  container: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    margin: 8
  },
  button: {
    marginTop: 8,
    height: 40
  }
};