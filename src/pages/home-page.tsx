import React from 'react';
import logo from '../assets/bedreflyt-logo.webp';

const HomePage = () => {
  return (
    <header className="App-header">
      <img src={logo} className="AppLogo" width="300" height="300" alt="logo" />
      <p className="text-3xl font-bold underline">
        Welcome to the BedreFlyt app!
      </p>
    </header>
  );
}

export default HomePage;