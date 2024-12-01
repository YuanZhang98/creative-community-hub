import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <nav className='flex flex-col justify-between px-6 py-6 items-baseline bg-yellow-400 md:flex-row'>
        <h1 className='text-3xl'>Creative Community Hub</h1>
        <div className='flex flex-row gap-8 text-xl'>
          <Link to='/upload'>Upload</Link>
          <Link to='/gallery'>Gallery</Link>
          <Link to='/profile'>User profile</Link>
        </div>
      </nav>
    </header>
  );
};

export { Header };
