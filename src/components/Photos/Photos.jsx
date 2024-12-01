import { useState } from 'react';
import { Filter, MediaCard } from '..';
import dogSrc from '../../assets/dog.png';

const Photos = () => {
  const [photoFilters, setPhotoFilters] = useState([
    { id: 1, name: 'Landscape', isSelected: true },
    { id: 2, name: 'Portrait', isSelected: false },
    { id: 3, name: 'Square', isSelected: false },
  ]);
  // eslint-disable-next-line no-unused-vars
  const currentFilter = photoFilters.find(
    (filter) => filter.isSelected,
  );

  return (
    <>
      <Filter filters={photoFilters} onChange={setPhotoFilters} />
      <MediaCard
        name='Cool Doggo'
        description='This is an image of a cool doggo'
        dateUploaded='12/24/2023'
        imgSrc={dogSrc}
        author='Steven Stove'
      />
    </>
  );
};

export { Photos };
