import React, { useState, useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import EinkButton from '../eink/EinkButton';
import EinkText from '../eink/EinkText';
import { EpdController } from '../eink/EpdController';
import RNFetchBlob from 'rn-fetch-blob';

export default function Viewer({ documentUri }) {
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageImage, setPageImage] = useState(null);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        const { base64 } = await RNFetchBlob.fs.readFile(documentUri, 'base64');
        const pdfInfo = await RNFetchBlob.polyfill.PDF.getDocumentInfo(`data:application/pdf;base64,${base64}`);
        setNumPages(pdfInfo.numberOfPages);
        renderPage(currentPage);
      } catch (err) {
        EpdController.fullRefresh();
        Alert.alert('Error', 'Failed to load document');
      }
    };

    if (documentUri) loadDocument();
  }, [documentUri]);

  const renderPage = async (pageNumber) => {
    try {
      const { base64 } = await RNFetchBlob.fs.readFile(documentUri, 'base64');
      const imageData = await RNFetchBlob.polyfill.PDF.renderToBase64(
        `data:application/pdf;base64,${base64}`,
        {
          page: pageNumber,
          scale: Dimensions.get('window').width / 612 
        }
      );
      
      setPageImage(`data:image/png;base64,${imageData}`);
      EpdController.partialRefresh();
    } catch (err) {
      EpdController.fullRefresh();
      Alert.alert('Error', 'Failed to render page');
    }
  };

  const handlePageChange = (delta) => {
    const newPage = Math.max(1, Math.min(numPages, currentPage + delta));
    setCurrentPage(newPage);
    renderPage(newPage);
  };

  return (
    <View style={styles.container}>
      {pageImage && (
        <EpdController.PartialRefreshView>
          <Image 
            source={{ uri: pageImage }}
            style={styles.image}
            resizeMode="contain"
          />
        </EpdController.PartialRefreshView>
      )}
      
      <View style={styles.controls}>
        <EinkButton
          text="◀ Prev"
          onPress={() => handlePageChange(-1)}
          disabled={currentPage <= 1}
        />
        
        <EinkText 
          text={`Page ${currentPage} of ${numPages}`}
          fontSize={12}
        />
        
        <EinkButton
          text="Next ▶"
          onPress={() => handlePageChange(1)}
          disabled={currentPage >= numPages}
        />
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  image: {
    flex: 1,
    width: '100%',
    height: Dimensions.get('window').height * 0.8
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#ddd'
  }
};
