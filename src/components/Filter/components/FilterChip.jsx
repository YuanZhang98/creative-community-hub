import PropTypes from 'prop-types';

const FilterChip = ({ name, isSelected, onClick }) => {
  const selected = isSelected ? 'bg-yellow-300' : 'bg-white';

  return (
    <button className={`text-xl ${selected} border-2 border-spacing-1 px-3 py-1 rounded-2xl border-black`} onClick={onClick}>{name}</button>
  )  
};

FilterChip.propTypes = {
  name: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export { FilterChip };
