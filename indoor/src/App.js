import { BrowserRouter,Routes,Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/navbar';

import Page2 from './components/airquality';

function App() {
  return (
      <div className='body-container'>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" Component={Page2} />
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
