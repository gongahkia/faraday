import React from 'react';
import { render } from '@testing-library/react-native';
import EinkText from '../../frontend/eink/EinkText';

describe('EinkText Component', () => {
  it('renders text with default E-Ink optimized styles', () => {
    const { getByText } = render(<EinkText text="Test Content" />);
    const text = getByText('Test Content');
    expect(text.props.style).toMatchObject({
      fontFamily: 'monospace',
      includeFontPadding: false,
      textShadowOffset: { width: 0.5, height: 0.5 }
    });
  });

  it('applies custom fontSize and dither level', () => {
    const { getByText } = render(
      <EinkText text="Test" fontSize={20} ditherLevel={3} />
    );
    const text = getByText('Test');
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontSize: 20 }),
        expect.objectContaining({ textShadowColor: '#888' })
      ])
    );
  });
});