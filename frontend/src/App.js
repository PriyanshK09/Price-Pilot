import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import HomeSearch from './components/Search/HomeSearch';
import Deals from './components/Deals/Deals';
import Process from './components/Process/Process';
import Categories from './components/Categories/Categories';
import Testimonials from './components/Testimonials/Testimonials';
import Features from './components/Features/Features';
import Newsletter from './components/Newsletter/Newsletter';
import Footer from './components/Footer/Footer';
import SearchResults from './pages/SearchResults/SearchResults';
import CursorGlow from './components/CursorGlow/CursorGlow';
import './App.css';

// Dev's Miscellaneous
import ApiTest from './components/ApiTest';

function App() {
  const [theme, setTheme] = useState('dark');
  
  useEffect(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);
  
  useEffect(() => {
    // Apply theme class to document body
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    // Save theme preference
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(currentTheme => currentTheme === 'dark' ? 'light' : 'dark');
  };

  // HomePage component to combine all home page sections
  const HomePage = () => (
    <>
      <Hero />
      <HomeSearch />
      <Deals />
      <Process />
      <Categories />
      <Testimonials />
      <Features />
      <Newsletter />
    </>
  );

  return (
    <div className="app">
      <CursorGlow />
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchResults />} />
          {/* Add more routes as needed */}
          <Route path="/api-test" element={<ApiTest />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;