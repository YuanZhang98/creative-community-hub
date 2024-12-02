import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MediaCard } from './MediaCard';

describe('MediaCard Component', () => {
  const mockProps = {
    name: 'Test Name',
    author: 'Test Author',
    description: 'Test Description',
    imgSrc: 'test-image.jpg',
    dateUploaded: '01/01/2023',
    downloadLink: 'test-download-link',
    category: 'Test Category',
    updateEndpoint: 'test-update-endpoint',
    deleteEndpoint: 'test-delete-endpoint',
    onEditComplete: jest.fn(),
    onDeleteComplete: jest.fn(),
  };

  test('renders the MediaCard component with correct data', () => {
    render(<MediaCard {...mockProps} />);

    // Check if the component renders with correct data
    expect(screen.getByText('Test Name')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Category: Test Category')).toBeInTheDocument();
    expect(screen.getByText('Uploaded at 01/01/2023')).toBeInTheDocument();
  });

  test('renders the edit form when Edit button is clicked', () => {
    render(<MediaCard {...mockProps} />);

    // Click on the Edit button
    fireEvent.click(screen.getByText('Edit'));

    // Check if the edit form is rendered
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Author')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Category')).toBeInTheDocument();
  });

  test('calls onEditComplete after submitting the edit form', async () => {
    render(<MediaCard {...mockProps} />);

    // Click on the Edit button
    fireEvent.click(screen.getByText('Edit'));

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { value: 'Updated Name' },
    });
    fireEvent.change(screen.getByPlaceholderText('Author'), {
      target: { value: 'Updated Author' },
    });
    fireEvent.change(screen.getByPlaceholderText('Description'), {
      target: { value: 'Updated Description' },
    });
    fireEvent.change(screen.getByPlaceholderText('Category'), {
      target: { value: 'Updated Category' },
    });

    // Mock the fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Update successful.' }),
      }),
    );

    // Submit the form
    fireEvent.submit(screen.getByText('Save'));

    // Check if the fetch function was called with the correct endpoint
    expect(global.fetch).toHaveBeenCalledWith(
      'test-update-endpoint',
      expect.objectContaining({
        method: 'PUT',
        body: expect.any(FormData),
      }),
    );

    // Check if onEditComplete was called
    expect(mockProps.onEditComplete).toHaveBeenCalled();
  });

  test('calls onDeleteComplete after clicking the Delete button', async () => {
    render(<MediaCard {...mockProps} />);

    // Mock the fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Delete successful.' }),
      }),
    );

    // Click on the Delete button
    fireEvent.click(screen.getByText('Delete'));

    // Check if the fetch function was called with the correct endpoint
    expect(global.fetch).toHaveBeenCalledWith(
      'test-delete-endpoint',
      expect.objectContaining({
        method: 'DELETE',
      }),
    );

    // Check if onDeleteComplete was called
    expect(mockProps.onDeleteComplete).toHaveBeenCalled();
  });

  test('calls handleDownload when Download button is clicked', async () => {
    render(<MediaCard {...mockProps} />);

    // Mock the fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        blob: () =>
          Promise.resolve(new Blob(['file contents'], { type: 'image/jpeg' })),
      }),
    );

    // Click on the Download button
    fireEvent.click(screen.getByAltText('Download'));

    // Check if the fetch function was called with the correct endpoint
    expect(global.fetch).toHaveBeenCalledWith('test-download-link', {
      method: 'GET',
    });
  });
});
