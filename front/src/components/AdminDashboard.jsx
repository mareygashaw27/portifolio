import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AddProjectModal from './AddProjectModal';
import EditProjectModal from './EditProjectModal';
import EditCertificateModal from './EditCertificateModal';

export default function AdminDashboard({ onExitDashboard }) {
  const { logout, getAuthHeaders, API_BASE_URL } = useAuth();
  const [activeTab, setActiveTab] = useState('projects'); // 'profile', 'projects', 'certificates', 'cv', 'videos'

  const getFullUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('http') || url.startsWith('https')) return url;
    return `${API_BASE_URL}${url}`;
  };

  // Data states
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);

  // Video states
  const [videos, setVideos] = useState([]);
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [videoForm, setVideoForm] = useState({ title: '', description: '', tool: 'CapCut', videoUrl: '', thumbnailUrl: '' });
  const [videoThumbPreview, setVideoThumbPreview] = useState('');
  const [videoInputMode, setVideoInputMode] = useState('link'); // 'link' or 'file'
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Modal states
  const [showAddProject, setShowAddProject] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showAddCert, setShowAddCert] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [certImagePreview, setCertImagePreview] = useState('');

  // ---- PROFILE STATE ----
  const [profile, setProfile] = useState({
    name: 'Marey Gashaw',
    title: 'Full-Stack Web Developer',
    subtitle: 'Information Technology Student',
    description: 'Passionate about building modern web applications and exploring new technologies. Turning ideas into digital experiences.',
    email: 'mareygashaw21@gmail.com',
    phone: '0943454397',
    photoUrl: ''
  });
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Project form data
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    technologies: '',
    projectUrl: '',
    githubUrl: '',
    imageUrl: ''
  });
  const [projectImagePreview, setProjectImagePreview] = useState('');

  // Certificate form data
  const [certForm, setCertForm] = useState({
    title: '',
    issuer: '',
    date: '',
    description: '',
    icon: '',
    imageUrl: ''
  });

  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [projRes, certRes, cvRes, profileRes, vidRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/projects`).then((r) => (r.ok ? r.json() : [])),
        fetch(`${API_BASE_URL}/api/certificates`).then((r) => (r.ok ? r.json() : [])),
        fetch(`${API_BASE_URL}/api/cv`).then((r) => (r.ok ? r.json() : null)),
        fetch(`${API_BASE_URL}/api/profile`).then((r) => (r.ok ? r.json() : null)),
        fetch(`${API_BASE_URL}/api/videos`).then((r) => (r.ok ? r.json() : []))
      ]);
      setProjects(Array.isArray(projRes) ? projRes : []);
      setCertificates(Array.isArray(certRes) ? certRes : []);
      setCv(cvRes || null);
      setVideos(Array.isArray(vidRes) ? vidRes : []);
      if (profileRes) {
        setProfile(profileRes);
        setProfilePhotoPreview(profileRes.photoUrl || '');
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // ---- PROFILE HANDLERS ----
  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePhotoPreview(reader.result);
      setProfile((prev) => ({ ...prev, photoUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setProfilePhotoPreview(updated.photoUrl || '');
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
        window.dispatchEvent(new Event('profileUpdated'));
      } else {
        alert('Failed to save profile');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save profile');
    } finally {
      setSavingProfile(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- Project Handlers ---
  const handleProjectImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjectImagePreview(reader.result);
        setProjectForm((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description) {
      alert('Please fill in Title and Description');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(projectForm)
      });
      if (res.ok) {
        const newProj = await res.json();
        setProjects([newProj, ...projects]);
        setShowAddProject(false);
        setProjectForm({ title: '', description: '', technologies: '', projectUrl: '', githubUrl: '', imageUrl: '' });
        setProjectImagePreview('');
      } else {
        alert('Failed to add project');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to add project');
    }
  };

  const handleUpdateProject = async (id, updatedData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        const updated = await res.json();
        setProjects(projects.map((p) => (p._id === id ? updated : p)));
      } else {
        alert('Failed to update project');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() }
      });
      if (res.ok) {
        setProjects(projects.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- Certificate Handlers ---
  const handleCertImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCertImagePreview(reader.result);
        setCertForm((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCert = async (e) => {
    e.preventDefault();
    if (!certForm.title || !certForm.issuer) {
      alert('Please fill in Title and Issuer');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/api/certificates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(certForm)
      });
      if (res.ok) {
        const newCert = await res.json();
        setCertificates([newCert, ...certificates]);
        setShowAddCert(false);
        setCertForm({ title: '', issuer: '', date: '', description: '', icon: '', imageUrl: '' });
        setCertImagePreview('');
      } else {
        alert('Failed to add certificate');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to add certificate');
    }
  };

  const handleUpdateCert = async (id, updatedData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/certificates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        const updated = await res.json();
        setCertificates(certificates.map((c) => (c._id === id ? updated : c)));
      } else {
        alert('Failed to update certificate');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCert = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/certificates/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() }
      });
      if (res.ok) {
        setCertificates(certificates.filter((c) => c._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- CV Handlers ---
  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      alert('File size must be less than 8MB');
      return;
    }
    setUploadingCv(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      fetch(`${API_BASE_URL}/api/cv`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ fileName: file.name, fileUrl: reader.result, fileType: file.type })
      })
        .then(async (res) => {
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || errData.error || 'Upload failed');
          }
          return res.json();
        })
        .then((data) => {
          setCv(data);
          setUploadingCv(false);
          alert('CV uploaded successfully!');
        })
        .catch((err) => {
          console.error(err);
          setUploadingCv(false);
          alert(`Failed to upload CV: ${err.message}`);
        });
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteCv = async () => {
    if (!cv || !cv._id) return;
    if (!window.confirm('Are you sure you want to delete the CV?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/cv/${cv._id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeaders() }
      });
      if (res.ok) {
        setCv(null);
        alert('CV deleted');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const menuItems = [
    { id: 'profile', label: 'Profile Info' },
    { id: 'projects', label: 'Manage Projects', count: projects.length },
    { id: 'certificates', label: 'Certificates', count: certificates.length },
    { id: 'cv', label: 'Upload CV', status: cv ? 'Uploaded' : 'Empty' },
    { id: 'videos', label: '🎬 Video Editing', count: videos.length }
  ];

  // Input style helper
  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(0,0,0,0.4)',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  };
  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#94a3b8'
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#070b14',
      color: '#f3f4f6'
    }}>
      {/* LEFT SIDEBAR */}
      <aside style={{
        width: '280px',
        background: '#061325',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        padding: '30px 18px',
        flexShrink: 0
      }}>
        {/* Brand Header */}
        <div style={{ marginBottom: '36px', paddingLeft: '12px' }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '800',
            color: '#ffffff',
            margin: 0,
            letterSpacing: '0.3px'
          }}>
            Admin <span style={{ color: '#ff6b35' }}>Panel</span>
          </h1>
          <p style={{
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '2px',
            color: '#6e829f',
            textTransform: 'uppercase',
            margin: '6px 0 0 0'
          }}>
            PORTFOLIO MANAGER
          </p>
        </div>

        {/* Menu Tabs */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '13px 18px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isActive ? '#ff6b35' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontWeight: isActive ? '700' : '600',
                  fontSize: '14.5px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 15px rgba(255, 107, 53, 0.35)' : 'none'
                }}
              >
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span style={{
                    fontSize: '12px',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: isActive ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                    color: isActive ? '#fff' : '#94a3b8'
                  }}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={onExitDashboard}
            style={{
              width: '100%',
              padding: '11px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(97, 218, 255, 0.3)',
              background: 'rgba(97, 218, 255, 0.08)',
              color: 'var(--primary)',
              fontWeight: '600',
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            View Live Portfolio
          </button>
          <button
            onClick={logout}
            style={{
              width: '100%',
              padding: '11px 16px',
              borderRadius: '10px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              fontWeight: '600',
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Logout Admin
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {/* TAB 1: PROFILE INFO */}
        {activeTab === 'profile' && (
          <div style={{ maxWidth: '820px' }}>
            {/* Stats header */}
            <div className="glass-card" style={{ padding: '24px 30px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                <img
                  src={profilePhotoPreview || profile.photoUrl || '/mar.jpg'}
                  alt="Profile"
                  style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid var(--primary)', objectFit: 'cover', background: '#1e2029' }}
                  onError={(e) => { e.target.src = '/mar.png'; }}
                />
                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: '800', margin: 0 }}>{profile.name || 'Marey Gashaw'}</h3>
                  <p style={{ color: 'var(--primary)', fontWeight: '600', margin: '4px 0 0 0' }}>{profile.title}</p>
                  <p style={{ color: 'var(--text-sub)', fontSize: '13px', margin: '2px 0 0 0' }}>{profile.subtitle}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                <div style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>Total Projects</span>
                  <h4 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)', margin: '4px 0 0 0' }}>{projects.length}</h4>
                </div>
                <div style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>Total Certificates</span>
                  <h4 style={{ fontSize: '24px', fontWeight: '800', color: '#a855f7', margin: '4px 0 0 0' }}>{certificates.length}</h4>
                </div>
                <div style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-sub)' }}>CV Document</span>
                  <h4 style={{ fontSize: '18px', fontWeight: '700', color: cv ? '#10b981' : '#ef4444', margin: '6px 0 0 0' }}>
                    {cv ? 'Active' : 'Missing'}
                  </h4>
                </div>
              </div>
            </div>

            {/* Profile Edit Form */}
            <div className="glass-card" style={{ padding: '30px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#fff' }}>
                ✏️ Edit Profile Info
              </h3>
              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Photo Upload */}
                <div>
                  <label style={labelStyle}>Profile Photo</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <img
                      src={profilePhotoPreview || profile.photoUrl || '/mar.jpg'}
                      alt="Profile Preview"
                      style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #ff6b35', background: '#1e2029' }}
                      onError={(e) => { e.target.src = '/mar.png'; }}
                    />
                    <div style={{ flex: 1 }}>
                      <input
                        type="file"
                        id="profile-photo-upload"
                        accept="image/*"
                        onChange={handleProfilePhotoUpload}
                        style={{ display: 'none' }}
                      />
                      <label
                        htmlFor="profile-photo-upload"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '8px',
                          padding: '10px 20px', borderRadius: '8px',
                          background: 'rgba(255,107,53,0.15)', border: '1px solid rgba(255,107,53,0.4)',
                          color: '#ff6b35', fontWeight: '600', fontSize: '13.5px', cursor: 'pointer'
                        }}
                      >
                        📷 Choose Photo from File
                      </label>
                      <p style={{ fontSize: '12px', color: '#6e829f', marginTop: '6px' }}>Max 5MB · JPG, PNG, WEBP</p>
                    </div>
                  </div>
                </div>

                <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }} />

                {/* Name */}
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Marey Gashaw" style={inputStyle} />
                </div>


{/* Email & Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="mareygashaw21@gmail.com" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input type="text" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="0943454397" style={inputStyle} />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={labelStyle}>Short Description / Bio</label>
                  <textarea rows="4" value={profile.description} onChange={(e) => setProfile({ ...profile, description: e.target.value })} placeholder="Write a short bio..." style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }} />
                </div>

                {/* Save button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    style={{
                      padding: '13px 32px', borderRadius: '10px', border: 'none',
                      background: savingProfile ? 'rgba(255,107,53,0.5)' : 'linear-gradient(135deg, #ff6b35, #ff8c55)',
                      color: '#fff', fontWeight: '700', fontSize: '15px',
                      cursor: savingProfile ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 16px rgba(255,107,53,0.3)'
                    }}
                  >
                    {savingProfile ? '⏳ Saving...' : '💾 Save Profile'}
                  </button>
                  {profileSaved && (
                    <span style={{ color: '#10b981', fontWeight: '700', fontSize: '14px' }}>
                      ✅ Profile saved successfully!
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE PROJECTS */}
        {activeTab === 'projects' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-sub)' }}>
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
                <h3>No projects yet</h3>
                <p style={{ color: 'var(--text-sub)', marginBottom: '20px' }}>Create your first portfolio project.</p>
                <button className="btn-primary" onClick={() => setShowAddProject(true)}>
                  Add New Project
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                  <button className="btn-primary" onClick={() => setShowAddProject(true)} style={{ fontSize: '13.5px', padding: '10px 18px' }}>
                    + Add New Project
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {projects.map((proj) => (
                  <div key={proj._id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{
                      width: '100%',
                      height: '160px',
                      background: 'linear-gradient(135deg, #1e2029 0%, #0b0c10 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                      borderBottom: '1px solid var(--border-color)'
                    }}>
                      {proj.imageUrl && (
                        <img
                          src={proj.imageUrl}
                          alt={proj.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                    </div>

                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '6px' }}>{proj.title}</h3>
                      <p style={{ color: 'var(--text-sub)', fontSize: '13px', lineHeight: '1.6', marginBottom: '14px', flex: 1 }}>
                        {proj.description}
                      </p>

                      {proj.technologies && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                          {proj.technologies.split(',').map((tech, i) => (
                            <span key={i} style={{
                              fontSize: '11px',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              background: 'rgba(168, 85, 247, 0.12)',
                              color: 'var(--purple)',
                              border: '1px solid rgba(168, 85, 247, 0.2)'
                            }}>
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Admin actions */}
                      <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                        <button
                          onClick={() => setEditingProject(proj)}
                          className="btn-secondary"
                          style={{ flex: 1, justifyContent: 'center', padding: '8px 12px', fontSize: '13px' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj._id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                            borderRadius: '8px',
                            padding: '8px 14px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MANAGE CERTIFICATES */}
      {activeTab === 'certificates' && (
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-sub)' }}>
              Loading certificates...
            </div>
          ) : certificates.length === 0 ? (
            <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
              <h3>No certificates yet</h3>
              <p style={{ color: 'var(--text-sub)', marginBottom: '20px' }}>Add your earned certificates and achievements.</p>
              <button className="btn-primary" onClick={() => setShowAddCert(true)}>
                Add Certificate
              </button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <button className="btn-primary" onClick={() => setShowAddCert(true)} style={{ fontSize: '13.5px', padding: '10px 18px' }}>
                  + Add Certificate
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {certificates.map((cert) => (
                  <div key={cert._id} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      {cert.imageUrl && (
                        <div style={{ width: '100%', height: '140px', borderRadius: '8px', overflow: 'hidden', marginBottom: '14px', border: '1px solid var(--border-color)' }}>
                          <img src={cert.imageUrl} alt={cert.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}
                      <div style={{ marginBottom: '10px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>{cert.title}</h4>
                        <div style={{ marginTop: '4px' }}>
                          <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600' }}>{cert.issuer}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                      <button
                        onClick={() => setEditingCert(cert)}
                        className="btn-secondary"
                        style={{ flex: 1, justifyContent: 'center', padding: '8px 12px', fontSize: '13px' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCert(cert._id)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#ef4444',
                          borderRadius: '8px',
                          padding: '8px 14px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

        {/* TAB 4: UPLOAD CV */}
        {activeTab === 'cv' && (
          <div style={{ maxWidth: '650px' }}>
            <div className="glass-card" style={{ padding: '30px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>Curriculum Vitae (CV) Management</h3>
              <p style={{ color: 'var(--text-sub)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                Upload or replace your latest CV in PDF or image format. Visitors will be able to download this file directly.
              </p>

              <div style={{ padding: '20px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>
                      {cv ? cv.fileName : 'No CV currently uploaded'}
                    </h4>
                    <span style={{ fontSize: '12px', color: cv ? '#10b981' : '#ef4444' }}>
                      {cv ? 'Active and ready for download' : 'Please upload your CV'}
                    </span>
                  </div>

                  {cv && (
                    <button
                      onClick={handleDeleteCv}
                      style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Delete CV
                    </button>
                  )}
                </div>
              </div>

              {/* Upload Input */}
              <div>
                <input
                  type="file"
                  id="admin-cv-upload"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={handleCvUpload}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="admin-cv-upload"
                  className="btn-primary"
                  style={{
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    padding: '14px',
                    fontSize: '15px'
                  }}
                >
                  {uploadingCv ? 'Uploading CV...' : 'Upload New CV (PDF / Image)'}
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: VIDEO EDITING */}
        {activeTab === 'videos' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-sub)' }}>Loading videos...</div>
            ) : videos.length === 0 ? (
              <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎬</div>
                <h3>No videos yet</h3>
                <p style={{ color: 'var(--text-sub)', marginBottom: '20px' }}>Add your CapCut or other video editing works.</p>
                <button className="btn-primary" onClick={() => setShowAddVideo(true)}>+ Add Video</button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                  <button className="btn-primary" onClick={() => setShowAddVideo(true)} style={{ fontSize: '13.5px', padding: '10px 18px' }}>+ Add Video</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {videos.map((vid) => (
                    <div key={vid._id} className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                      {/* Thumbnail */}
                      <div style={{
                        width: '100%', height: '160px',
                        background: 'linear-gradient(135deg, #0d1117, #161b22)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border-color)'
                      }}>
                        {vid.thumbnailUrl && (
                          <img
                            src={getFullUrl(vid.thumbnailUrl)}
                            alt={vid.title}
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        )}
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
                        <div style={{
                          position: 'relative', zIndex: 2,
                          width: '44px', height: '44px', borderRadius: '50%',
                          background: 'rgba(0,196,204,0.85)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <span style={{ fontSize: '18px', marginLeft: '3px' }}>▶</span>
                        </div>
                      </div>
                      <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>{vid.title}</h4>
                        {vid.description && <p style={{ fontSize: '13px', color: 'var(--text-sub)', margin: 0, lineHeight: '1.5' }}>{vid.description}</p>}
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '5px',
                          padding: '3px 10px', borderRadius: '20px', width: 'fit-content',
                          background: 'rgba(0,196,204,0.12)', border: '1px solid rgba(0,196,204,0.3)',
                          fontSize: '12px', fontWeight: '700', color: '#00c4cc'
                        }}>✂️ {vid.tool || 'CapCut'}</span>
                        <div style={{ fontSize: '12px', color: 'var(--text-sub)', wordBreak: 'break-all' }}>
                          🔗 {vid.videoUrl?.slice(0, 50)}{vid.videoUrl?.length > 50 ? '...' : ''}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                          <button
                            onClick={() => {
                              setEditingVideo(vid);
                              setVideoForm({ title: vid.title, description: vid.description || '', tool: vid.tool || 'CapCut', videoUrl: vid.videoUrl, thumbnailUrl: vid.thumbnailUrl || '' });
                              setVideoThumbPreview(vid.thumbnailUrl || '');
                            }}
                            className="btn-secondary"
                            style={{ flex: 1, justifyContent: 'center', padding: '8px 12px', fontSize: '13px' }}
                          >Edit</button>
                          <button
                            onClick={async () => {
                              if (!window.confirm('Delete this video?')) return;
                              const res = await fetch(`${API_BASE_URL}/api/videos/${vid._id}`, { method: 'DELETE', headers: { ...getAuthHeaders() } });
                              if (res.ok) setVideos(videos.filter((v) => v._id !== vid._id));
                            }}
                            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                          >Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <AddProjectModal
        showModal={showAddProject}
        onClose={() => setShowAddProject(false)}
        handleSubmit={handleAddProject}
        formData={projectForm}
        handleChange={(e) => setProjectForm({ ...projectForm, [e.target.name]: e.target.value })}
        handleImageUpload={handleProjectImageUpload}
        imagePreview={projectImagePreview}
      />

      <EditProjectModal
        isOpen={!!editingProject}
        project={editingProject}
        onClose={() => setEditingProject(null)}
        onUpdate={handleUpdateProject}
      />

      <EditCertificateModal
        isOpen={!!editingCert}
        certificate={editingCert}
        onClose={() => setEditingCert(null)}
        onUpdate={handleUpdateCert}
      />

      {/* Add Certificate Modal */}
      {showAddCert && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="glass-card animate-fade-in" style={{
            width: '100%',
            maxWidth: '520px',
            padding: '30px',
            background: '#161821',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Add New Certificate</h3>
              <button
                onClick={() => setShowAddCert(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-sub)', fontSize: '20px', cursor: 'pointer' }}
              >X</button>
            </div>

            <form onSubmit={handleAddCert} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full-Stack Web Development"
                  value={certForm.title}
                  onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0, 0, 0, 0.4)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>Issuer *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Coursera, Udemy"
                  value={certForm.issuer}
                  onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0, 0, 0, 0.4)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>Image (Upload)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCertImageUpload}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0, 0, 0, 0.4)', color: '#ccc' }}
                />
                {certImagePreview && (
                  <div style={{ marginTop: '10px', textAlign: 'center' }}>
                    <img src={certImagePreview} alt="Preview" style={{ maxHeight: '120px', borderRadius: '8px' }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddCert(false)} style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Save Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ===== ADD VIDEO MODAL ===== */}
      {showAddVideo && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="glass-card animate-fade-in" style={{
            width: '100%', maxWidth: '520px', padding: '30px',
            background: '#161821', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Add New Video</h3>
              <button
                onClick={() => setShowAddVideo(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-sub)', fontSize: '20px', cursor: 'pointer' }}
              >X</button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!videoForm.title || !videoForm.videoUrl) {
                alert('Please fill in Title and Video URL');
                return;
              }
              try {
                const res = await fetch(`${API_BASE_URL}/api/videos`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                  body: JSON.stringify(videoForm)
                });
                if (res.ok) {
                  const newVid = await res.json();
                  setVideos([newVid, ...videos]);
                  setShowAddVideo(false);
                  setVideoForm({ title: '', description: '', tool: 'CapCut', videoUrl: '', thumbnailUrl: '' });
                  setVideoThumbPreview('');
                } else {
                  alert('Failed to add video');
                }
              } catch (err) {
                console.error(err);
                alert('Failed to add video');
              }
            }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CapCut Video Reel"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0, 0, 0, 0.4)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>TikTok / YouTube Video URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://www.tiktok.com/@user/video/..."
                  value={videoForm.videoUrl}
                  onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0, 0, 0, 0.4)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>Tool Used</label>
                <select
                  value={videoForm.tool}
                  onChange={(e) => setVideoForm({ ...videoForm, tool: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0, 0, 0, 0.4)', color: '#fff' }}
                >
                  <option value="CapCut">CapCut</option>
                  <option value="Premiere Pro">Premiere Pro</option>
                  <option value="After Effects">After Effects</option>
                  <option value="DaVinci">DaVinci</option>
                  <option value="iMovie">iMovie</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>Description (optional)</label>
                <textarea
                  rows="3"
                  placeholder="Short description of the video..."
                  value={videoForm.description}
                  onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0, 0, 0, 0.4)', color: '#fff', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>Thumbnail Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        alert('Image size must be less than 5MB');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setVideoThumbPreview(reader.result);
                        setVideoForm((prev) => ({ ...prev, thumbnailUrl: reader.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0, 0, 0, 0.4)', color: '#ccc' }}
                />
                {videoThumbPreview && (
                  <div style={{ marginTop: '10px', textAlign: 'center' }}>
                    <img src={videoThumbPreview} alt="Preview" style={{ maxHeight: '100px', borderRadius: '8px' }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddVideo(false)} style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Save Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== EDIT VIDEO MODAL ===== */}
      {editingVideo && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="glass-card animate-fade-in" style={{
            width: '100%', maxWidth: '520px', padding: '30px',
            background: '#161821', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Edit Video</h3>
              <button
                onClick={() => setEditingVideo(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-sub)', fontSize: '20px', cursor: 'pointer' }}
              >X</button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!videoForm.title || !videoForm.videoUrl) {
                alert('Please fill in Title and Video URL');
                return;
              }
              try {
                const res = await fetch(`${API_BASE_URL}/api/videos/${editingVideo._id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
                  body: JSON.stringify(videoForm)
                });
                if (res.ok) {
                  const updated = await res.json();
                  setVideos(videos.map((v) => (v._id === editingVideo._id ? updated : v)));
                  setEditingVideo(null);
                } else {
                  alert('Failed to update video');
                }
              } catch (err) {
                console.error(err);
                alert('Failed to update video');
              }
            }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>Title *</label>
                <input
                  type="text"
                  required
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0, 0, 0, 0.4)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>TikTok / YouTube Video URL *</label>
                <input
                  type="url"
                  required
                  value={videoForm.videoUrl}
                  onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0, 0, 0, 0.4)', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>Tool Used</label>
                <select
                  value={videoForm.tool}
                  onChange={(e) => setVideoForm({ ...videoForm, tool: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0, 0, 0, 0.4)', color: '#fff' }}
                >
                  <option value="CapCut">CapCut</option>
                  <option value="Premiere Pro">Premiere Pro</option>
                  <option value="After Effects">After Effects</option>
                  <option value="DaVinci">DaVinci</option>
                  <option value="iMovie">iMovie</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>Description (optional)</label>
                <textarea
                  rows="3"
                  value={videoForm.description}
                  onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0, 0, 0, 0.4)', color: '#fff', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>Thumbnail Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        alert('Image size must be less than 5MB');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setVideoThumbPreview(reader.result);
                        setVideoForm((prev) => ({ ...prev, thumbnailUrl: reader.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0, 0, 0, 0.4)', color: '#ccc' }}
                />
                {(videoThumbPreview || videoForm.thumbnailUrl) && (
                  <div style={{ marginTop: '10px', textAlign: 'center' }}>
                    <img src={videoThumbPreview || getFullUrl(videoForm.thumbnailUrl)} alt="Preview" style={{ maxHeight: '100px', borderRadius: '8px' }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setEditingVideo(null)} style={{ flex: 1, justifyContent: 'center' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  Update Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
