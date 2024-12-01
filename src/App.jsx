import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Gallery, Profile, Upload } from './pages';
import { Header } from './components';

function App() {
  return (
    <Router>
      <div className='grid grid-rows-[auto,1fr] min-h-screen'>
        <Header />
        <main>
          <Routes>
            <Route path='/' element={<Gallery />} />
            <Route path='/upload' element={<Upload />} />
            <Route path='/gallery' element={<Gallery />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/upload' element={<Upload />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
