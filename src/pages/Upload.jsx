import { useState } from 'react';
import uploadSrc from '../assets/upload.svg';

const Upload = () => {
  const [fileType, setFileType] = useState('photo');
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [about, setAbout] = useState('');
  const [userID, setUserID] = useState('12345'); // Example UserID
  const [userName, setUserName] = useState('John Doe'); // Example UserName

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('UserID', String(userID));
    formData.append('UserName', String(userName));
    formData.append('File', file);
    formData.append('FileName', String(title));
    formData.append('FileAbout', String(about));
    formData.append('Category', String(category));

    // Format the current date to "day/month/year"
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    formData.append('CreatedDate', formattedDate);

    try {
      const response = await fetch(
        'https://prod-22.northcentralus.logic.azure.com:443/workflows/f62344b13b8b40b38b3f994fa6b75a05/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=4Vj6Nyp4AprWNywpPlA7pfvGTyYHqSM5OiqabmZpMs0',
        {
          method: 'POST',
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      alert('File uploaded successfully.');
      console.log('Upload result:', result);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    }
  };

  return (
    <div className="p-4 w-full flex flex-col items-center">
      <div className="flex flex-row gap-3 underline mb-4">
        <button onClick={() => setFileType('photo')}>Upload Photo</button>
        <button onClick={() => setFileType('music')}>Upload Music</button>
        <button onClick={() => setFileType('video')}>Upload Video</button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-1 p-3 items-center"
      >
        <div className="w-[600px] border-2 border-black flex flex-col items-center gap-3 p-4">
          <img src={uploadSrc} alt="Upload" className="w-[200px] h-[200px]" />
          <div>
            {fileType === 'photo' && (
              <input
                type="file"
                accept="image/*"
                name="file"
                onChange={handleFileChange}
              />
            )}
            {fileType === 'music' && (
              <input
                type="file"
                accept="audio/*"
                name="file"
                onChange={handleFileChange}
              />
            )}
            {fileType === 'video' && (
              <input
                type="file"
                accept="video/*"
                name="file"
                onChange={handleFileChange}
              />
            )}
          </div>
        </div>

        <div className="flex flex-row gap-1">
          <label htmlFor="title">Title: </label>
          <input
            className="border"
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <span className="text-xs text-gray-500 self-end">
            Max: 50 Characters
          </span>
        </div>

        <div className="flex flex-row gap-1">
          <label htmlFor="about">About: </label>
          <textarea
            className="border"
            id="about"
            rows="4"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          ></textarea>
          <span className="text-xs text-gray-500 align-text-bottom self-end">
            Max: 450 Characters
          </span>
        </div>

        <div className="flex flex-row gap-1">
          <label htmlFor="category">Category: </label>
          <input
            className="border"
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <span className="text-xs text-gray-500 self-end">
            Max: 50 Characters
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
