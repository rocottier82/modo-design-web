import React from 'react';
import { motion } from 'motion/react';

export const About = () => {
  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden">
      {/* Background BIM Grid */}
      <div className="absolute top-0 right-0 w-1/2 h-full bim-grid opacity-10 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-accent text-xs font-bold tracking-[0.4em] uppercase mb-4 block">The Vision</span>
            <h2 className="text-4xl md:text-6xl mb-8 leading-tight">
              RODRIGO <br /> COTTIER.
            </h2>
            <div className="w-20 h-[2px] bg-accent mb-12" />
            
            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p className="text-lg font-medium text-black">
                Architecture is the core of our business; BIM and Revit are the precision tools that bring it to life.
              </p>
              <p>
                With over 20 years of experience, I lead MODO Design with a focus on high-end architectural projects. Since 2006, we have been a reference in Miami for firms seeking a perfect balance between creative design and technical execution.
              </p>
              <p>
                Our philosophy is simple: design first. We use advanced Building Information Modeling (BIM) not as an end, but as a means to ensure that our architectural visions are buildable, coordinated, and optimized for the highest standards of luxury and corporate excellence.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-12 mt-16">
              <div>
                <span className="text-4xl font-bold block mb-2">20+</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-accent">Years Experience</span>
              </div>
              <div>
                <span className="text-4xl font-bold block mb-2">500+</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-accent">Projects Delivered</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
              <img 
                src="/rodrigo-cottier.png" 
                alt="Rodrigo Cottier"
                className="w-full h-full object-cover grayscale brightness-110 contrast-105"
              />
              <div className="absolute inset-0 border-[20px] border-white/10" />
            </div>
            
            {/* Floating Technical Badge */}
            <div className="absolute -bottom-10 -left-10 bg-black text-white p-10 hidden md:block">
              <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-accent block mb-2">Core Business</span>
              <span className="text-xl font-bold tracking-tighter">ARCHITECTURAL DESIGN</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
