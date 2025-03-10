import React, { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Deals from './components/Deals/Deals';
import Process from './components/Process/Process';
import Categories from './components/Categories/Categories';
import Testimonials from './components/Testimonials/Testimonials';
import Features from './components/Features/Features';
import Newsletter from './components/Newsletter/Newsletter';
import Footer from './components/Footer/Footer';
import CursorGlow from './components/CursorGlow/CursorGlow';
import './App.css';

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

  return (
    <div className="app">
      <CursorGlow />
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main>
        <Hero />
        <Deals />
        <Process />
        <Categories />
        <Testimonials />
        <Features />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}

export default App;