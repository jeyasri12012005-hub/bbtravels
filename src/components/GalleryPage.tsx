import React, { useState } from 'react';
import { GalleryPhoto, GalleryCategory } from '../types/bus';
import {
  Upload,
  Layers,
  Shield,
  Trash2,
  Sparkles,
  Maximize2,
  X,
  Compass,
  Armchair,
  Check,
} from 'lucide-react';

interface GalleryPageProps {
  photos: GalleryPhoto[];
  onUploadPhoto?: (photo: GalleryPhoto) => void;
  onRemovePhoto?: (id: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  photos,
  onUploadPhoto,
  onRemovePhoto,
}) => {
  const [activeTab, setActiveTab] = useState<GalleryCategory>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload modal form state
  const [uploadCategory, setUploadCategory] = useState<'exterior' | 'interior' | 'seats'>('exterior');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const filteredPhotos = photos.filter((p) => {
    if (activeTab === 'all') return true;
    return p.category === activeTab;
  });

  const exteriorCount = photos.filter((p) => p.category === 'exterior').length;
  const interiorCount = photos.filter((p) => p.category === 'interior').length;
  const seatsCount = photos.filter((p) => p.category === 'seats').length;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) return;

    const groupMap = {
      exterior: 'A. Luxury Bus Exterior',
      interior: 'B. Premium Bus Interior',
      seats: 'C. Luxury Passenger Seats',
    };

    const newPhoto: GalleryPhoto = {
      id: `photo-${Date.now()}`,
      category: uploadCategory,
      categoryGroup: groupMap[uploadCategory],
      title: uploadTitle.trim() || `BB Travels Original ${uploadCategory.toUpperCase()} Photograph`,
      description:
        uploadDescription.trim() ||
        `Genuine photograph of BB Travels ${groupMap[uploadCategory]}.`,
      imageUrl: imagePreview,
      badge: `${uploadCategory.toUpperCase()}`,
    };

    if (onUploadPhoto) {
      onUploadPhoto(newPhoto);
    }

    setShowUploadModal(false);
    setImagePreview(null);
    setUploadTitle('');
    setUploadDescription('');
  };

  return (
    <div className="min-h-screen py-10 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Gallery Header (Black & Gold Theme) */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
          <Shield className="w-3.5 h-3.5" />
          <span>BB TRAVELS OFFICIAL FLEET GALLERY</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-serif">
          Official Gallery
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed font-medium">
          High-definition photographs of our luxury passenger bus exterior, premium interior cabin,
          and executive ergonomic seating.
        </p>

        {/* Categories Navigation Bar (A. Exterior, B. Interior, C. Seats) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-7">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/50'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Photographs ({photos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('exterior')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'exterior'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/50'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>A. Luxury Bus Exterior</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 font-mono">
              {exteriorCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('interior')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'interior'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/50'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>B. Premium Bus Interior</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 font-mono">
              {interiorCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('seats')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'seats'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/50'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Armchair className="w-3.5 h-3.5 text-amber-400" />
            <span>C. Luxury Passenger Seats</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 font-mono">
              {seatsCount}
            </span>
          </button>

          {/* Upload Button */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/40 transition flex items-center gap-1.5 cursor-pointer sm:ml-auto"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Add Genuine Photo</span>
          </button>
        </div>
      </div>

      {/* Grid of Actual Visible High-Resolution Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-amber-500/50 transition duration-300 flex flex-col cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          >
            {/* Image Container */}
            <div className="relative aspect-16/10 w-full bg-slate-950 overflow-hidden border-b border-slate-800">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (photo.fallbackUrl && img.src !== photo.fallbackUrl) {
                    img.src = photo.fallbackUrl;
                  } else if (!img.src.includes('bb_travels_bus.jpg')) {
                    img.src = '/images/bb_travels_bus.jpg';
                  }
                }}
                className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
              />

              {/* Gradient Shade Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition pointer-events-none"></div>

              {/* Category & Badge Overlay */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md border border-amber-500/40 text-[10px] font-bold text-amber-300 tracking-wide uppercase shadow-md flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{photo.badge}</span>
              </div>

              {/* Zoom Inspection Icon */}
              <div className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/80 backdrop-blur-md border border-slate-700 text-white opacity-0 group-hover:opacity-100 transition shadow-lg">
                <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
              </div>

              {/* Remove button if uploaded */}
              {onRemovePhoto && photo.id.startsWith('photo-') && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemovePhoto(photo.id);
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-950/90 border border-red-500/80 text-red-300 hover:bg-red-800 transition cursor-pointer"
                  title="Remove uploaded photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Photo Details */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest mb-1">
                  {photo.categoryGroup}
                </div>
                <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition leading-snug">
                  {photo.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {photo.description}
                </p>
              </div>

              <div className="pt-3 mt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Check className="w-3 h-3" />
                  Verified BB Fleet
                </span>
                <span className="text-amber-400/80 font-semibold">Madurai HQ</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="py-16 text-center bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-lg mx-auto mt-6">
          <p className="text-sm text-slate-300 mb-4">No photographs in this selected category.</p>
          <button
            onClick={() => setActiveTab('all')}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 cursor-pointer"
          >
            Show All Photographs ({photos.length})
          </button>
        </div>
      )}

      {/* Lightbox Modal for Full-Resolution Photo Inspection */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl overflow-hidden max-w-4xl w-full shadow-[0_0_60px_rgba(212,175,55,0.25)] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/80 hover:bg-amber-500 hover:text-slate-950 text-white transition border border-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Big Image Display */}
            <div className="relative aspect-16/10 max-h-[70vh] w-full bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const img = e.currentTarget;
                  if (selectedPhoto.fallbackUrl && img.src !== selectedPhoto.fallbackUrl) {
                    img.src = selectedPhoto.fallbackUrl;
                  } else if (!img.src.includes('bb_travels_bus.jpg')) {
                    img.src = '/images/bb_travels_bus.jpg';
                  }
                }}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Image Details Bar */}
            <div className="p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{selectedPhoto.categoryGroup}</span>
                  <span>•</span>
                  <span>{selectedPhoto.badge}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white font-serif">
                  {selectedPhoto.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  {selectedPhoto.description}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <div className="text-[11px] text-slate-400 font-mono">BB TRAVELS MADURAI</div>
                <div className="text-xs font-bold text-amber-400 font-mono mt-0.5">Fleet Reg. 2026</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Genuine Photo Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md shadow-2xl relative text-white">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Upload className="w-4 h-4 text-amber-400" />
              <span>Add BB TRAVELS Photograph</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Add genuine company photographs taken by BB Travels operators.
            </p>

            <form onSubmit={handleSaveUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setUploadCategory('exterior')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                      uploadCategory === 'exterior'
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-950 text-slate-300 border-slate-800'
                    }`}
                  >
                    A. Exterior
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadCategory('interior')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                      uploadCategory === 'interior'
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-950 text-slate-300 border-slate-800'
                    }`}
                  >
                    B. Interior
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadCategory('seats')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                      uploadCategory === 'seats'
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-950 text-slate-300 border-slate-800'
                    }`}
                  >
                    C. Seats
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Photograph Title</label>
                <input
                  type="text"
                  placeholder="e.g. BB Travels Executive Recliner"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Spacious passenger comfort with 38-inch pitch"
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={handleImageFileChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-xs text-slate-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400 cursor-pointer"
                />
              </div>

              {imagePreview && (
                <div className="w-full h-32 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!imagePreview}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 transition cursor-pointer"
                >
                  Save Photograph
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
