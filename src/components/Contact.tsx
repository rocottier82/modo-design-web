import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export const Contact = () => {
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    const payload = {
      ...formData,
      access_key: 'e5a00bd6-b72a-417f-9480-7f4beb95336b',
    };

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error connecting to the server. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

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
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Full Name</label>
                  <input 
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    type="text" 
                    className="w-full bg-transparent border-b border-white/20 py-3 focus:border-accent outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Email Address</label>
                  <input 
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email" 
                    className="w-full bg-transparent border-b border-white/20 py-3 focus:border-accent outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Subject</label>
                <input 
                  required
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  type="text" 
                  className="w-full bg-transparent border-b border-white/20 py-3 focus:border-accent outline-none transition-colors"
                  placeholder="Project Inquiry"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Message</label>
                <textarea 
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-transparent border-b border-white/20 py-3 focus:border-accent outline-none transition-colors resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full bg-accent/10 border border-accent text-accent py-5 px-6 rounded-sm flex items-center justify-center gap-3"
                >
                  <CheckCircle size={20} />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Thank you. We will get back to you shortly.
                  </span>
                </motion.div>
              ) : (
                <button 
                  disabled={isSending}
                  type="submit"
                  className="w-full bg-white text-black py-5 text-xs font-bold uppercase tracking-widest hover:bg-accent transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? 'Sending...' : 'Send Message'}
                  {!isSending && <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
