import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { projects as staticProjects } from '../data/projects';

export const Portfolio = () => {
  const [filter, setFilter] = useState('All');
  const [projects, setProjects] = useState(staticProjects);
  const [loading, setLoading] = useState(true);
  const categories = ['All', 'Residential', 'Commercial'];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedProjects = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as any[];
        
        if (fetchedProjects.length > 0) {
          setProjects(fetchedProjects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.type === filter);

  return (
    <section id="portfolio" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
          <h2 className="text-4xl md:text-6xl">PORTFOLIO.</h2>
          
          <div className="flex space-x-8">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-xs uppercase tracking-[0.3em] font-bold transition-all duration-300 relative pb-2 ${
                  filter === cat ? 'text-black' : 'text-gray-400 hover:text-black'
                }`}
              >
                {cat}
                {filter === cat && (
                  <motion.div 
                    layoutId="activeFilter"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <AnimatePresence mode='popLayout'>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="group"
              >
                <Link to={`/project/${project.slug}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden mb-6">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-6 right-6 bg-white px-4 py-2 text-[10px] uppercase font-bold tracking-widest">
                      {project.type}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl mb-2 group-hover:text-accent transition-colors">{project.title}</h3>
                      <p className="text-xs text-gray-500 uppercase tracking-widest">{project.location}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-accent font-bold uppercase tracking-widest block mb-1">Tools</span>
                      <span className="text-xs font-medium">{project.software}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
