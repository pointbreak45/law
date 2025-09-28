import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || ''
  });

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    updateProfile(profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || ''
    });
    setIsEditing(false);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.logo}>⚖️</div>
          <span style={styles.brandName}>LegalBot India</span>
        </div>
        <div style={styles.headerLinks}>
          <Link to="/dashboard" style={styles.headerLink}>Chatbot</Link>
          <Link to="/contact" style={styles.headerLink}>Contact</Link>
          <button style={styles.profileButton}>👤 Profile</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        {/* Sidebar Navigation */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>Navigation</div>
          <nav style={styles.nav}>
            <Link to="/dashboard" style={styles.navItem}>
              💬 Chatbot
            </Link>
            <div style={styles.navItemActive}>
              👤 User
            </div>
            <Link to="/contact" style={styles.navItem}>
              ✉️ Contact
            </Link>
          </nav>

          <div style={styles.sidebarHeader}>Resources</div>
          <nav style={styles.nav}>
            <Link to="/constitution" style={styles.navItem}>
              📜 Constitution
            </Link>
            <Link to="/acts-codes" style={styles.navItem}>
              📚 Acts & Codes
            </Link>
          </nav>
        </div>

        {/* Profile Content */}
        <div style={styles.mainContent}>
          <h1 style={styles.pageTitle}>Your Profile</h1>
          
          <div style={styles.profileCard}>
            <div style={styles.profileHeader}>
              <div style={styles.avatarSection}>
                <div style={styles.avatar}>
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div style={styles.userInfo}>
                  <h2 style={styles.userName}>{user.name}</h2>
                  <p style={styles.memberSince}>Member since {user.memberSince}</p>
                </div>
              </div>
              <div style={styles.planBadge}>{user.plan}</div>
            </div>

            <div style={styles.profileDetails}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Email</span>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    style={styles.editInput}
                  />
                ) : (
                  <span style={styles.detailValue}>{user.email}</span>
                )}
              </div>

              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Phone</span>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    style={styles.editInput}
                  />
                ) : (
                  <span style={styles.detailValue}>{user.phone}</span>
                )}
              </div>

              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Location</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={profileData.location}
                    onChange={handleChange}
                    style={styles.editInput}
                  />
                ) : (
                  <span style={styles.detailValue}>{user.location}</span>
                )}
              </div>
            </div>

            <div style={styles.profileActions}>
              {isEditing ? (
                <div style={styles.editActions}>
                  <button onClick={handleSave} style={styles.saveButton}>
                    Save Changes
                  </button>
                  <button onClick={handleCancel} style={styles.cancelButton}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div style={styles.actions}>
                  <button onClick={() => setIsEditing(true)} style={styles.editButton}>
                    ✏️ Edit Profile
                  </button>
                  <button style={styles.syncButton}>
                    🔄 Sync Data
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Getting Started Section */}
          <div style={styles.gettingStartedCard}>
            <h3 style={styles.sectionTitle}>Getting Started</h3>
            <div style={styles.taskList}>
              <div style={styles.task}>
                <div style={styles.taskIcon}>✅</div>
                <div style={styles.taskContent}>
                  <div style={styles.taskTitle}>Verify your email</div>
                  <div style={styles.taskStatus}>Pending</div>
                </div>
              </div>
              
              <div style={styles.task}>
                <div style={styles.taskIcon}>💬</div>
                <div style={styles.taskContent}>
                  <div style={styles.taskTitle}>Save your first chat</div>
                  <div style={styles.taskStatus}>0/1</div>
                </div>
              </div>
              
              <div style={styles.task}>
                <div style={styles.taskIcon}>🔒</div>
                <div style={styles.taskContent}>
                  <div style={styles.taskTitle}>Review privacy settings</div>
                  <div style={styles.taskStatus}>Recommended</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span>© 2025 LegalBot India</span>
        <span style={styles.footerDisclaimer}>
          Disclaimer: This chatbot provides general information for educational purposes only and does not constitute legal advice. For professional guidance, please consult a licensed advocate.
        </span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  logo: {
    fontSize: '1.5rem'
  },
  brandName: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937'
  },
  headerLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem'
  },
  headerLink: {
    color: '#6b7280',
    textDecoration: 'none',
    fontSize: '0.875rem'
  },
  profileButton: {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer'
  },
  content: {
    flex: 1,
    display: 'flex',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%'
  },
  sidebar: {
    width: '240px',
    backgroundColor: 'white',
    borderRight: '1px solid #e5e7eb',
    padding: '2rem 0'
  },
  sidebarHeader: {
    padding: '0 1.5rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '1rem'
  },
  nav: {
    marginBottom: '2rem'
  },
  navItem: {
    display: 'block',
    padding: '0.75rem 1.5rem',
    color: '#6b7280',
    textDecoration: 'none',
    fontSize: '0.875rem',
    transition: 'background-color 0.2s'
  },
  navItemActive: {
    display: 'block',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4f46e5',
    color: 'white',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  mainContent: {
    flex: 1,
    padding: '2rem'
  },
  pageTitle: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '2rem'
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
  },
  profileHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  avatar: {
    width: '4rem',
    height: '4rem',
    borderRadius: '50%',
    backgroundColor: '#4f46e5',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: '600'
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  userName: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1f2937'
  },
  memberSince: {
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  planBadge: {
    backgroundColor: '#f3f4f6',
    color: '#374151',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  profileDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  detailLabel: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    width: '100px'
  },
  detailValue: {
    fontSize: '0.875rem',
    color: '#6b7280',
    flex: 1,
    textAlign: 'right'
  },
  editInput: {
    flex: 1,
    marginLeft: '1rem',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem'
  },
  profileActions: {
    borderTop: '1px solid #e5e7eb',
    paddingTop: '2rem'
  },
  actions: {
    display: 'flex',
    gap: '1rem'
  },
  editActions: {
    display: 'flex',
    gap: '1rem'
  },
  editButton: {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer'
  },
  syncButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer'
  },
  saveButton: {
    backgroundColor: '#059669',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer'
  },
  cancelButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer'
  },
  gettingStartedCard: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    padding: '2rem',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '1.5rem'
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  task: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.375rem'
  },
  taskIcon: {
    fontSize: '1.25rem'
  },
  taskContent: {
    flex: 1
  },
  taskTitle: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#1f2937'
  },
  taskStatus: {
    fontSize: '0.75rem',
    color: '#6b7280'
  },
  footer: {
    backgroundColor: 'white',
    padding: '1rem 2rem',
    borderTop: '1px solid #e5e7eb',
    fontSize: '0.75rem',
    color: '#6b7280',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerDisclaimer: {
    maxWidth: '600px',
    textAlign: 'right'
  }
};

export default UserProfile;