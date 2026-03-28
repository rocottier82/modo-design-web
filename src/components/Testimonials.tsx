import React from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

export const Testimonials = () => {
  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="text-accent text-xs font-bold tracking-[0.4em] uppercase mb-4 block">Client Trust</span>
          <h2 className="text-4xl md:text-5xl">RECOGNITION.</h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-white p-12 md:p-20 shadow-2xl relative"
        >
          <Quote className="absolute top-10 left-10 text-accent/10" size={120} />
          
          <div className="relative z-10">
            <p className="text-2xl md:text-4xl font-serif italic text-gray-800 leading-relaxed mb-12 text-center">
              "Rodrigo's expertise in BIM and Revit is unparalleled. He transformed our complex design requirements into a seamless technical workflow, saving us months of coordination time."
            </p>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-[1px] bg-accent mb-6" />
              <h4 className="text-lg font-bold tracking-widest uppercase">David Morales</h4>
              <span className="text-xs text-accent uppercase tracking-widest mt-2">Principal Architect, Miami Dev Group</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
