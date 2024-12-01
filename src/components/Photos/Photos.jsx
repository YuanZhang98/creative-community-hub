import { useState, useEffect } from 'react';
import { Filter, MediaCard } from '..';

const Photos = () => {
  const [photoFilters, setPhotoFilters] = useState([
    { id: 1, name: 'Landscape', isSelected: true },
    { id: 2, name: 'Portrait', isSelected: false },
    { id: 3, name: 'Pet', isSelected: false },
    { id: 4, name: 'Sports', isSelected: false },
    { id: 5, name: 'Food', isSelected: false },
    { id: 6, name: 'Fashion', isSelected: false },
    { id: 7, name: 'Travel', isSelected: false },
    { id: 8, name: 'Headshot', isSelected: false },
    { id: 9, name: 'Headshot', isSelected: false },
    { id: 10, name: 'Street', isSelected: false },
    { id: 11, name: 'Others', isSelected: false },
  ]);
  const [imageSrc, setImageSrc] = useState(null);
  const [documentSrcArray, setDocumentSrcArray] = useState([]);
  const [updateDocumentSrcArray, setUpdateDocumentSrcArray] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [imageSrcArray, setImageSrcArray] = useState([]);
  const [currentImagesArray, setCurrentImagesArray] = useState([]);

  const currentFilter = photoFilters.find((filter) => filter.isSelected);

  const fetchImageMetadata = async () => {
    try {
      const response = await fetch(
        'https://prod-11.northcentralus.logic.azure.com:443/workflows/d9b60c12bfae4c2ba51764c7f943e2d3/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=E1Ort8FHD5RbjGZAZT71hSN_FbDcL_ys7q6mTW0XyP8',
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
    fetchImageMetadata();
  }, []); // Add an empty dependency array to run only once

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const blobIds = metadata.map((item) => item.filePath);
        const responses = await Promise.all(
          blobIds.map((blobId) => fetchImage(blobId)),
        );

        console.log('Responses:', responses); // Log the responses

        setImageSrcArray(responses);
        createUpdateDocumentSrcArray();
        createCurrentImagesArray();
      } catch (error) {
        console.error('Error getting images:', error);
      }
    };

    const fetchImage = async (blobId) => {
      try {
        const response = await fetch(
          `https://prod-26.northcentralus.logic.azure.com/workflows/beaf6f6ecacf4d5da8ffcb5b4a29c06c/triggers/When_a_HTTP_request_is_received/paths/invoke/image/${blobId}?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=JcdZ4XyNE6uPx-qydxRwAS9xvyti9zZgaUAFMVRMbyc`,
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
        `https://prod-10.northcentralus.logic.azure.com/workflows/e83613f5e52d49cba6b4013af64f4ac8/triggers/When_a_HTTP_request_is_received/paths/invoke/image/${item.fileId}?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=JT476PitBOwtY1wbPLI_oGCei_ctwmfcinde6Znwqxk`,
    );

    setUpdateDocumentSrcArray(updateDocumentSrcArray);
  };

  const createCurrentImagesArray = () => {
    // First, map through the metadata to add imgSrc and updateEndpoint
    const mappedMetadata = metadata.map((image, index) => ({
      ...image,
      imgSrc: imageSrcArray[index],
      updateEndpoint: updateDocumentSrcArray[index],
    }));

    // Then, filter the mapped metadata based on the selected photo filters
    const currentImages = mappedMetadata.filter((image) =>
      photoFilters.some(
        (filter) => filter.isSelected && image.category === filter.name,
      ),
    );

    console.log('Current Images:', currentImages); // Log the current images

    setCurrentImagesArray(currentImages);
  };

  useEffect(() => {
    createCurrentImagesArray();
  }, [metadata, imageSrcArray, photoFilters, updateDocumentSrcArray]);

  return (
    <>
      <Filter filters={photoFilters} onChange={setPhotoFilters} />
      <div className="flex flex-row flex-wrap gap-10">
        {currentImagesArray.map((image, index) => (
          <MediaCard
            key={index}
            name={image.fileName}
            description={image.fileAbout}
            dateUploaded={image.lastUpdatedDate}
            imgSrc={image.imgSrc}
            author={image.userName}
            downloadLink={image.imgSrc}
            updateEndpoint={image.updateEndpoint}
            category={image.category}
            onEditComplete={fetchImageMetadata}
          />
        ))}
      </div>
    </>
  );
};

export { Photos };
