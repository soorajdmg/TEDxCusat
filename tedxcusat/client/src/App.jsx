import React from 'react';
import Navbar from './navbar';
import Hero from './hero';
import Countdown from './countdown';
import Speakers from './speakers';
import About from './about';
import Footer from './footer';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Countdown />
      <Speakers />
      <About />
      <Footer />
    </div>
  );
};

export default App;