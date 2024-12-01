import { Filter, Photos, Music, Videos } from '../components';
import { useState } from 'react';

const Gallery = () => {
  const [filters, setFilters] = useState([
    { id: 1, name: 'Photo', isSelected: true },
    { id: 2, name: 'Music', isSelected: false },
    { id: 3, name: 'Video', isSelected: false },
  ]);
  const currentlySelectedFilter = filters.find((filter) => filter.isSelected);

  return (
    <div className="flex flex-col px-10 py-8 gap-3">
      <h1 className="text-3xl">{currentlySelectedFilter?.name}</h1>
      <Filter filters={filters} onChange={setFilters} />

      {currentlySelectedFilter?.name === 'Photo' && <Photos />}
      {currentlySelectedFilter?.name === 'Music' && <Music />}
      {currentlySelectedFilter?.name === 'Video' && <Videos />}
    </div>
  );
};

export { Gallery };
