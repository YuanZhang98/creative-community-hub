import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Music } from './Music';

describe('Music Component', () => {
  const mockMetadata = [
    {
      filePath: 'test-file-path-1',
      fileId: '1',
      fileName: 'Test Song 1',
      fileAbout: 'Test About 1',
      userName: 'Test User 1',
      lastUpdatedDate: '01/01/2023',
      category: 'Rock',
    },
    {
      filePath: 'test-file-path-2',
      fileId: '2',
      fileName: 'Test Song 2',
      fileAbout: 'Test About 2',
      userName: 'Test User 2',
      lastUpdatedDate: '02/01/2023',
      category: 'Pop',
    },
  ];

  beforeEach(() => {
    global.fetch = jest.fn((url) => {
      if (url.includes('invoke')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMetadata),
        });
      } else if (url.includes('music')) {
        return Promise.resolve({
          ok: true,
          blob: () =>
            Promise.resolve(
              new Blob(['file contents'], { type: 'audio/mpeg' }),
            ),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });
  });

  test('renders the Music component with default filter', async () => {
    render(<Music />);

    // Check if the default filter is "Rock"
    expect(screen.getByText('Rock')).toBeInTheDocument();
    expect(screen.getByText('Rock')).toHaveClass('text-3xl');

    // Wait for the MediaCard components to be rendered
    await waitFor(() => {
      expect(screen.getByText('Test Song 1')).toBeInTheDocument();
    });
  });

  test('renders MediaCard components with correct data', async () => {
    render(<Music />);

    // Wait for the MediaCard components to be rendered
    await waitFor(() => {
      expect(screen.getByText('Test Song 1')).toBeInTheDocument();
      expect(screen.getByText('Test Song 2')).toBeInTheDocument();
    });
  });

  test('changes filter and renders correct MediaCard components', async () => {
    render(<Music />);

    // Click on the Pop filter
    fireEvent.click(screen.getByText('Pop'));

    // Wait for the MediaCard components to be rendered
    await waitFor(() => {
      expect(screen.getByText('Test Song 2')).toBeInTheDocument();
    });
  });
});
