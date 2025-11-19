import React, { useState } from 'react';
import { Sparkles, Zap, Target, CheckCircle, ArrowRight, Menu, X } from 'lucide-react';

// Navbar Component
const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-lg z-50 border-b border-purple-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">InterviewAI</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition">How It Works</a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition">Testimonials</a>
            <button className="px-4 py-2 text-purple-600 hover:text-purple-700 transition">Sign In</button>
            <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-105">
              Get Started
            </button>
          </div>

          <button 
            className="md:hidden text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-purple-200">
          <div className="px-4 py-4 space-y-3">
            <a href="#features" className="block text-gray-600 hover:text-gray-900 transition">Features</a>
            <a href="#how-it-works" className="block text-gray-600 hover:text-gray-900 transition">How It Works</a>
            <a href="#testimonials" className="block text-gray-600 hover:text-gray-900 transition">Testimonials</a>
            <button className="w-full px-4 py-2 text-purple-600 hover:text-purple-700 transition text-left">Sign In</button>
            <button className="w-full px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;