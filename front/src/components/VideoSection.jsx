import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function getFullVideoUrl(url, apiBase) {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('http') || url.startsWith('https')) return url;
  return `${apiBase}${url}`;
}

// Helper: convert any video link to embeddable URL
function getEmbedUrl(url) {
  if (!url) return null;

  // YouTube watch?v=
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  // YouTube shorts
  const ytShort = url.match(/youtube\.com\/shorts\/([^?/]+)/);
  if (ytShort) return `https://www.youtube.com/embed/${ytShort[1]}`;

  // TikTok
  const ttMatch = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
  if (ttMatch) return `https://www.tiktok.com/embed/v2/${ttMatch[1]}`;

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  return null; // direct link, open in new tab
}

function getVideoType(url) {
  if (!url) return 'unknown';
  if (url.startsWith('data:video') || url.startsWith('/uploads')) return 'Uploaded File';
  if (/youtube\.com|youtu\.be/.test(url)) return 'YouTube';
  if (/tiktok\.com/.test(url)) return 'TikTok';
  if (/vimeo\.com/.test(url)) return 'Vimeo';
  return 'Link';
}

export default function VideoSection() {
  const { API_BASE_URL } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const fetchVideos = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/videos`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setVideos(data);
          try { localStorage.setItem('portfolio_local_videos', JSON.stringify(data)); } catch (e) {}
        } else {
          const local = localStorage.getItem('portfolio_local_videos');
          setVideos(local ? JSON.parse(local) : (Array.isArray(data) ? data : []));
        }
        setLoading(false);
      })
      .catch(() => {
        const local = localStorage.getItem('portfolio_local_videos');
        setVideos(local ? JSON.parse(local) : []);
        setLoading(false);
      });
  };

  useEffect(() => { fetchVideos(); }, []);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setSelectedVideo(null); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const toolColors = {
    CapCut: '#00c4cc',
    'Premiere Pro': '#ea77ff',
    'After Effects': '#9999ff',
    DaVinci: '#ff6b35',
    iMovie: '#4fc3f7',
    Other: '#94a3b8'
  };

  return (
    <section id="videos" style={{ marginBottom: '80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontSize: '28px', fontWeight: '700' }}>
          <span className="gradient-text">🎬 Video Editing Works</span>
        </h2>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '6px 16px', borderRadius: '20px',
          background: 'rgba(0, 196, 204, 0.1)', border: '1px solid rgba(0, 196, 204, 0.35)',
          fontSize: '13px', fontWeight: '700', color: '#00c4cc'
        }}>
          🎞️ CapCut & More
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-sub)' }}>
          Loading videos...
        </div>
      )}

      {!loading && videos.length === 0 && (
        <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</div>
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>No Videos Yet</h3>
          <p style={{ color: 'var(--text-sub)', fontSize: '14px' }}>
            Video editing works will appear here once added by admin.
          </p>
        </div>
      )}

      {!loading && videos.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '22px'
        }}>
          {videos.map((video) => {
            const embedUrl = getEmbedUrl(video.videoUrl);
            const type = getVideoType(video.videoUrl);
            const toolColor = toolColors[video.tool] || toolColors.Other;
            const fullVideoUrl = getFullVideoUrl(video.videoUrl, API_BASE_URL);
            const fullThumbUrl = getFullVideoUrl(video.thumbnailUrl, API_BASE_URL);
            return (
              <div
                key={video._id}
                className="glass-card"
                style={{
                  overflow: 'hidden', display: 'flex', flexDirection: 'column',
                  cursor: 'pointer', transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
                onClick={() => setSelectedVideo(video)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,196,204,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                {/* Thumbnail / preview */}
                <div style={{
                  position: 'relative', width: '100%', height: '185px',
                  background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {fullThumbUrl && (
                    <img
                      src={fullThumbUrl}
                      alt={video.title}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  )}
                  {/* Dark overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.35)'
                  }} />
                  {/* Play button */}
                  <div style={{
                    position: 'relative', zIndex: 2,
                    width: '56px', height: '56px', borderRadius: '50%',
                    background: 'rgba(0,196,204,0.9)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 24px rgba(0,196,204,0.6)',
                    transition: 'transform 0.2s ease'
                  }}>
                    <span style={{ fontSize: '22px', marginLeft: '4px' }}>▶</span>
                  </div>
                  {/* Platform badge */}
                  <div style={{
                    position: 'absolute', top: '10px', right: '10px', zIndex: 3,
                    padding: '3px 10px', borderRadius: '12px',
                    background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.15)',
                    fontSize: '11px', fontWeight: '700', color: '#fff'
                  }}>
                    {type}
                  </div>
                </div>

                {/* Info */}
                <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0, lineHeight: '1.3', color: 'var(--text-main)' }}>
                    {video.title}
                  </h3>
                  {video.description && (
                    <p style={{ fontSize: '13px', color: 'var(--text-sub)', lineHeight: '1.6', margin: 0 }}>
                      {video.description}
                    </p>
                  )}
                  {/* Tool badge */}
                  <div style={{ marginTop: 'auto' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      padding: '4px 12px', borderRadius: '20px',
                      background: `${toolColor}18`, border: `1px solid ${toolColor}55`,
                      fontSize: '12px', fontWeight: '700', color: toolColor
                    }}>
                      ✂️ {video.tool || 'CapCut'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== VIDEO MODAL ===== */}
      {selectedVideo && (
        <div
          onClick={() => setSelectedVideo(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px', animation: 'videoFadeIn 0.2s ease'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative', width: '100%', maxWidth: '900px',
              background: 'rgba(13,17,23,0.98)', borderRadius: '20px',
              border: '1px solid rgba(0,196,204,0.3)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
              overflow: 'hidden', animation: 'videoSlideUp 0.25s ease'
            }}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedVideo(null)}
              style={{
                position: 'absolute', top: '14px', right: '14px', zIndex: 10,
                background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '50%', width: '36px', height: '36px',
                cursor: 'pointer', color: '#fff', fontSize: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >✕</button>

            {/* Embed, native video, or fallback */}
            {selectedVideo.videoUrl?.startsWith('data:video') || selectedVideo.videoUrl?.startsWith('/uploads') ? (
              <div style={{ background: '#000', display: 'flex', justifyContent: 'center', width: '100%', lineHeight: 0 }}>
                <video
                  src={getFullVideoUrl(selectedVideo.videoUrl, API_BASE_URL)}
                  controls
                  autoPlay
                  style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', display: 'block' }}
                />
              </div>
            ) : getEmbedUrl(selectedVideo.videoUrl) ? (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src={getEmbedUrl(selectedVideo.videoUrl)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute', top: 0, left: 0,
                    width: '100%', height: '100%', border: 'none'
                  }}
                  title={selectedVideo.title}
                />
              </div>
            ) : (
              <div style={{ padding: '60px', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-sub)', marginBottom: '20px' }}>
                  This video link cannot be embedded. Open it directly:
                </p>
                <a
                  href={selectedVideo.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '12px 24px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #00c4cc, #0095a8)',
                    color: '#fff', fontWeight: '700', textDecoration: 'none'
                  }}
                >
                  🔗 Open Video
                </a>
              </div>
            )}

            {/* Info bar */}
            <div style={{
              padding: '18px 24px', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px'
            }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 4px', color: '#fff' }}>
                  {selectedVideo.title}
                </h3>
                {selectedVideo.description && (
                  <p style={{ fontSize: '13px', color: 'var(--text-sub)', margin: 0 }}>
                    {selectedVideo.description}
                  </p>
                )}
              </div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', borderRadius: '20px',
                background: 'rgba(0,196,204,0.12)', border: '1px solid rgba(0,196,204,0.35)',
                fontSize: '13px', fontWeight: '700', color: '#00c4cc'
              }}>
                ✂️ {selectedVideo.tool || 'CapCut'}
              </span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes videoFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes videoSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </section>
  );
}
