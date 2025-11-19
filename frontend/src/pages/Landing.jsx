import React, { useState } from 'react';
import { Sparkles, Zap, Target, CheckCircle, ArrowRight, Menu, X } from 'lucide-react';
import Navbar from '../components/navbar';
import { Link } from "react-router-dom";

export default function AIInterviewLanding() {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI-Powered Questions",
      description: "Adaptive questions that adjust to your responses and skill level in real-time"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Feedback",
      description: "Get detailed performance analysis and improvement suggestions immediately"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Role-Specific Prep",
      description: "Practice for your exact role with industry-specific interview scenarios"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      content: "This platform helped me land my dream job. The AI feedback was incredibly accurate and actionable.",
      avatar: "SC"
    },
    {
      name: "Michael Rodriguez",
      role: "Product Manager at Meta",
      content: "The mock interviews felt so real. I was completely prepared for my actual interviews.",
      avatar: "MR"
    },
    {
      name: "Priya Patel",
      role: "Data Scientist at Amazon",
      content: "Best investment I made in my career. The personalized feedback accelerated my preparation.",
      avatar: "PP"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Import Navbar Component */}
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-purple-100 rounded-full border border-purple-200">
            <span className="text-purple-700 text-sm font-medium">🚀 AI-Powered Interview Preparation</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Ace Your Next Interview
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              With AI Coaching
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Practice with our advanced AI interviewer. Get real-time feedback, improve your responses, 
            and land your dream job with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/start">
  <button className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-105 flex items-center space-x-2 shadow-lg">
    <span>Start Practicing Free</span>
    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
  </button>
</Link>
            <button className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition border-2 border-gray-200 shadow-lg">
              Watch Demo
            </button>
          </div>

          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 blur-3xl opacity-30"></div>
            <div className="relative bg-white rounded-2xl p-8 border-2 border-purple-200 max-w-4xl mx-auto shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-gray-600 font-medium">Interactive AI Interview Demo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose InterviewAI?</h2>
            <p className="text-gray-600 text-lg">Everything you need to succeed in your interviews</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl p-8 border-2 border-purple-200 hover:border-purple-400 transition transform hover:-translate-y-2 shadow-lg"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 text-lg">Get started in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "1", title: "Choose Your Role", desc: "Select the position you're interviewing for" },
              { step: "2", title: "Practice with AI", desc: "Answer questions and get real-time feedback" },
              { step: "3", title: "Review & Improve", desc: "Analyze your performance and track progress" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-gray-600 text-lg">Join thousands who landed their dream jobs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 border-2 border-purple-200 shadow-lg hover:shadow-xl transition"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-12 border-2 border-purple-200 shadow-2xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Ace Your Interview?</h2>
            <p className="text-gray-700 text-lg mb-8">Start practicing today and join thousands of successful candidates</p>
            <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-105 inline-flex items-center space-x-2 shadow-lg">
              <span>Get Started for Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-gray-600 text-sm mt-4">No credit card required • 7-day free trial</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-purple-200 py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">InterviewAI</span>
              </div>
              <p className="text-gray-600 text-sm">Empowering candidates with AI-driven interview preparation</p>
            </div>
            
            <div>
              <h5 className="text-gray-900 font-semibold mb-4">Product</h5>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#" className="hover:text-gray-900 transition">Features</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Pricing</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-gray-900 font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#" className="hover:text-gray-900 transition">About</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-gray-900 font-semibold mb-4">Legal</h5>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#" className="hover:text-gray-900 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Terms</a></li>
                <li><a href="#" className="hover:text-gray-900 transition">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t-2 border-purple-200 pt-8 text-center text-gray-600 text-sm">
            <p>© 2024 InterviewAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}