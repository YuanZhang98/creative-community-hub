import PropTypes from 'prop-types';
import downloadIcon from '../../assets/download.svg';

const MediaCard = ({ name, author, description, imgSrc, dateUploaded }) => {
  return (
    <div className='flex flex-col gap-2 p-3 w-[345px]'>
      <img className='rounded-lg' src={imgSrc} alt={name} />
      <div className='flex flex-col gap-1'>
        <div className='flex flex-row justify-between'>
          <h2 className='text-xl'>{name}</h2>
          <button className='flex gap-1 items-center'>
            <img src={downloadIcon} alt='Download' className='h-5 w-5' />
          </button>
        </div>
        <p className='text-sm'>{author}</p>
        <p className='text-sm'>{description}</p>
        <p className='text-sm'>Uploaded at {dateUploaded}</p>
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
};

export { MediaCard };
