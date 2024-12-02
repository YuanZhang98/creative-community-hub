import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Photos } from './Photos';

describe('Photos Component', () => {
  const mockMetadata = [
    {
      filePath: 'test-file-path-1',
      fileId: '1',
      fileName: 'Test Photo 1',
      fileAbout: 'Test About 1',
      userName: 'Test User 1',
      lastUpdatedDate: '01/01/2023',
      category: 'Landscape',
    },
    {
      filePath: 'test-file-path-2',
      fileId: '2',
      fileName: 'Test Photo 2',
      fileAbout: 'Test About 2',
      userName: 'Test User 2',
      lastUpdatedDate: '02/01/2023',
      category: 'Portrait',
    },
  ];

  beforeEach(() => {
    global.fetch = jest.fn((url) => {
      if (url.includes('invoke')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMetadata),
        });
      } else if (url.includes('image')) {
        return Promise.resolve({
          ok: true,
          blob: () =>
            Promise.resolve(
              new Blob(['file contents'], { type: 'image/jpeg' }),
            ),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });
  });

  test('renders the Photos component with default filter', async () => {
    render(<Photos />);

    // Check if the default filter is "Landscape"
    expect(screen.getByText('Landscape')).toBeInTheDocument();

    // Wait for the MediaCard components to be rendered
    await waitFor(() => {
      expect(screen.getByText('Test Photo 1')).toBeInTheDocument();
    });
  });

  test('renders MediaCard components with correct data', async () => {
    render(<Photos />);

    // Wait for the MediaCard components to be rendered
    await waitFor(() => {
      expect(screen.getByText('Test Photo 1')).toBeInTheDocument();
      expect(screen.getByText('Test Photo 2')).toBeInTheDocument();
    });
  });

  test('changes filter and renders correct MediaCard components', async () => {
    render(<Photos />);

    // Click on the Portrait filter
    fireEvent.click(screen.getByText('Portrait'));

    // Wait for the MediaCard components to be rendered
    await waitFor(() => {
      expect(screen.getByText('Test Photo 2')).toBeInTheDocument();
    });
  });
});
