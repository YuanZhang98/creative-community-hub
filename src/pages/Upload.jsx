import { useState } from 'react';
import uploadSrc from '../assets/upload.svg';

const Upload = () => {
  const [fileType, setFileType] = useState('photo');

  return (
    <div className="p-4 w-full flex flex-col items-center">
      <div className="flex flex-row gap-3 underline mb-4">
        <button onClick={() => setFileType('photo')}>Upload Photo</button>
        <button onClick={() => setFileType('music')}>Upload Music</button>
        <button onClick={() => setFileType('video')}>Upload Video</button>
      </div>

      <form
        action="/upload"
        method="post"
        encType="multipart/form-data"
        className="flex flex-col gap-1 p-3 items-center"
      >
        <div className="w-[600px] border-2 border-black flex flex-col items-center gap-3 p-4">
          <img src={uploadSrc} alt="Upload" className="w-[200px] h-[200px]" />
          <div>
            {fileType === 'photo' && (
              <input type="file" accept="image/*" name="file" />
            )}
            {fileType === 'music' && (
              <input type="file" accept="audio/*" name="file" />
            )}
            {fileType === 'video' && (
              <input type="file" accept="video/*" name="file" />
            )}
          </div>
        </div>

        <div className="flex flex-row gap-1">
          <label htmlFor="title">Title: </label>
          <input className="border" type="text" id="title" />
          <span className="text-xs text-gray-500 self-end">
            Max: 50 Characters
          </span>
        </div>

        <div className="flex flex-row gap-1">
          <label htmlFor="about">About: </label>
          <textarea className="border" id="about" rows="4"></textarea>
          <span className="text-xs text-gray-500 align-text-bottom self-end">
            Max: 450 Characters
          </span>
        </div>

        <button className="underline" type="submit">
          Upload
        </button>
      </form>
    </div>
  );
};

export { Upload };
