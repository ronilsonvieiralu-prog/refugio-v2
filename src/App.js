import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import RequestHelp from './pages/RequestHelp';
import OfferHelp from './pages/OfferHelp';
import Listings from './pages/Listings';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Header />
        <div className="app-body">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pedir-ajuda" element={<RequestHelp />} />
            <Route path="/oferecer-ajuda" element={<OfferHelp />} />
            <Route path="/listagens" element={<Listings />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
