import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-black">
      {/* Background Image with BIM Grid Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale"
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="absolute inset-0 bim-grid opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-accent text-xs md:text-sm font-bold tracking-[0.4em] uppercase mb-4 block">
              Architectural Design & Technical Excellence
            </span>
            <h1 className="text-5xl md:text-8xl text-white leading-[0.9] mb-8">
              DESIGN <br />
              <span className="text-accent/50 italic font-light">DRIVEN BY</span> <br />
              PRECISION.
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-gray-400 text-lg md:text-xl max-w-xl mb-12 font-light leading-relaxed"
          >
            Crafting sophisticated architectural spaces through advanced BIM and Revit methodologies. 
            20 years of design leadership in the Miami luxury and corporate market.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <a 
              href="#portfolio" 
              className="bg-white text-black px-10 py-5 text-xs font-bold uppercase tracking-widest hover:bg-accent transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              View Portfolio
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#contact" 
              className="border border-white/30 text-white px-10 py-5 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
            >
              Get in Touch
            </a>
          </motion.div>
        </div>
      </div>

      {/* Vertical Rail Text */}
      <div className="absolute right-10 bottom-10 hidden lg:block">
        <span className="text-[10px] text-white/20 uppercase tracking-[1em] [writing-mode:vertical-rl] rotate-180">
          MIAMI • EST 2006 • ARCHITECTURAL DESIGN
        </span>
      </div>
    </section>
  );
};
