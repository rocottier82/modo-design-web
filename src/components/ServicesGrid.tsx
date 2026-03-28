import React from 'react';
import { motion } from 'motion/react';
import { Ruler, Building2, Layers, FileCode2 } from 'lucide-react';

const services = [
  {
    title: "Architectural Design",
    description: "Comprehensive architectural solutions from concept to development, focusing on aesthetic excellence and functional integrity.",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Architectural Drafting",
    description: "High-precision technical documentation and construction sets using Revit and AutoCAD for complex projects.",
    icon: Ruler,
    image: "/drafting.jpg"
  },
  {
    title: "BIM Management",
    description: "Advanced coordination, clash detection, and data-rich modeling to optimize construction and project lifecycle.",
    icon: Layers,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop"
  }
];

export const ServicesGrid = () => {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-accent text-xs font-bold tracking-[0.4em] uppercase mb-4 block">Our Services</span>
            <h2 className="text-4xl md:text-6xl leading-tight">
              DESIGN & <br /> EXECUTION.
            </h2>
          </div>
          <p className="text-gray-500 max-w-md text-sm leading-relaxed">
            We prioritize architectural vision, utilizing BIM and Revit as powerful tools to ensure every design is executed with absolute technical precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative h-[600px] overflow-hidden bg-black"
            >
              {/* Image Background */}
              <div className="absolute inset-0 transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110 opacity-70 group-hover:opacity-90">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <div className="mb-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                  <service.icon className="text-accent mb-6" size={32} />
                  <h3 className="text-2xl text-white mb-4">{service.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {service.description}
                  </p>
                </div>
                
                <div className="h-[1px] w-12 bg-accent group-hover:w-full transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
