import PropTypes from 'prop-types';
import { FilterChip } from './components/FilterChip';

const Filter = ({ filters, onChange }) => {
  const handleFilterChange = (id) => {
    const updatedFilters = filters.map((filter) => ({
      ...filter,
      isSelected: filter.id === id,
    }));

    onChange(updatedFilters);
  };

  return (
    <div className='flex flex-row flex-wrap gap-2'>
      {filters.map((filter) => (
        <FilterChip
          key={filter.id}
          name={filter.name}
          isSelected={filter.isSelected}
          onClick={() => handleFilterChange(filter.id)}
        />
      ))}
    </div>
  );
};

Filter.propTypes = {
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      isSelected: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};

export { Filter };
