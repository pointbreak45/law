import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '+91 98XX-XX-XXXX',
      location: formData.location || 'Delhi, India'
    };

    const result = await register(userData);
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
          <h1 style={styles.title}>Join LegalBot India</h1>
          <p style={styles.subtitle}>
            Create your account to access personalized legal assistance and manage your consultation history.
          </p>
          <div style={styles.features}>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>🔒</span>
              <span>Secure & Private</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>💬</span>
              <span>Chat History</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>📱</span>
              <span>Mobile Friendly</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.featureIcon}>🆓</span>
              <span>Free to Start</span>
            </div>
          </div>
        </div>

        <div style={styles.rightSection}>
          <form onSubmit={handleSubmit} style={styles.form}>
            <h2 style={styles.formTitle}>Create Account</h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={errors.name ? {...styles.input, ...styles.inputError} : styles.input}
                placeholder="Enter your full name"
                required
              />
              {errors.name && <span style={styles.errorText}>{errors.name}</span>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={errors.email ? {...styles.input, ...styles.inputError} : styles.input}
                placeholder="Enter your email"
                required
              />
              {errors.email && <span style={styles.errorText}>{errors.email}</span>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={styles.input}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                style={styles.input}
                placeholder="City, State"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password *</label>
              <div style={styles.passwordContainer}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  style={errors.password ? {...styles.passwordInput, ...styles.inputError} : styles.passwordInput}
                  placeholder="Create a password"
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
              {errors.password && <span style={styles.errorText}>{errors.password}</span>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Confirm Password *</label>
              <div style={styles.passwordContainer}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={errors.confirmPassword ? {...styles.passwordInput, ...styles.inputError} : styles.passwordInput}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.passwordToggle}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.confirmPassword && <span style={styles.errorText}>{errors.confirmPassword}</span>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  style={styles.checkbox}
                />
                I agree to the <a href="/terms" style={styles.link}>Terms of Service</a> and <a href="/privacy" style={styles.link}>Privacy Policy</a>
              </label>
              {errors.agreeToTerms && <span style={styles.errorText}>{errors.agreeToTerms}</span>}
            </div>

            {error && (
              <div style={styles.error}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={isLoading ? {...styles.submitButton, ...styles.submitButtonDisabled} : styles.submitButton}
            >
              {isLoading ? 'Creating Account...' : '🎉 Create Account'}
            </button>

            <div style={styles.loginPrompt}>
              Already have an account?{' '}
              <Link to="/login" style={styles.loginLink}>
                Sign in here
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
    gap: '2rem'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1f2937',
    lineHeight: '1.2'
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#6b7280',
    lineHeight: '1.6'
  },
  features: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    fontSize: '1rem',
    color: '#374151'
  },
  featureIcon: {
    fontSize: '1.5rem'
  },
  rightSection: {
    flex: 1,
    maxWidth: '500px'
  },
  form: {
    backgroundColor: 'white',
    padding: '2.5rem',
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)'
  },
  formTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  formGroup: {
    marginBottom: '1.25rem'
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
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
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2'
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
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s'
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
  checkboxLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    fontSize: '0.875rem',
    color: '#374151',
    cursor: 'pointer',
    lineHeight: '1.5'
  },
  checkbox: {
    width: '1rem',
    height: '1rem',
    marginTop: '0.125rem'
  },
  link: {
    color: '#4f46e5',
    textDecoration: 'underline'
  },
  errorText: {
    color: '#ef4444',
    fontSize: '0.75rem',
    marginTop: '0.25rem',
    display: 'block'
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    marginBottom: '1rem'
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#4f46e5',
    color: 'white',
    padding: '0.875rem',
    border: 'none',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '1.5rem',
    transition: 'background-color 0.2s'
  },
  submitButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  loginPrompt: {
    textAlign: 'center',
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  loginLink: {
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

export default Signup;