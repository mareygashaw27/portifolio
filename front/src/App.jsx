import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import SkillsSection from './components/SkillsSection';
import CertificatesSection from './components/CertificatesSection';
import CvSection from './components/CvSection';
import AddProjectModal from './components/AddProjectModal';

function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: 'React, Node.js, MongoDB',
    projectUrl: '',
    githubUrl: '',
    imageUrl: ''
  });

  const API_URL = "http://localhost:5000/api/projects";

  // Fetch projects from MongoDB
  const fetchProjects = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setProjects([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle Text inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Upload (Image to Base64)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("የምስሉ መጠን ከ 5MB በታች መሆን አለበት!");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Project to MongoDB
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert("እባክዎን የፕሮጀክት ርዕስ (Title) እና መግለጫ (Description) ይሙሉ!");
      return;
    }

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((newProject) => {
        setProjects([newProject, ...projects]);
        setShowModal(false);
        setFormData({
          title: '',
          description: '',
          technologies: 'React, Node.js, MongoDB',
          projectUrl: '',
          githubUrl: '',
          imageUrl: ''
        });
        setImagePreview('');
      })
      .catch((err) => console.error("Error adding project:", err));
  };

  // Delete project from MongoDB
  const handleDelete = (id) => {
    if (!window.confirm("እርግጠኛ ነዎት ይህን ፕሮጀክት ማጥፋት ይፈልጋሉ?")) return;

    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => {
        setProjects(projects.filter((p) => p._id !== id));
      })
      .catch((err) => console.error("Error deleting project:", err));
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar 
        onOpenModal={() => setShowModal(true)} 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />

      <main style={{ flex: 1, maxWidth: "1200px", margin: "0 auto", padding: "40px 20px", width: "100%" }}>
        {activeSection === 'home' && (
          <div className="section-fade-in">
            <Hero onOpenModal={() => setShowModal(true)} />
          </div>
        )}
        {activeSection === 'about' && (
          <div className="section-fade-in">
            <AboutSection />
          </div>
        )}
        {activeSection === 'projects' && (
          <div className="section-fade-in">
            <ProjectsSection
              projects={projects}
              loading={loading}
              fetchProjects={fetchProjects}
              handleDelete={handleDelete}
              onOpenModal={() => setShowModal(true)}
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
      </main>

      <AddProjectModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        handleSubmit={handleSubmit}
        formData={formData}
        handleChange={handleChange}
        handleImageUpload={handleImageUpload}
        imagePreview={imagePreview}
      />

      <footer style={{ borderTop: "1px solid var(--border-color)", padding: "30px 20px", textAlign: "center", color: "var(--text-sub)", fontSize: "14px" }}>
        © {new Date().getFullYear()} Marey Gashaw — Created with React & Node.js & MongoDB
      </footer>
    </div>
  );
}

export default App;
