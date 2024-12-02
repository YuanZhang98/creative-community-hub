import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Upload } from './Upload';

describe('Upload Component', () => {
  test('renders the Upload component with default file type', () => {
    render(<Upload />);

    // Check if the default file type is "photo"
    expect(screen.getByText('Upload Photo')).toHaveClass(
      'bg-blue-500 text-white',
    );
  });

  test('renders the correct input for photo file type', () => {
    render(<Upload />);

    // Check if the photo input is rendered
    expect(screen.getByLabelText('Title:')).toBeInTheDocument();
    expect(screen.getByLabelText('About:')).toBeInTheDocument();
    expect(screen.getByLabelText('Category:')).toBeInTheDocument();
    expect(screen.getByLabelText('Title:')).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('About:')).toHaveAttribute('rows', '4');
    expect(screen.getByLabelText('Category:')).toHaveAttribute('type', 'text');
  });

  test('changes file type to music and renders correct input', () => {
    render(<Upload />);

    // Click on the Music button
    fireEvent.click(screen.getByText('Upload Music'));

    // Check if the music input is rendered
    expect(screen.getByText('Upload Music')).toHaveClass(
      'bg-blue-500 text-white',
    );
    expect(screen.getByLabelText('Title:')).toBeInTheDocument();
    expect(screen.getByLabelText('About:')).toBeInTheDocument();
    expect(screen.getByLabelText('Category:')).toBeInTheDocument();
  });

  test('changes file type to video and renders correct input', () => {
    render(<Upload />);

    // Click on the Video button
    fireEvent.click(screen.getByText('Upload Video'));

    // Check if the video input is rendered
    expect(screen.getByText('Upload Video')).toHaveClass(
      'bg-blue-500 text-white',
    );
    expect(screen.getByLabelText('Title:')).toBeInTheDocument();
    expect(screen.getByLabelText('About:')).toBeInTheDocument();
    expect(screen.getByLabelText('Category:')).toBeInTheDocument();
  });

  test('submits the form with correct data', async () => {
    render(<Upload />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Title:'), {
      target: { value: 'Test Title' },
    });
    fireEvent.change(screen.getByLabelText('About:'), {
      target: { value: 'Test About' },
    });
    fireEvent.change(screen.getByLabelText('Category:'), {
      target: { value: 'Test Category' },
    });

    // Mock the file input
    const file = new File(['file contents'], 'test-file.jpg', {
      type: 'image/jpeg',
    });
    fireEvent.change(screen.getByLabelText('Title:'), {
      target: { files: [file] },
    });

    // Mock the fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'File uploaded successfully.' }),
      }),
    );

    // Submit the form
    fireEvent.submit(screen.getByText('Upload'));

    // Check if the fetch function was called with the correct endpoint
    expect(global.fetch).toHaveBeenCalledWith(
      'https://prod-22.northcentralus.logic.azure.com:443/workflows/f62344b13b8b40b38b3f994fa6b75a05/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=4Vj6Nyp4AprWNywpPlA7pfvGTyYHqSM5OiqabmZpMs0',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      }),
    );
  });
});
