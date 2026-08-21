import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import SkillsSection from './components/SkillsSection';
import CertificatesSection from './components/CertificatesSection';
import CvSection from './components/CvSection';
import VideoSection from './components/VideoSection';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginPage from './components/AdminLoginPage';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAdmin, API_BASE_URL } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [viewMode, setViewMode] = useState(() => {
    return window.location.hash === '#admin' ? 'admin' : 'portfolio';
  });
  const [profile, setProfile] = useState({
    name: 'Marey Gashaw',
    title: 'Full-Stack Web Developer',
    subtitle: 'Information Technology Student',
    description: 'Passionate about building modern web applications and exploring new technologies. Turning ideas into digital experiences.',
    email: 'mareygashaw21@gmail.com',
    phone: '0943454397',
    photoUrl: ''
  });

  const API_URL = `${API_BASE_URL}/api/projects`;

  // Fetch projects for live portfolio
  const fetchProjects = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
          try { localStorage.setItem('portfolio_local_projects', JSON.stringify(data)); } catch (e) {}
        } else {
          const local = localStorage.getItem('portfolio_local_projects');
          setProjects(local ? JSON.parse(local) : (Array.isArray(data) ? data : []));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Error fetching projects from backend, using local fallback:", err);
        const local = localStorage.getItem('portfolio_local_projects');
        setProjects(local ? JSON.parse(local) : []);
        setLoading(false);
      });
  };

  const fetchProfile = () => {
    fetch(`${API_BASE_URL}/api/profile`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setProfile(data);
          try { localStorage.setItem('portfolio_local_profile', JSON.stringify(data)); } catch (e) {}
        } else {
          const local = localStorage.getItem('portfolio_local_profile');
          if (local) setProfile(JSON.parse(local));
        }
      })
      .catch((err) => {
        console.warn('Error fetching profile from backend, using local fallback:', err);
        const local = localStorage.getItem('portfolio_local_profile');
        if (local) setProfile(JSON.parse(local));
      });
  };

  useEffect(() => {
    fetchProjects();
    fetchProfile();

    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setViewMode('admin');
      }
    };
    // Listen for profile updates from admin dashboard
    const handleProfileUpdated = () => fetchProfile();
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('profileUpdated', handleProfileUpdated);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('profileUpdated', handleProfileUpdated);
    };
  }, []);

  // When admin is clicked from navbar
  const handleOpenAdmin = () => {
    window.location.hash = 'admin';
    setViewMode('admin');
  };

  const handleExitAdmin = () => {
    window.location.hash = activeSection || 'home';
    setViewMode('portfolio');
    fetchProjects();
  };

  // If in Admin View Mode (Dedicated Full Page)
  if (viewMode === 'admin') {
    if (isAdmin) {
      return <AdminDashboard onExitDashboard={handleExitAdmin} />;
    }
    return (
      <AdminLoginPage
        onBack={handleExitAdmin}
        onLoginSuccess={() => setViewMode('admin')}
      />
    );
  }

  // Public Portfolio View
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar 
        onOpenLogin={handleOpenAdmin}
        onOpenAdminPanel={handleOpenAdmin}
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        profile={profile}
      />

      <main style={{ flex: 1, maxWidth: "1200px", margin: "0 auto", padding: "40px 20px", width: "100%" }}>
        {activeSection === 'home' && (
          <div className="section-fade-in">
            <Hero profile={profile} onNavigate={(sec) => setActiveSection(sec)} />
          </div>
        )}
        {activeSection === 'about' && (
          <div className="section-fade-in">
            <AboutSection profile={profile} />
          </div>
        )}
        {activeSection === 'projects' && (
          <div className="section-fade-in">
            <ProjectsSection
              projects={projects}
              loading={loading}
              fetchProjects={fetchProjects}
            />
          </div>
        )}
        {activeSection === 'skills' && (
          <div className="section-fade-in">
            <SkillsSection />
          </div>
        )}
        {activeSection === 'certificates' && (
          <div className="section-fade-in">
            <CertificatesSection />
          </div>
        )}
        {activeSection === 'cv' && (
          <div className="section-fade-in">
            <CvSection />
          </div>
        )}
        {activeSection === 'videos' && (
          <div className="section-fade-in">
            <VideoSection />
          </div>
        )}
      </main>

      <footer style={{ borderTop: "1px solid var(--border-color)", padding: "30px 20px", textAlign: "center", color: "var(--text-sub)", fontSize: "14px" }}>
        © {new Date().getFullYear()} Marey Gashaw — Full-Stack Portfolio
      </footer>
    </div>
  );
}

export default App;
