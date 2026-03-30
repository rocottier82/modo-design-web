import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

const fallbackClients = [
  { name: 'Miami Dev Group', logo: 'https://picsum.photos/seed/miami1/200/100' },
  { name: 'Brickell Architects', logo: 'https://picsum.photos/seed/brickell/200/100' },
  { name: 'Coral Gables Design', logo: 'https://picsum.photos/seed/coral/200/100' },
  { name: 'Wynwood Creative', logo: 'https://picsum.photos/seed/wynwood/200/100' },
  { name: 'Coconut Grove Partners', logo: 'https://picsum.photos/seed/coconut/200/100' },
  { name: 'South Beach Luxury', logo: 'https://picsum.photos/seed/sobe/200/100' },
  { name: 'Downtown Miami Corp', logo: 'https://picsum.photos/seed/downtown/200/100' },
  { name: 'Design District Studio', logo: 'https://picsum.photos/seed/design/200/100' },
];

export const OurClients = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setClients(fetched.length > 0 ? fetched : fallbackClients);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setClients(fallbackClients);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  if (loading) return null;

  return (
    <section className="py-24 bg-white border-y border-gray-100 overflow-hidden relative">
      <div className="container mx-auto px-6 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-accent text-xs font-bold tracking-[0.4em] uppercase mb-4 block">Partnerships</span>
          <h2 className="text-4xl md:text-6xl">OUR CLIENTS.</h2>
          <div className="w-12 h-[1px] bg-accent mx-auto mt-8" />
        </div>
      </div>

      <div className="relative flex overflow-hidden group">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{
            x: [0, -100 * clients.length],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: Math.max(20, clients.length * 4), // Dynamic duration based on count
              ease: "linear",
            },
          }}
        >
          {[...clients, ...clients, ...clients].map((client, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center px-12 grayscale hover:grayscale-0 transition-all duration-500 opacity-40 hover:opacity-100"
            >
              <img
                src={client.logo}
                alt={client.name}
                className="h-10 md:h-12 w-auto object-contain mb-3"
                referrerPolicy="no-referrer"
              />
              <span className="text-[9px] md:text-[10px] uppercase tracking-widest font-medium text-gray-400">
                {client.name}
              </span>
            </div>
          ))}
        </motion.div>
        
        {/* Gradient overlays for smooth fade */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
};
