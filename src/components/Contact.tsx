import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-black text-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <span className="text-accent text-xs font-bold tracking-[0.4em] uppercase mb-4 block">Get in Touch</span>
            <h2 className="text-5xl md:text-7xl mb-12 leading-none">LET'S BUILD <br /> TOGETHER.</h2>
            
            <div className="space-y-10">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 border border-white/20 flex items-center justify-center shrink-0">
                  <Mail size={20} className="text-accent" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-1">Email</h4>
                  <p className="text-lg font-medium">rodrigo@mododesign.org</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 border border-white/20 flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-accent" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-1">Phone</h4>
                  <p className="text-lg font-medium">+1 (305) 000-0000</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 border border-white/20 flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-accent" />
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-1">Location</h4>
                  <p className="text-lg font-medium">Miami, Florida</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-10 md:p-16 border border-white/10">
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-transparent border-b border-white/20 py-3 focus:border-accent outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full bg-transparent border-b border-white/20 py-3 focus:border-accent outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Subject</label>
                <input 
                  type="text" 
                  className="w-full bg-transparent border-b border-white/20 py-3 focus:border-accent outline-none transition-colors"
                  placeholder="Project Inquiry"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Message</label>
                <textarea 
                  rows={4}
                  className="w-full bg-transparent border-b border-white/20 py-3 focus:border-accent outline-none transition-colors resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <button className="w-full bg-white text-black py-5 text-xs font-bold uppercase tracking-widest hover:bg-accent transition-all duration-300 flex items-center justify-center gap-3 group">
                Send Message
                <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
