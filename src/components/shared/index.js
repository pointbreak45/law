// Shared Components Library for Legal Bot India
import React from 'react';
import { 
  Menu, X, Search, Bell, User, Settings, FileText, Scale, 
  BookOpen, MessageCircle, BarChart3, Calendar, Users, Shield,
  ChevronRight, ChevronLeft, Home, Briefcase, Phone, Mail,
  ExternalLink, Download, Upload, Eye, Edit, Trash2, Plus
} from 'lucide-react';

// Navigation Component
export const Navbar = ({ user, onToggleSidebar, sidebarOpen }) => (
  <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
              <Scale className="text-white" size={24} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 font-serif">LegalBot</h1>
              <p className="text-sm text-gray-500">India</p>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search legal documents..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-legal-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* User menu */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500">{user?.role || 'Legal Professional'}</p>
            </div>
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <User size={16} className="text-primary-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
);

// Sidebar Component
export const Sidebar = ({ activeTab, onTabChange, isOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'chat', label: 'Legal Assistant', icon: MessageCircle },
    { id: 'resources', label: 'Legal Resources', icon: BookOpen },
    { id: 'cases', label: 'Case Management', icon: Briefcase },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-gray-900 bg-opacity-50 z-40"
          onClick={() => onTabChange(activeTab)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`
                      group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full
                      transition-colors duration-150
                      ${isActive 
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <Icon
                      className={`mr-3 flex-shrink-0 h-6 w-6 ${
                        isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* Sidebar footer */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-legal-green-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Secure & Confidential</p>
                <p className="text-xs text-gray-500">End-to-end encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

// Card Components
export const Card = ({ children, className = '', hover = true, ...props }) => (
  <div 
    className={`card ${hover ? 'hover:shadow-md hover:-translate-y-1' : ''} ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`card-header ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '', ...props }) => (
  <div className={`card-body ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`card-footer ${className}`} {...props}>
    {children}
  </div>
);

// Button Components
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'base', 
  leftIcon, 
  rightIcon, 
  loading = false, 
  className = '', 
  ...props 
}) => {
  const baseClass = `btn btn-${variant} btn-${size}`;
  
  return (
    <button 
      className={`${baseClass} ${loading ? 'opacity-75 cursor-not-allowed' : ''} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="animate-spin mr-2">⚖️</div>
      ) : leftIcon && (
        <span className="mr-2">{leftIcon}</span>
      )}
      {children}
      {rightIcon && !loading && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

// Form Components
export const FormGroup = ({ children, className = '', ...props }) => (
  <div className={`form-group ${className}`} {...props}>
    {children}
  </div>
);

export const Label = ({ children, required = false, className = '', ...props }) => (
  <label className={`form-label ${className}`} {...props}>
    {children}
    {required && <span className="text-legal-red-500 ml-1">*</span>}
  </label>
);

export const Input = ({ error, className = '', ...props }) => (
  <input 
    className={`form-input ${error ? 'border-legal-red-500 focus:border-legal-red-500 focus:ring-legal-red-200' : ''} ${className}`}
    {...props}
  />
);

export const TextArea = ({ error, className = '', rows = 4, ...props }) => (
  <textarea 
    rows={rows}
    className={`form-input resize-none ${error ? 'border-legal-red-500 focus:border-legal-red-500 focus:ring-legal-red-200' : ''} ${className}`}
    {...props}
  />
);

export const Select = ({ children, error, className = '', ...props }) => (
  <select 
    className={`form-input ${error ? 'border-legal-red-500 focus:border-legal-red-500 focus:ring-legal-red-200' : ''} ${className}`}
    {...props}
  >
    {children}
  </select>
);

export const ErrorMessage = ({ children, className = '' }) => (
  <p className={`form-error ${className}`}>{children}</p>
);

export const HelpText = ({ children, className = '' }) => (
  <p className={`form-help ${className}`}>{children}</p>
);

// Badge Component
export const Badge = ({ children, variant = 'gray', className = '', ...props }) => (
  <span className={`badge badge-${variant} ${className}`} {...props}>
    {children}
  </span>
);

// Loading Components
export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }[size];

  return (
    <div className={`animate-spin ${sizeClass} ${className}`}>
      ⚖️
    </div>
  );
};

export const TypingIndicator = () => (
  <div className="typing-dots flex items-center space-x-1">
    <div className="dot"></div>
    <div className="dot"></div>
    <div className="dot"></div>
  </div>
);

// Stats Card Component
export const StatsCard = ({ title, value, change, changeType, icon: Icon }) => (
  <Card className="p-6">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${
          changeType === 'increase' ? 'bg-legal-green-100' : 
          changeType === 'decrease' ? 'bg-legal-red-100' : 'bg-primary-100'
        }`}>
          <Icon className={`w-6 h-6 ${
            changeType === 'increase' ? 'text-legal-green-600' : 
            changeType === 'decrease' ? 'text-legal-red-600' : 'text-primary-600'
          }`} />
        </div>
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-semibold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
        {change && (
          <p className={`text-xs mt-1 ${
            changeType === 'increase' ? 'text-legal-green-600' : 
            changeType === 'decrease' ? 'text-legal-red-600' : 'text-gray-500'
          }`}>
            {change}
          </p>
        )}
      </div>
    </div>
  </Card>
);

// Alert Component
export const Alert = ({ type = 'info', title, children, onClose, className = '' }) => {
  const typeStyles = {
    info: 'bg-primary-50 border-primary-200 text-primary-800',
    success: 'bg-legal-green-50 border-legal-green-200 text-legal-green-800',
    warning: 'bg-legal-gold-50 border-legal-gold-200 text-legal-gold-800',
    error: 'bg-legal-red-50 border-legal-red-200 text-legal-red-800',
  };

  return (
    <div className={`border rounded-lg p-4 ${typeStyles[type]} ${className}`}>
      <div className="flex justify-between items-start">
        <div>
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-current opacity-60 hover:opacity-100">
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

// Modal Component
export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl', 
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className={`inline-block w-full ${sizeClasses[size]} my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg`}>
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          )}
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Empty State Component  
export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="text-center py-12">
    <div className="flex justify-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-6 max-w-sm mx-auto">{description}</p>
    {action && action}
  </div>
);

// Export all icons for use in other components
export {
  Menu, X, Search, Bell, User, Settings, FileText, Scale, 
  BookOpen, MessageCircle, BarChart3, Calendar, Users, Shield,
  ChevronRight, ChevronLeft, Home, Briefcase, Phone, Mail,
  ExternalLink, Download, Upload, Eye, Edit, Trash2, Plus
};