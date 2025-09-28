import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Button, Scale, MessageCircle, BookOpen, Shield, Users, BarChart3,
  ChevronRight, Phone, Mail, FileText, Briefcase, ExternalLink
} from '../components/shared';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageCircle,
      title: 'AI Legal Assistant',
      description: 'Get instant answers to your legal questions with our advanced AI powered by Indian legal knowledge base.'
    },
    {
      icon: BookOpen,
      title: 'Legal Research',
      description: 'Access comprehensive database of Indian Constitution, IPC, CrPC, and other legal documents.'
    },
    {
      icon: Briefcase,
      title: 'Case Management',
      description: 'Organize and track your legal cases, documents, and client information in one secure platform.'
    },
    {
      icon: Shield,
      title: 'Secure & Confidential',
      description: 'Bank-grade security with end-to-end encryption to protect your sensitive legal information.'
    },
    {
      icon: Users,
      title: 'Collaboration Tools',
      description: 'Work seamlessly with your legal team, share documents, and collaborate on cases efficiently.'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Get valuable insights into your legal practice with detailed analytics and reporting tools.'
    }
  ];

  const testimonials = [
    {
      name: 'Advocate Priya Sharma',
      role: 'Senior Advocate, Delhi High Court',
      content: 'LegalBot India has revolutionized my practice. The AI assistant provides accurate legal research in seconds.',
      rating: 5
    },
    {
      name: 'Adv. Rajesh Kumar',
      role: 'Partner, Kumar & Associates',
      content: 'The case management features and legal document access have improved our efficiency dramatically.',
      rating: 5
    },
    {
      name: 'Dr. Meera Patel',
      role: 'Legal Consultant',
      content: 'As a legal consultant, having instant access to Indian legal database is invaluable for my work.',
      rating: 5
    }
  ];

  const legalAreas = [
    'Constitutional Law',
    'Criminal Law',
    'Civil Law',
    'Corporate Law',
    'Family Law',
    'Property Law',
    'Tax Law',
    'Labor Law'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-legal-gold-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
                <Scale className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 font-serif">LegalBot</h1>
                <p className="text-sm text-gray-500">India</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')}
                className="hidden sm:inline-flex"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/signup')}
                rightIcon={<ChevronRight size={16} />}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Shield size={16} />
              Trusted by 10,000+ Legal Professionals
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-serif">
              Your AI-Powered
              <br />
              <span className="text-primary-600">Legal Assistant</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get instant answers to legal questions, access comprehensive Indian legal database, 
              and manage your cases with the most advanced AI legal platform in India.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                onClick={() => navigate('/signup')}
                rightIcon={<ChevronRight size={20} />}
                className="text-base px-8 py-4"
              >
                Start Free Trial
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                leftIcon={<MessageCircle size={20} />}
                className="text-base px-8 py-4"
              >
                See Demo
              </Button>
            </div>
            
            {/* Legal Areas Tags */}
            <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
              {legalAreas.map((area, index) => (
                <span 
                  key={index}
                  className="bg-white text-gray-700 px-3 py-1 rounded-full text-sm border shadow-sm"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
              Powerful Features for Legal Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to streamline your legal practice and serve your clients better
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="group p-8 bg-gray-50 rounded-xl hover:bg-primary-50 transition-all duration-300 hover:shadow-lg animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                    <Icon className="text-primary-600" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 font-serif">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Assistant Preview */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
                Ask Any Legal Question, Get Expert Answers
              </h2>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed">
                Our AI is trained on comprehensive Indian legal database including Constitution, 
                IPC, CrPC, and thousands of case laws to provide accurate legal guidance.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-legal-green-500 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5">
                    ✓
                  </div>
                  <span className="text-primary-100">Constitutional law queries and interpretations</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-legal-green-500 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5">
                    ✓
                  </div>
                  <span className="text-primary-100">Criminal law provisions and procedures</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-legal-green-500 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5">
                    ✓
                  </div>
                  <span className="text-primary-100">Legal research and case law citations</span>
                </div>
              </div>
              
              <Button 
                variant="secondary"
                size="lg"
                rightIcon={<ChevronRight size={20} />}
                className="bg-white text-primary-600 hover:bg-gray-50"
              >
                Try AI Assistant
              </Button>
            </div>
            
            {/* Chat Preview */}
            <div className="bg-white rounded-xl shadow-2xl p-6 animate-fadeIn">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="text-primary-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Legal AI Assistant</h4>
                    <p className="text-sm text-legal-green-600">● Online</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 max-h-80 overflow-y-auto">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    👤
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-gray-800">What is Article 21 of the Indian Constitution?</p>
                  </div>
                </div>
                
                <div className="flex gap-3 justify-end">
                  <div className="bg-primary-600 text-white rounded-lg p-3 max-w-sm">
                    <p className="text-sm">Article 21 of the Indian Constitution states: "No person shall be deprived of his life or personal liberty except according to procedure established by law."</p>
                    <p className="text-xs mt-2 text-primary-200">This is a fundamental right that protects the right to life and personal liberty.</p>
                  </div>
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    ⚖️
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    👤
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                    <p className="text-sm text-gray-800">Can you explain the scope of Article 21?</p>
                  </div>
                </div>
                
                <div className="flex gap-3 justify-end">
                  <div className="flex items-center gap-1 text-primary-600">
                    <div className="typing-dots">
                      <div className="dot"></div>
                      <div className="dot"></div>
                      <div className="dot"></div>
                    </div>
                    <span className="text-sm">AI is typing...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
              Trusted by Legal Professionals
            </h2>
            <p className="text-xl text-gray-600">
              See what our users say about LegalBot India
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm animate-fadeIn"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-legal-gold-500 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-serif">
            Ready to Transform Your Legal Practice?
          </h2>
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            Join thousands of legal professionals who are already using LegalBot India 
            to streamline their practice and serve their clients better.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="secondary"
              size="lg"
              onClick={() => navigate('/signup')}
              rightIcon={<ChevronRight size={20} />}
              className="bg-white text-primary-600 hover:bg-gray-50 text-base px-8 py-4"
            >
              Start Free Trial - 14 Days
            </Button>
            <Button 
              variant="outline"
              size="lg"
              leftIcon={<Phone size={20} />}
              className="border-white text-white hover:bg-white hover:text-primary-600 text-base px-8 py-4"
            >
              Schedule Demo
            </Button>
          </div>
          
          <p className="text-sm text-primary-200 mt-6">
            No credit card required • Free trial includes all features
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
                  <Scale className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-serif">LegalBot India</h3>
                  <p className="text-sm text-gray-400">AI-Powered Legal Assistant</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering legal professionals with AI-driven insights, comprehensive legal research, 
                and efficient case management tools designed specifically for Indian legal practice.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Mail size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Phone size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <ExternalLink size={20} />
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LegalBot India. All rights reserved. Made with ⚖️ for Indian Legal Professionals.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;