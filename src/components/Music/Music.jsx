import { useState, useEffect } from 'react';
import { Filter, MediaCard } from '..';
import sound from '../../assets/sound.svg';

const Music = () => {
  const [musicFilters, setMusicFilters] = useState([
    { id: 1, name: 'Rock', isSelected: true },
    { id: 2, name: 'Pop', isSelected: false },
    { id: 3, name: 'Jazz', isSelected: false },
    { id: 4, name: 'Blues', isSelected: false },
    { id: 5, name: 'Classicals', isSelected: false },
    { id: 6, name: 'Folk', isSelected: false },
    { id: 7, name: 'Soul', isSelected: false },
    { id: 8, name: 'Disco', isSelected: false },
    { id: 9, name: 'Indie', isSelected: false },
    { id: 10, name: 'Others', isSelected: false },
  ]);
  const [updateDocumentSrcArray, setUpdateDocumentSrcArray] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [songSrcArray, setSongSrcArray] = useState([]);
  const [currentSongsArray, setCurrentSongsArray] = useState([]);

  const currentFilter = musicFilters.find((filter) => filter.isSelected);

  const fetchSongMetadata = async () => {
    try {
      const response = await fetch(
        'https://prod-12.northcentralus.logic.azure.com:443/workflows/b364a3a21d8349e2a392d9d1d9ec7110/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=X8XvW7karJK2VP033rnqweCzC9QK7bhGbsUqspbk3tw',
        {
          method: 'GET',
        },
      );

      if (response.status === 404) {
        console.error('Metadata not found.');
        return;
      }

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const fetchedMetadata = await response.json();
      console.log('Fetched Metadata:', fetchedMetadata); // Log the fetched metadata

      const isBase64 = (str) => {
        try {
          return btoa(atob(str)) === str;
        } catch (err) {
          return false;
        }
      };

      const processedMetadata = fetchedMetadata.map((item) => ({
        filePath: item.filePath.split('/').pop(),
        fileId: item.id,
        fileName: isBase64(item.fileName.$content)
          ? atob(item.fileName.$content)
          : item.fileName,
        fileAbout: isBase64(item.fileAbout.$content)
          ? atob(item.fileAbout.$content)
          : item.fileAbout,
        userName: isBase64(item.userName.$content)
          ? atob(item.userName.$content)
          : item.userName,
        lastUpdatedDate: isBase64(item.lastUpdatedDate.$content)
          ? atob(item.lastUpdatedDate.$content)
          : item.lastUpdatedDate,
        category: isBase64(item.category.$content)
          ? atob(item.category.$content)
          : item.category,
      }));

      setMetadata(processedMetadata);
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  };

  useEffect(() => {
    fetchSongMetadata();
  }, []); // Add an empty dependency array to run only once

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const blobIds = metadata.map((item) => item.filePath);
        const responses = await Promise.all(
          blobIds.map((blobId) => fetchImage(blobId)),
        );

        console.log('Responses:', responses); // Log the responses

        setSongSrcArray(responses);
        createUpdateDocumentSrcArray();
        createCurrentImagesArray();
      } catch (error) {
        console.error('Error getting images:', error);
      }
    };

    const fetchImage = async (blobId) => {
      try {
        const response = await fetch(
          `https://prod-13.northcentralus.logic.azure.com/workflows/49cd2fb4fcbe44188c299a2fc1c05446/triggers/When_a_HTTP_request_is_received/paths/invoke/music/${blobId}?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=i7sgUdhTFyBrYnisw-EsKRMcrmhcv78Y8uV2PVrk7eM`,
          {
            method: 'GET',
          },
        );

        if (response.status === 404) {
          return null;
        }

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        console.log('Image URL:', url); // Log the image URL
        return url;
      } catch (error) {
        console.error('Error getting image:', error);
        return null;
      }
    };

    if (metadata.length > 0) {
      fetchImages();
    }
  }, [metadata]);

  const createUpdateDocumentSrcArray = () => {
    const updateDocumentSrcArray = metadata.map(
      (item) =>
        `https://prod-06.northcentralus.logic.azure.com/workflows/a5bcabe38d164a0381fbd4592ff181e9/triggers/When_a_HTTP_request_is_received/paths/invoke/music/${item.fileId}?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=2ZsrvjrkHGMAM5KOND3pTUiz4hBvnbfbu3IadV0v85k`,
    );

    setUpdateDocumentSrcArray(updateDocumentSrcArray);
  };

  const createCurrentImagesArray = () => {
    // First, map through the metadata to add imgSrc and updateEndpoint
    const mappedMetadata = metadata.map((image, index) => ({
      ...image,
      imgSrc: songSrcArray[index],
      updateEndpoint: updateDocumentSrcArray[index],
      deleteEndpoint: `https://prod-28.northcentralus.logic.azure.com/workflows/a24bd6dcf0df42f283cff3c287b1f563/triggers/When_a_HTTP_request_is_received/paths/invoke/music/${image.filePath}/${image.fileId}?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=hJAVlakUolHRwxxGntu9BgvGMCgti0fy5iy_U9A94k4`,
    }));

    // Then, filter the mapped metadata based on the selected photo filters
    const currentImages = mappedMetadata.filter((image) =>
      musicFilters.some(
        (filter) => filter.isSelected && image.category === filter.name,
      ),
    );

    console.log('Current Images:', currentImages); // Log the current images

    setCurrentSongsArray(currentImages);
  };

  useEffect(() => {
    createCurrentImagesArray();
  }, [metadata, songSrcArray, musicFilters, updateDocumentSrcArray]);

  return (
    <>
      <Filter filters={musicFilters} onChange={setMusicFilters} />
      <div className="flex flex-row flex-wrap gap-10">
        {currentSongsArray.map((image, index) => (
          <MediaCard
            key={index}
            name={image.fileName}
            description={image.fileAbout}
            dateUploaded={image.lastUpdatedDate}
            imgSrc={sound}
            author={image.userName}
            downloadLink={image.imgSrc}
            updateEndpoint={image.updateEndpoint}
            category={image.category}
            deleteEndpoint={image.deleteEndpoint}
            onEditComplete={fetchSongMetadata}
            onDeleteComplete={fetchSongMetadata}
          />
        ))}
      </div>
    </>
  );
};

export { Music };
