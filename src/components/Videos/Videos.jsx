import { useState } from 'react';
import { Filter, MediaCard } from '..';
import videoSrc from '../../assets/funny_video.png';
import { useMemo } from 'react';

const Videos = () => {
  const [videoFilters, setVideoFilters] = useState([
    { id: 1, name: 'Funny', isSelected: true },
    { id: 2, name: 'Sad', isSelected: false },
    { id: 3, name: 'Educational', isSelected: false },
  ]);
  // eslint-disable-next-line no-unused-vars
  const currentFilter = videoFilters.find((filter) => filter.isSelected);

  const videos = useMemo(
    () => [
      {
        id: 1,
        name: 'Cool Video',
        description: 'This is a cool video',
        dateUploaded: '12/24/2023',
        imgSrc: videoSrc,
        author: 'Steven Stove',
        categories: ['Funny', 'Sad'],
      },
      {
        id: 2,
        name: 'Funny Video',
        description: 'This is a funny video',
        dateUploaded: '12/24/2023',
        imgSrc: videoSrc,
        author: 'Steven Stove',
        categories: ['Funny', 'Educational'],
      },
      {
        id: 3,
        name: 'Sad Video',
        description: 'This is a sad video',
        dateUploaded: '12/24/2023',
        imgSrc: videoSrc,
        author: 'Steven Stove',
        categories: ['Educational'],
      },
    ],
    [],
  );

  const currentVideos = videos.filter((video) =>
    videoFilters.some(
      (filter) => filter.isSelected && video.categories.includes(filter.name),
    ),
  );

  return (
    <>
      <Filter filters={videoFilters} onChange={setVideoFilters} />
      <div className='flex flex-row flex-wrap gap-4'>
        {currentVideos.map((video) => (
          <MediaCard
            key={video.id}
            name={video.name}
            description={video.description}
            dateUploaded={video.dateUploaded}
            imgSrc={video.imgSrc}
            author={video.author}
          />
        ))}
      </div>
    </>
  );
};

export { Videos };
