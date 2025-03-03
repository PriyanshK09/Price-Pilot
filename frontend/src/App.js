import React, { useEffect } from 'react';
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
  return (
    <div className="app">
      <CursorGlow />
      <Header />
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