import { useState } from 'react';
import PropTypes from 'prop-types';
import downloadIcon from '../../assets/download.svg';

const MediaCard = ({
  name,
  author,
  description,
  imgSrc,
  dateUploaded,
  downloadLink,
  category,
  updateEndpoint,
  deleteEndpoint,
  onEditComplete,
  onDeleteComplete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedAuthor, setEditedAuthor] = useState(author);
  const [editedDescription, setEditedDescription] = useState(description);
  const [editedCategory, setEditedCategory] = useState(category);

  const handleDownload = async () => {
    try {
      const response = await fetch(downloadLink, {
        method: 'GET',
      });

      if (response.status === 404) {
        console.error('Image not found.');
        return;
      }

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
    } catch (error) {
      console.error('Error getting image:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedName(name);
    setEditedAuthor(author);
    setEditedDescription(description);
    setEditedCategory(category);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('UserName', String(editedAuthor));
    formData.append('FileName', String(editedName));
    formData.append('FileAbout', String(editedDescription));
    formData.append('Category', String(editedCategory));

    // Format the current date to "day/month/year"
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    formData.append('LastUpdatedDate', formattedDate);

    try {
      const response = await fetch(updateEndpoint, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setIsEditing(false);
      onEditComplete();
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(deleteEndpoint, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      onDeleteComplete();
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-3 w-[345px]">
      <img
        className="rounded-lg h-[345px] w-[345px] object-cover"
        src={imgSrc}
        alt={name}
      />
      <div className="flex flex-col gap-1">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Name"
              className="border p-1"
            />
            <input
              type="text"
              value={editedAuthor}
              onChange={(e) => setEditedAuthor(e.target.value)}
              placeholder="Author"
              className="border p-1"
            />
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="Description"
              className="border p-1"
            ></textarea>
            <input
              type="text"
              value={editedCategory}
              onChange={(e) => setEditedCategory(e.target.value)}
              placeholder="Category"
              className="border p-1"
            />
            <div className="flex gap-2">
              <button type="submit" className="underline">
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="underline"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex flex-row justify-between">
              <h2 className="text-xl">{name}</h2>
              <button
                className="flex gap-1 items-center"
                onClick={handleDownload}
              >
                <img src={downloadIcon} alt="Download" className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm">{author}</p>
            <p className="text-sm">{description}</p>
            <p className="text-sm">Category: {category}</p>
            <p className="text-sm">Uploaded at {dateUploaded}</p>
            <div className="flex gap-2">
              <button onClick={handleEdit} className="underline">
                Edit
              </button>
              <button onClick={handleDelete} className="underline text-red-500">
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

MediaCard.propTypes = {
  name: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imgSrc: PropTypes.string.isRequired,
  dateUploaded: PropTypes.string.isRequired,
  downloadLink: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  updateEndpoint: PropTypes.string.isRequired,
  deleteEndpoint: PropTypes.string.isRequired,
  onEditComplete: PropTypes.func.isRequired,
  onDeleteComplete: PropTypes.func.isRequired,
};

export { MediaCard };
