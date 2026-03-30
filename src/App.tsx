import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { ServicesGrid } from './components/ServicesGrid';
import { Portfolio } from './components/Portfolio';
import { OurClients } from './components/OurClients';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ProjectDetail } from './pages/ProjectDetail';
import { AdminPanel } from './pages/AdminPanel';

const Home = () => (
  <>
    <Hero />
    <About />
    <ServicesGrid />
    <Portfolio />
    <OurClients />
    <Contact />
  </>
);

export default function App() {
  return (
    <Router>
      <div className="min-h-screen selection:bg-accent selection:text-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:slug" element={<ProjectDetail />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
