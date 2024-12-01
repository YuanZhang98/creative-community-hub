import { useState, useEffect } from 'react';
import { Filter, MediaCard } from '..';
import video from '../../assets/funny_video.png';

const Videos = () => {
  const [musicFilters, setMusicFilters] = useState([
    { id: 1, name: 'Travel', isSelected: true },
    { id: 2, name: 'Movie', isSelected: false },
    { id: 3, name: 'Short Movie', isSelected: false },
    { id: 4, name: 'Event', isSelected: false },
    { id: 5, name: 'Document', isSelected: false },
    { id: 6, name: 'Education', isSelected: false },
    { id: 7, name: 'Animation', isSelected: false },
    { id: 8, name: 'Storytelling', isSelected: false },
    { id: 9, name: 'Real estate', isSelected: false },
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
        'https://prod-08.northcentralus.logic.azure.com:443/workflows/c3af611e1dab434cac814624e830353c/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=NVWGRr_1JKdIkv2TVTNNecCkk-JeAqy9XZVb8oqTOjg',
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
          `https://prod-23.northcentralus.logic.azure.com/workflows/c7eeea05a89149159f07dc011425247f/triggers/When_a_HTTP_request_is_received/paths/invoke/video/${blobId}?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=3ZQLRcz-JdWTx-e2B64grD7W2oKQUb4NZgD-a-50w5o`,
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
        `https://prod-08.northcentralus.logic.azure.com/workflows/3bf07053d52d49d2bc3168226a3a54a0/triggers/When_a_HTTP_request_is_received/paths/invoke/video/${item.fileId}?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=P6NRkvig2IB2oikPnsyFv-D2WKfUBuroXPBDrNgnvaE`,
    );

    setUpdateDocumentSrcArray(updateDocumentSrcArray);
  };

  const createCurrentImagesArray = () => {
    // First, map through the metadata to add imgSrc and updateEndpoint
    const mappedMetadata = metadata.map((image, index) => ({
      ...image,
      imgSrc: songSrcArray[index],
      updateEndpoint: updateDocumentSrcArray[index],
      deleteEndpoint: `https://prod-18.northcentralus.logic.azure.com/workflows/f753c6316fdd4686928e4fca2108c5a4/triggers/When_a_HTTP_request_is_received/paths/invoke/video/${image.filePath}/${image.fileId}?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=eFI09XQ_uTSK2-hLLZyuvG-pN1YuCaNjQNhpBxvbVV8`,
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
            imgSrc={video}
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

export { Videos };
