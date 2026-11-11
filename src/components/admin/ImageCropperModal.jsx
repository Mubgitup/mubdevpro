import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Move, 
  Crop, 
  Check, 
  RefreshCw,
  Maximize2
} from 'lucide-react';

export const ASPECT_RATIOS = [
  { label: '4:5 (Hero Tall)', value: 4 / 5, key: '4:5' },
  { label: '1:1 (Square / Avatar)', value: 1 / 1, key: '1:1' },
  { label: '16:9 (Project Wide)', value: 16 / 9, key: '16:9' },
  { label: '4:3 (Certificate)', value: 4 / 3, key: '4:3' },
  { label: 'Free Aspect', value: null, key: 'free' }
];

export const ImageCropperModal = ({
  isOpen,
  onClose,
  imageSrc,
  initialAspectRatio = 4 / 5,
  title = 'Crop & Adjust Image',
  onCropComplete
}) => {
  const [selectedRatio, setSelectedRatio] = useState(initialAspectRatio);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [previewDataUrl, setPreviewDataUrl] = useState('');

  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const previewCanvasRef = useRef(null);

  // Reset controls when a new image or modal opens
  useEffect(() => {
    if (isOpen && imageSrc) {
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
      setImageLoaded(false);
      setSelectedRatio(initialAspectRatio);
    }
  }, [isOpen, imageSrc, initialAspectRatio]);

  // Handle Drag Start
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ 
        x: e.touches[0].clientX - offset.x, 
        y: e.touches[0].clientY - offset.y 
      });
    }
  };

  // Handle Dragging
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Reset transforms
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  // Rotate 90 degrees clockwise
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Generate cropped output blob and data URL
  const generateCroppedImage = useCallback((asBlob = true) => {
    return new Promise((resolve) => {
      const img = imgRef.current;
      if (!img || !containerRef.current) return resolve(null);

      const cropBox = containerRef.current.getBoundingClientRect();
      const outputWidth = 1000;
      const effectiveRatio = selectedRatio || (img.naturalWidth / img.naturalHeight);
      const outputHeight = Math.round(outputWidth / effectiveRatio);

      const canvas = document.createElement('canvas');
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#020817';
      ctx.fillRect(0, 0, outputWidth, outputHeight);

      // Translate to canvas center
      ctx.save();
      ctx.translate(outputWidth / 2, outputHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      // Calculate scale mapping from displayed cropBox to output canvas
      const scaleX = outputWidth / cropBox.width;
      const scaleY = outputHeight / cropBox.height;

      // Apply offset and zoom
      const drawX = offset.x * scaleX;
      const drawY = offset.y * scaleY;

      // Compute draw dimensions preserving aspect ratio
      const imgAspect = img.naturalWidth / img.naturalHeight;
      let targetW, targetH;

      if (imgAspect > effectiveRatio) {
        targetH = outputHeight * zoom;
        targetW = targetH * imgAspect;
      } else {
        targetW = outputWidth * zoom;
        targetH = targetW / imgAspect;
      }

      ctx.drawImage(img, drawX - targetW / 2, drawY - targetH / 2, targetW, targetH);
      ctx.restore();

      if (asBlob) {
        canvas.toBlob((blob) => {
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          resolve({ blob, dataUrl });
        }, 'image/jpeg', 0.92);
      } else {
        resolve({ dataUrl: canvas.toDataURL('image/jpeg', 0.85) });
      }
    });
  }, [selectedRatio, zoom, rotation, offset]);

  // Update live preview thumbnail whenever crop parameters change
  useEffect(() => {
    if (!imageLoaded) return;
    const timeout = setTimeout(async () => {
      const res = await generateCroppedImage(false);
      if (res?.dataUrl) {
        setPreviewDataUrl(res.dataUrl);
      }
    }, 120);

    return () => clearTimeout(timeout);
  }, [imageLoaded, selectedRatio, zoom, rotation, offset, generateCroppedImage]);

  // Handle Apply Crop
  const handleApplyCrop = async () => {
    const res = await generateCroppedImage(true);
    if (!res) return;

    const file = new File([res.blob], 'cropped_image.jpg', { type: 'image/jpeg' });
    onCropComplete({
      blob: res.blob,
      file: file,
      dataUrl: res.dataUrl
    });
    onClose();
  };

  // Skip cropping and use original
  const handleUseOriginal = () => {
    onCropComplete({
      blob: null,
      file: null,
      dataUrl: imageSrc,
      useOriginal: true
    });
    onClose();
  };

  if (!isOpen || !imageSrc) return null;

  // Calculate crop window dimensions based on selected ratio
  const maxCropWidth = 420;
  const maxCropHeight = 360;
  let cropWidth = maxCropWidth;
  let cropHeight = maxCropHeight;

  if (selectedRatio) {
    if (selectedRatio > 1) {
      cropWidth = maxCropWidth;
      cropHeight = Math.round(cropWidth / selectedRatio);
      if (cropHeight > maxCropHeight) {
        cropHeight = maxCropHeight;
        cropWidth = Math.round(cropHeight * selectedRatio);
      }
    } else {
      cropHeight = maxCropHeight;
      cropWidth = Math.round(cropHeight * selectedRatio);
      if (cropWidth > maxCropWidth) {
        cropWidth = maxCropWidth;
        cropHeight = Math.round(cropWidth / selectedRatio);
      }
    }
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(2, 8, 23, 0.88)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1rem',
      animation: 'fadeIn 0.2s ease-in-out'
    }}>
      <div 
        className="admin-card"
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          borderRadius: '14px',
          border: '1px solid rgba(0, 217, 255, 0.35)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 217, 255, 0.15)'
        }}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid rgba(0, 217, 255, 0.15)',
          background: 'rgba(7, 27, 61, 0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Crop size={20} color="var(--color-neon-cyan)" />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', margin: 0 }}>
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ padding: '0.35rem', borderRadius: '8px' }}
            title="Close Cropper"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body: Aspect Ratio Selector + Canvas Editor + Live Preview */}
        <div style={{ padding: '1.25rem', overflowY: 'auto', flex: 1 }}>
          
          {/* 1. Aspect Ratio Presets */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(245, 248, 255, 0.6)', marginBottom: '0.45rem', fontWeight: 600 }}>
              Select Aspect Ratio
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {ASPECT_RATIOS.map((item) => {
                const isActive = (selectedRatio === item.value) || (!selectedRatio && item.value === null);
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setSelectedRatio(item.value);
                      setOffset({ x: 0, y: 0 });
                    }}
                    style={{
                      background: isActive 
                        ? 'linear-gradient(135deg, rgba(8, 123, 255, 0.35) 0%, rgba(0, 217, 255, 0.25) 100%)' 
                        : 'rgba(2, 8, 23, 0.6)',
                      border: `1px solid ${isActive ? 'var(--color-neon-cyan)' : 'rgba(0, 217, 255, 0.2)'}`,
                      color: isActive ? '#fff' : 'rgba(245, 248, 255, 0.7)',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: isActive ? 600 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Main Cropping Canvas & Live Preview Side-by-Side */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 1fr) 180px',
            gap: '1.25rem',
            alignItems: 'center'
          }}>
            {/* Interactive Crop Frame */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(2, 8, 23, 0.95)',
              borderRadius: '10px',
              border: '1px dashed rgba(0, 217, 255, 0.3)',
              padding: '1rem',
              minHeight: '380px',
              position: 'relative',
              overflow: 'hidden',
              userSelect: 'none'
            }}>
              {/* Crop Box Window */}
              <div
                ref={containerRef}
                style={{
                  width: `${cropWidth}px`,
                  height: `${cropHeight}px`,
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: selectedRatio === 1 ? '12px' : '8px',
                  border: '2px solid var(--color-neon-cyan)',
                  boxShadow: '0 0 20px rgba(0, 217, 255, 0.35)',
                  cursor: isDragging ? 'grabbing' : 'grab'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleDragEnd}
              >
                {/* Image being cropped */}
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Source"
                  onLoad={() => setImageLoaded(true)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${zoom})`,
                    transformOrigin: 'center center',
                    maxWidth: 'none',
                    maxHeight: 'none',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    pointerEvents: 'none',
                    transition: isDragging ? 'none' : 'transform 0.05s ease-out'
                  }}
                  draggable={false}
                />

                {/* Rule of Thirds Grid Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gridTemplateRows: '1fr 1fr 1fr',
                  border: '1px solid rgba(0, 217, 255, 0.25)'
                }}>
                  <div style={{ borderRight: '1px dashed rgba(0, 217, 255, 0.25)', borderBottom: '1px dashed rgba(0, 217, 255, 0.25)' }} />
                  <div style={{ borderRight: '1px dashed rgba(0, 217, 255, 0.25)', borderBottom: '1px dashed rgba(0, 217, 255, 0.25)' }} />
                  <div style={{ borderBottom: '1px dashed rgba(0, 217, 255, 0.25)' }} />
                  <div style={{ borderRight: '1px dashed rgba(0, 217, 255, 0.25)', borderBottom: '1px dashed rgba(0, 217, 255, 0.25)' }} />
                  <div style={{ borderRight: '1px dashed rgba(0, 217, 255, 0.25)', borderBottom: '1px dashed rgba(0, 217, 255, 0.25)' }} />
                  <div style={{ borderBottom: '1px dashed rgba(0, 217, 255, 0.25)' }} />
                  <div style={{ borderRight: '1px dashed rgba(0, 217, 255, 0.25)' }} />
                  <div style={{ borderRight: '1px dashed rgba(0, 217, 255, 0.25)' }} />
                  <div />
                </div>

                {/* Move Indicator Icon overlay */}
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  background: 'rgba(2, 8, 23, 0.75)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.68rem',
                  color: 'var(--color-neon-cyan)',
                  pointerEvents: 'none'
                }}>
                  <Move size={11} /> Drag to adjust
                </div>
              </div>
            </div>

            {/* Live Result Preview Sidebar */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'rgba(7, 27, 61, 0.4)',
              borderRadius: '10px',
              padding: '1rem',
              border: '1px solid rgba(0, 217, 255, 0.15)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(245, 248, 255, 0.6)', marginBottom: '0.65rem', fontWeight: 600 }}>
                Live Result Preview
              </div>

              <div style={{
                width: '140px',
                height: selectedRatio ? `${Math.round(140 / selectedRatio)}px` : '140px',
                maxHeight: '180px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid rgba(0, 217, 255, 0.4)',
                background: '#020817',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {previewDataUrl ? (
                  <img
                    src={previewDataUrl}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ fontSize: '0.7rem', color: 'rgba(245, 248, 255, 0.4)' }}>
                    Rendering...
                  </span>
                )}
              </div>

              <div style={{ fontSize: '0.72rem', color: 'rgba(245, 248, 255, 0.5)' }}>
                Exact presentation format on website
              </div>
            </div>
          </div>

          {/* 3. Zoom & Rotation Controls Toolbar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginTop: '1.25rem',
            padding: '0.75rem 1rem',
            background: 'rgba(2, 8, 23, 0.6)',
            borderRadius: '10px',
            border: '1px solid rgba(0, 217, 255, 0.15)'
          }}>
            {/* Zoom Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: '1 1 240px' }}>
              <button
                type="button"
                onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.1))}
                className="admin-btn admin-btn-secondary admin-btn-sm"
                title="Zoom Out"
              >
                <ZoomOut size={15} />
              </button>

              <input
                type="range"
                min="0.5"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--color-neon-cyan)' }}
              />

              <button
                type="button"
                onClick={() => setZoom((prev) => Math.min(3, prev + 0.1))}
                className="admin-btn admin-btn-secondary admin-btn-sm"
                title="Zoom In"
              >
                <ZoomIn size={15} />
              </button>

              <span style={{ fontSize: '0.78rem', color: 'var(--color-neon-cyan)', fontFamily: 'var(--font-mono)', minWidth: '38px' }}>
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Rotation & Reset Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={handleRotate}
                className="admin-btn admin-btn-secondary admin-btn-sm"
                title="Rotate 90 degrees"
              >
                <RotateCw size={14} />
                <span style={{ marginLeft: '0.35rem' }}>Rotate</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="admin-btn admin-btn-secondary admin-btn-sm"
                title="Reset Position & Zoom"
              >
                <RefreshCw size={14} />
                <span style={{ marginLeft: '0.35rem' }}>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.25rem',
          borderTop: '1px solid rgba(0, 217, 255, 0.15)',
          background: 'rgba(7, 27, 61, 0.5)'
        }}>
          <button
            type="button"
            onClick={handleUseOriginal}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            title="Use the uncropped original image"
          >
            Use Original (No Crop)
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              className="admin-btn admin-btn-secondary"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApplyCrop}
              className="admin-btn admin-btn-primary"
            >
              <Check size={16} />
              <span style={{ marginLeft: '0.35rem', fontWeight: 600 }}>Crop &amp; Apply Image</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
