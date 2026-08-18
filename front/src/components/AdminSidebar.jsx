import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdminSidebar({
  isOpen,
  onClose,
  activeSection,
  setActiveSection,
  onOpenAddProject,
  onOpenAddCertificate
}) {
  const { logout } = useAuth();

  if (!isOpen) return null;

  const menuItems = [
    { id: 'about', label: 'Profile Info' },
    { id: 'projects', label: 'Manage Projects' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'cv', label: 'Upload CV' }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(6px)',
      zIndex: 1500,
      display: 'flex',
      animation: 'fadeIn 0.25s ease'
    }}>
      {/* Sidebar Panel */}
      <div style={{
        width: '300px',
        maxWidth: '85vw',
        height: '100%',
        background: '#07152b',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        padding: '30px 20px',
        boxShadow: '10px 0 30px rgba(0, 0, 0, 0.5)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#fff',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >X</button>

        {/* Header Branding */}
        <div style={{ marginBottom: '36px', paddingLeft: '8px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '800',
            color: '#ffffff',
            letterSpacing: '0.5px',
            margin: 0
          }}>
            Admin <span style={{ color: '#ff6b35' }}>Panel</span>
          </h2>
          <span style={{
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '2px',
            color: '#71829d',
            textTransform: 'uppercase',
            display: 'block',
            marginTop: '4px'
          }}>
            PORTFOLIO MANAGER
          </span>
        </div>

        {/* Navigation Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          {menuItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isActive ? '#ff6b35' : 'transparent',
                  color: isActive ? '#ffffff' : '#a0aec0',
                  fontWeight: isActive ? '700' : '600',
                  fontSize: '15px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 15px rgba(255, 107, 53, 0.35)' : 'none'
                }}
              >
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Quick Action Buttons */}
          <div style={{
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <button
              onClick={() => {
                onClose();
                onOpenAddProject();
              }}
              className="btn-primary"
              style={{
                fontSize: '13px',
                padding: '10px 14px',
                justifyContent: 'center'
              }}
            >
              Add Project
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenAddCertificate();
              }}
              className="btn-secondary"
              style={{
                fontSize: '13px',
                padding: '10px 14px',
                justifyContent: 'center'
              }}
            >
              Add Certificate
            </button>
          </div>
        </div>

        {/* Footer Logout */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              background: 'rgba(239, 68, 68, 0.12)',
              color: '#ef4444',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Logout Admin
          </button>
        </div>
      </div>

      {/* Outside click closer */}
      <div style={{ flex: 1 }} onClick={onClose}></div>
    </div>
  );
}
