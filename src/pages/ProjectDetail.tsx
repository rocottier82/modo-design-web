import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { projects as staticProjects } from '../data/projects';

export const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProject = async () => {
      try {
        // First check static projects
        const staticProject = staticProjects.find(p => p.slug === slug);
        if (staticProject) {
          setProject(staticProject);
          setLoading(false);
          return;
        }

        // Then check Firestore
        const q = query(collection(db, 'projects'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setProject(querySnapshot.docs[0].data());
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-accent" /></div>;

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Link to="/" className="text-accent hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="container mx-auto px-6">
        <Link 
          to="/" 
          className="inline-flex items-center text-xs uppercase tracking-widest font-bold hover:text-accent transition-colors mb-12 group"
        >
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Portfolio
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-accent text-xs font-bold tracking-[0.4em] uppercase mb-4 block">
              {project.type}
            </span>
            <h1 className="text-5xl md:text-7xl mb-8 leading-tight">
              {project.title.split(' ').map((word, i) => (
                <span key={i} className="block">{word}</span>
              ))}
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-12 max-w-lg">
              {project.description}
            </p>

            <div className="grid grid-cols-2 gap-8">
              {project.details.map((detail, i) => (
                <div key={i} className="border-l border-gray-100 pl-6 py-2">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-1">
                    {detail.label}
                  </span>
                  <span className="text-sm font-semibold text-black">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative aspect-[4/5] overflow-hidden rounded-sm"
          >
            <img 
              src={project.image} 
              alt={project.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>

        <div className="space-y-12">
          <h2 className="text-3xl font-light tracking-tight">PROJECT GALLERY.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.gallery.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="aspect-square overflow-hidden group"
              >
                <img 
                  src={img} 
                  alt={`${project.title} gallery ${i}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
