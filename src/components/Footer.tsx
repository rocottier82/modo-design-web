import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <Link to="/" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="MODO Design Logo" 
              className="h-12 w-auto object-contain brightness-0 invert opacity-80" 
            />
          </Link>

          <div className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold flex flex-col items-center gap-2">
            <span>© {new Date().getFullYear()} MODO Design. All Rights Reserved.</span>
            <Link to="/admin" className="opacity-20 hover:opacity-100 transition-opacity">Admin</Link>
          </div>

          <div className="flex space-x-8">
            <a href="#" className="text-[10px] uppercase tracking-widest font-bold hover:text-accent transition-colors">LinkedIn</a>
            <a href="#" className="text-[10px] uppercase tracking-widest font-bold hover:text-accent transition-colors">Instagram</a>
            <a href="#" className="text-[10px] uppercase tracking-widest font-bold hover:text-accent transition-colors">Behance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
