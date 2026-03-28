import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth, loginWithGoogle, logout } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { motion } from 'motion/react';
import { Plus, Trash2, Upload, LogOut, LogIn, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const AdminPanel = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    type: 'Residential',
    tools: '',
    location: '',
    description: '',
    details: [
      { label: 'Client', value: '' },
      { label: 'Year', value: '' },
      { label: 'Area', value: '' },
      { label: 'Status', value: '' }
    ]
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<FileList | null>(null);

  const ADMIN_EMAIL = 'rocottier82@gmail.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'title') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, title: value, slug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDetailChange = (index: number, value: string) => {
    const newDetails = [...formData.details];
    newDetails[index].value = value;
    setFormData(prev => ({ ...prev, details: newDetails }));
  };

  const uploadFile = async (file: File, path: string) => {
    const storageRef = ref(storage, `projects/${formData.slug}/${path}/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL) {
      setMessage({ type: 'error', text: 'Unauthorized: Only the admin can add projects.' });
      return;
    }

    if (!mainImage) {
      setMessage({ type: 'error', text: 'Please upload a main image.' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      // 1. Check if slug exists
      const q = query(collection(db, 'projects'), where('slug', '==', formData.slug));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        throw new Error('A project with this slug already exists.');
      }

      // 2. Upload Main Image
      const mainImageUrl = await uploadFile(mainImage, 'main');

      // 3. Upload Gallery Images
      const galleryUrls: string[] = [];
      if (galleryImages) {
        for (let i = 0; i < galleryImages.length; i++) {
          const url = await uploadFile(galleryImages[i], 'gallery');
          galleryUrls.push(url);
        }
      }

      // 4. Save to Firestore
      await addDoc(collection(db, 'projects'), {
        ...formData,
        image: mainImageUrl,
        gallery: galleryUrls,
        createdAt: serverTimestamp()
      });

      setMessage({ type: 'success', text: 'Project added successfully!' });
      setFormData({
        title: '',
        slug: '',
        type: 'Residential',
        tools: '',
        location: '',
        description: '',
        details: [
          { label: 'Client', value: '' },
          { label: 'Year', value: '' },
          { label: 'Area', value: '' },
          { label: 'Status', value: '' }
        ]
      });
      setMainImage(null);
      setGalleryImages(null);
    } catch (error: any) {
      console.error(error);
      setMessage({ type: 'error', text: error.message || 'Failed to add project.' });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-accent" /></div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-12 shadow-2xl rounded-sm text-center max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
          <p className="text-gray-500 mb-8">Please sign in with your authorized Google account to manage the portfolio.</p>
          <button 
            onClick={loginWithGoogle}
            className="w-full bg-black text-white py-4 rounded-sm font-bold flex items-center justify-center gap-3 hover:bg-accent transition-colors"
          >
            <LogIn size={20} />
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (user.email?.toLowerCase() !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-12 shadow-2xl rounded-sm text-center max-w-md w-full">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Unauthorized</h1>
          <p className="text-gray-500 mb-8">Access restricted to {ADMIN_EMAIL}.</p>
          <button onClick={logout} className="text-accent font-bold hover:underline">Sign Out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">ADD NEW PROJECT.</h1>
          <button onClick={logout} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
            <LogOut size={16} />
            Logout
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-10 shadow-xl space-y-8">
          {message && (
            <div className={`p-4 flex items-center gap-3 rounded-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Project Title</label>
              <input 
                required
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full border-b border-gray-200 py-2 focus:border-accent outline-none transition-colors"
                placeholder="e.g. Brickell Corporate Tower"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Slug (URL)</label>
              <input 
                readOnly
                value={formData.slug}
                className="w-full border-b border-gray-100 py-2 text-gray-400 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Type</label>
              <select 
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full border-b border-gray-200 py-2 focus:border-accent outline-none bg-transparent"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Tools</label>
              <input 
                name="tools"
                value={formData.tools}
                onChange={handleInputChange}
                className="w-full border-b border-gray-200 py-2 focus:border-accent outline-none"
                placeholder="e.g. Revit / Enscape"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Location</label>
              <input 
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full border-b border-gray-200 py-2 focus:border-accent outline-none"
                placeholder="e.g. Miami, FL"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Description</label>
            <textarea 
              required
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full border border-gray-100 p-4 focus:border-accent outline-none transition-colors resize-none"
              placeholder="Describe the architectural design and technical challenges..."
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] border-b border-gray-100 pb-2">Project Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {formData.details.map((detail, index) => (
                <div key={index} className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">{detail.label}</label>
                  <input 
                    value={detail.value}
                    onChange={(e) => handleDetailChange(index, e.target.value)}
                    className="w-full border-b border-gray-200 py-2 focus:border-accent outline-none"
                    placeholder={`Enter ${detail.label}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 flex items-center gap-2">
                <Upload size={14} />
                Main Image (Cover)
              </label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setMainImage(e.target.files?.[0] || null)}
                className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-gray-100 file:text-black hover:file:bg-gray-200 cursor-pointer"
              />
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 flex items-center gap-2">
                <Plus size={14} />
                Gallery Images
              </label>
              <input 
                type="file" 
                multiple
                accept="image/*"
                onChange={(e) => setGalleryImages(e.target.files)}
                className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-gray-100 file:text-black hover:file:bg-gray-200 cursor-pointer"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={uploading}
            className={`w-full py-5 font-bold uppercase tracking-[0.3em] text-xs transition-all ${
              uploading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-accent'
            }`}
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-3">
                <Loader2 className="animate-spin" size={16} />
                Uploading Project...
              </span>
            ) : 'Publish Project'}
          </button>
        </form>
      </div>
    </div>
  );
};
