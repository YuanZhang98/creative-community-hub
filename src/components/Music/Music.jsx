import { useState } from 'react';
import { MediaCard, Filter } from '..';
import soundSrc from '../../assets/sound.svg';

const Music = () => {
  const [musicFilters, setMusicFilters] = useState([
    { id: 1, name: 'Rock', isSelected: true },
    { id: 2, name: 'Pop', isSelected: false },
    { id: 3, name: 'Jazz', isSelected: false },
  ]);
  // eslint-disable-next-line no-unused-vars
  const currentFilter = musicFilters.find(
    (filter) => filter.isSelected,
  );

  return (
    <>
      <Filter filters={musicFilters} onChange={setMusicFilters} />
      <MediaCard
        name='Cool Song'
        description='This is a cool song'
        dateUploaded='12/24/2023'
        imgSrc={soundSrc}
        author='Steven Stove'
      />
    </>
  );
};

export { Music };
