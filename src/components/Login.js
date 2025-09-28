import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: 'you@example.com',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.logo}>⚖️</div>
          <span style={styles.brandName}>LegalBot India</span>
        </div>
        <div style={styles.headerLinks}>
          <a href="/about" style={styles.headerLink}>About</a>
          <a href="/contact" style={styles.headerLink}>Contact</a>
          <Link to="/login" style={styles.loginButton}>🔐 Login</Link>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.leftSection}>
          <h1 style={styles.title}>Fresh start, secure access</h1>
          <p style={styles.subtitle}>
            Sign in to sync chats and manage your profile. Informational only — not legal advice.
          </p>
          <div style={styles.features}>
            <span style={styles.feature}>Secure</span>
            <span style={styles.feature}>•</span>
            <span style={styles.feature}>Private</span>
            <span style={styles.feature}>•</span>
            <span style={styles.feature}>Free</span>
          </div>
          <p style={styles.disclaimer}>
            By continuing, you agree to Terms and acknowledge the disclaimer.
          </p>
        </div>

        <div style={styles.rightSection}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordContainer}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div style={styles.formOptions}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  style={styles.checkbox}
                />
                Remember me
              </label>
              <a href="/forgot-password" style={styles.forgotLink}>
                Forgot password?
              </a>
            </div>

            {error && (
              <div style={styles.error}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={styles.continueButton}
            >
              {isLoading ? 'Signing in...' : '🔐 Continue'}
            </button>

            <div style={styles.signupPrompt}>
              New here?{' '}
              <Link to="/signup" style={styles.signupLink}>
                👤 Create account
              </Link>
            </div>
          </form>
        </div>
      </div>

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
  loginButton: {
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  content: {
    flex: 1,
    display: 'flex',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '4rem 2rem',
    gap: '4rem'
  },
  leftSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1f2937',
    lineHeight: '1.2'
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6b7280',
    lineHeight: '1.5'
  },
  features: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#6b7280',
    fontSize: '0.875rem'
  },
  feature: {
    fontWeight: '500'
  },
  disclaimer: {
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  rightSection: {
    flex: 1,
    maxWidth: '400px'
  },
  form: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
  },
  formGroup: {
    marginBottom: '1.5rem'
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    backgroundColor: '#f9fafb',
    outline: 'none'
  },
  passwordContainer: {
    position: 'relative'
  },
  passwordInput: {
    width: '100%',
    padding: '0.75rem',
    paddingRight: '2.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    backgroundColor: '#f9fafb',
    outline: 'none'
  },
  passwordToggle: {
    position: 'absolute',
    right: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem'
  },
  formOptions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#374151',
    cursor: 'pointer'
  },
  checkbox: {
    width: '1rem',
    height: '1rem'
  },
  forgotLink: {
    fontSize: '0.875rem',
    color: '#4f46e5',
    textDecoration: 'none'
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    marginBottom: '1rem'
  },
  continueButton: {
    width: '100%',
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    marginBottom: '1rem',
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  },
  signupPrompt: {
    textAlign: 'center',
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  signupLink: {
    color: '#4f46e5',
    textDecoration: 'none',
    fontWeight: '500'
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

export default Login;