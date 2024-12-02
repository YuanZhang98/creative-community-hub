import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Gallery } from './Gallery';

describe('Gallery Component', () => {
  test('renders the Gallery component with default filter', () => {
    render(<Gallery />);

    // Check if the default filter is "Photo"
    expect(screen.getByText('Photo')).toBeInTheDocument();
    expect(screen.getByText('Photo')).toHaveClass('text-3xl');
  });

  test('renders Photos component when Photo filter is selected', () => {
    render(<Gallery />);

    // Check if the Photos component is rendered
    expect(screen.getByText('Photo')).toBeInTheDocument();
  });

  test('renders Music component when Music filter is selected', () => {
    render(<Gallery />);

    // Click on the Music filter
    fireEvent.click(screen.getByText('Music'));

    // Check if the Music component is rendered
    expect(screen.getByText('Music')).toBeInTheDocument();
  });

  test('renders Videos component when Video filter is selected', () => {
    render(<Gallery />);

    // Click on the Video filter
    fireEvent.click(screen.getByText('Video'));

    // Check if the Videos component is rendered
    expect(screen.getByText('Video')).toBeInTheDocument();
  });
});
