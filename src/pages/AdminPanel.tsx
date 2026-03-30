import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, getDocs, query, where, deleteDoc, doc, updateDoc, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, auth, loginWithGoogle, logout } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Upload, LogOut, LogIn, CheckCircle2, AlertCircle, Loader2, Edit2, X, Users } from 'lucide-react';

export const AdminPanel = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [projectUploading, setProjectUploading] = useState(false);
  const [clientUploading, setClientUploading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [clientFormData, setClientFormData] = useState({
    name: '',
    logo: ''
  });
  const [clientLogoFile, setClientLogoFile] = useState<File | null>(null);
  const clientInputRef = React.useRef<HTMLInputElement>(null);
  const mainImageInputRef = React.useRef<HTMLInputElement>(null);
  const galleryInputRef = React.useRef<HTMLInputElement>(null);

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

  const fetchProjects = async () => {
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(fetched);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchClients = async () => {
    try {
      const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetched = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClients(fetched);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u && u.email?.toLowerCase() === ADMIN_EMAIL) {
        fetchProjects();
        fetchClients();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleEdit = (project: any) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      slug: project.slug,
      type: project.type,
      tools: project.tools || '',
      location: project.location || '',
      description: project.description,
      details: project.details || [
        { label: 'Client', value: '' },
        { label: 'Year', value: '' },
        { label: 'Area', value: '' },
        { label: 'Status', value: '' }
      ]
    });
    setMainImage(null);
    setGalleryImages(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
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
  };

  const handleDelete = async () => {
    if (!editingId || !user) return;
    setProjectUploading(true);
    try {
      await deleteDoc(doc(db, 'projects', editingId));
      setMessage({ type: 'success', text: 'Project deleted successfully.' });
      resetForm();
      setShowDeleteConfirm(false);
      fetchProjects();
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Error deleting project: ' + error.message });
    } finally {
      setProjectUploading(false);
    }
  };

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
    const uniqueName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const storageRef = ref(storage, `${path}/${uniqueName}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL) return;
    if (!clientLogoFile && !clientFormData.logo) {
      setMessage({ type: 'error', text: 'Please upload a client logo.' });
      return;
    }

    setClientUploading(true);
    try {
      let logoUrl = clientFormData.logo;
      if (clientLogoFile) {
        logoUrl = await uploadFile(clientLogoFile, 'clients');
      }

      await addDoc(collection(db, 'clients'), {
        name: clientFormData.name,
        logo: logoUrl,
        createdAt: serverTimestamp()
      });

      setMessage({ type: 'success', text: 'Client added successfully!' });
      setClientFormData({ name: '', logo: '' });
      setClientLogoFile(null);
      if (clientInputRef.current) clientInputRef.current.value = '';
      fetchClients();
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Error adding client: ' + error.message });
    } finally {
      setClientUploading(false);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL) return;
    if (!window.confirm('Are you sure you want to delete this client?')) return;

    setClientUploading(true);
    try {
      await deleteDoc(doc(db, 'clients', clientId));
      setMessage({ type: 'success', text: 'Client removed successfully.' });
      fetchClients();
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Error removing client: ' + error.message });
    } finally {
      setClientUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL) {
      setMessage({ type: 'error', text: 'Unauthorized: Only the admin can add projects.' });
      return;
    }

    if (!mainImage && !editingId) {
      setMessage({ type: 'error', text: 'Please upload a main image.' });
      return;
    }

    setProjectUploading(true);
    setMessage(null);

    try {
      // 1. Check if slug exists (only for new projects)
      if (!editingId) {
        const q = query(collection(db, 'projects'), where('slug', '==', formData.slug));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          throw new Error('A project with this slug already exists.');
        }
      }

      // 2. Upload Main Image if provided
      let mainImageUrl = '';
      if (mainImage) {
        mainImageUrl = await uploadFile(mainImage, 'main');
      }

      // 3. Upload Gallery Images if provided
      const galleryUrls: string[] = [];
      if (galleryImages) {
        for (let i = 0; i < galleryImages.length; i++) {
          const url = await uploadFile(galleryImages[i], 'gallery');
          galleryUrls.push(url);
        }
      }

      // 4. Save/Update to Firestore
      const projectData: any = {
        ...formData,
        updatedAt: serverTimestamp()
      };

      if (mainImageUrl) projectData.image = mainImageUrl;
      if (galleryUrls.length > 0) projectData.gallery = galleryUrls;

      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), projectData);
        setMessage({ type: 'success', text: 'Project updated successfully!' });
      } else {
        projectData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'projects'), projectData);
        setMessage({ type: 'success', text: 'Project added successfully!' });
      }

      resetForm();
      if (mainImageInputRef.current) mainImageInputRef.current.value = '';
      if (galleryInputRef.current) galleryInputRef.current.value = '';
      fetchProjects();
    } catch (error: any) {
      console.error(error);
      setMessage({ type: 'error', text: error.message || 'Failed to save project.' });
    } finally {
      setProjectUploading(false);
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
          <h1 className="text-4xl font-bold tracking-tight">
            {editingId ? 'EDIT PROJECT.' : 'ADD NEW PROJECT.'}
          </h1>
          <div className="flex items-center gap-6">
            {editingId && (
              <button 
                onClick={resetForm}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
              >
                <X size={14} />
                Cancel Edit
              </button>
            )}
            <button onClick={logout} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-10 shadow-xl space-y-8 mb-24">
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
              <div className="flex items-center gap-4">
                {mainImage ? (
                  <div className="relative w-20 h-20 bg-gray-100 rounded-sm overflow-hidden border border-gray-200">
                    <img 
                      src={URL.createObjectURL(mainImage)} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button 
                      type="button"
                      onClick={() => setMainImage(null)}
                      className="absolute top-1 right-1 p-1 bg-white/80 text-red-500 hover:bg-white rounded-full shadow-sm transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ) : editingId && projects.find(p => p.id === editingId)?.image && (
                  <div className="w-20 h-20 bg-gray-100 rounded-sm overflow-hidden border border-gray-200 opacity-50">
                    <img 
                      src={projects.find(p => p.id === editingId)?.image} 
                      alt="Current" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <input 
                  ref={mainImageInputRef}
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setMainImage(e.target.files?.[0] || null)}
                  className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-gray-100 file:text-black hover:file:bg-gray-200 cursor-pointer flex-1"
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 flex items-center gap-2">
                <Plus size={14} />
                Gallery Images
              </label>
              <div className="space-y-4">
                {galleryImages && galleryImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-sm border border-gray-100">
                    {(Array.from(galleryImages) as File[]).map((file, idx) => (
                      <div key={idx} className="relative w-16 h-16 bg-white border border-gray-200 rounded-sm overflow-hidden">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={`Gallery ${idx}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    <button 
                      type="button"
                      onClick={() => {
                        setGalleryImages(null);
                        if (galleryInputRef.current) galleryInputRef.current.value = '';
                      }}
                      className="w-16 h-16 border border-dashed border-gray-300 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                      title="Clear Gallery"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                <input 
                  ref={galleryInputRef}
                  type="file" 
                  multiple
                  accept="image/*"
                  onChange={(e) => setGalleryImages(e.target.files)}
                  className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-gray-100 file:text-black hover:file:bg-gray-200 cursor-pointer w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button 
              type="submit"
              disabled={projectUploading}
              className={`flex-1 py-5 font-bold uppercase tracking-[0.3em] text-xs transition-all ${
                projectUploading ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-accent'
              }`}
            >
              {projectUploading ? (
                <span className="flex items-center justify-center gap-3">
                  <Loader2 className="animate-spin" size={16} />
                  Saving Project...
                </span>
              ) : editingId ? 'Update Project' : 'Publish Project'}
            </button>

            {editingId && (
              <button 
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-8 py-5 border border-red-100 text-red-500 font-bold uppercase tracking-[0.3em] text-xs hover:bg-red-50 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </button>
            )}
          </div>
        </form>

        {/* Client Management Section */}
        <div className="bg-white p-10 shadow-xl space-y-8 mb-24 border-t-4 border-accent">
          <div className="flex items-center gap-3 mb-4">
            <Users size={24} className="text-accent" />
            <h2 className="text-2xl font-bold tracking-tight">MANAGE CLIENTS.</h2>
          </div>
          
          <form onSubmit={handleClientSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Client Name</label>
              <input 
                required
                value={clientFormData.name}
                onChange={(e) => setClientFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border-b border-gray-200 py-2 focus:border-accent outline-none transition-colors"
                placeholder="e.g. Miami Real Estate Group"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Client Logo</label>
              <div className="flex items-center gap-4">
                {clientLogoFile && (
                  <div className="relative w-12 h-12 bg-gray-50 rounded-sm overflow-hidden border border-gray-100 flex items-center justify-center p-1">
                    <img 
                      src={URL.createObjectURL(clientLogoFile)} 
                      alt="Logo Preview" 
                      className="max-w-full max-h-full object-contain"
                    />
                    <button 
                      type="button"
                      onClick={() => setClientLogoFile(null)}
                      className="absolute -top-1 -right-1 p-1 bg-white text-red-500 shadow-sm hover:bg-red-50 rounded-full"
                    >
                      <X size={8} />
                    </button>
                  </div>
                )}
                <input 
                  ref={clientInputRef}
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setClientLogoFile(e.target.files?.[0] || null)}
                  className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:bg-gray-100 file:text-black hover:file:bg-gray-200 cursor-pointer w-full"
                />
              </div>
            </div>
            <button 
              type="submit"
              disabled={clientUploading}
              className="bg-black text-white py-4 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-accent transition-all disabled:bg-gray-100 disabled:text-gray-400 min-w-[140px]"
            >
              {clientUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={12} />
                  Adding...
                </span>
              ) : 'Add Client'}
            </button>
          </form>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-gray-50">
            {clients.map((client) => (
              <div key={client.id} className="group relative bg-gray-50 p-6 flex items-center justify-center h-32 rounded-sm border border-transparent hover:border-accent transition-all">
                <img src={client.logo} alt={client.name} className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all" />
                <button 
                  onClick={() => handleDeleteClient(client.id)}
                  className="absolute top-2 right-2 p-1.5 bg-white text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 rounded-sm"
                  title="Remove Client"
                >
                  <Trash2 size={14} />
                </button>
                <div className="absolute bottom-2 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[8px] uppercase font-bold tracking-widest text-gray-400">{client.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project List */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold tracking-tight">EXISTING PROJECTS.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-white p-6 shadow-md flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 overflow-hidden">
                    <img src={project.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">{project.title}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400">{project.type}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleEdit(project)}
                  className="p-2 text-gray-300 hover:text-accent transition-colors"
                >
                  <Edit2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-10 max-w-md w-full shadow-2xl text-center"
              >
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trash2 size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">Are you sure?</h3>
                <p className="text-gray-500 mb-8">This action cannot be undone. The project will be permanently removed from your portfolio.</p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-4 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDelete}
                    className="flex-1 py-4 bg-red-500 text-white text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-colors"
                  >
                    Yes, Delete
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
