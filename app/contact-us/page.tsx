"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Linkedin, Twitter, Github, Send } from "lucide-react";

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 3000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "hello@aitripplanner.com",
      href: "mailto:hello@aitripplanner.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 (555) 123-4567",
      href: "tel:+915551234567",
    },
    {
      icon: MapPin,
      label: "Office",
      value: "San Francisco, CA, USA",
      href: "#",
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-blue-100 py-12 px-4">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Get in Touch
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Have questions about AI Trip Planner? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Contact Info Cards */}
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <a
                key={index}
                href={info.href}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow group"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {info.label}
                    </h3>
                    <p className="text-gray-600 group-hover:text-blue-600 transition-colors">
                      {info.value}
                    </p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send us a Message
            </h2>

            {isSubmitted && (
              <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                ✓ Thank you! We've received your message and will get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isLoading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Info Section */}
          <div>
            {/* Business Hours */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Business Hours
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Monday - Friday</span>
                  <span className="text-gray-900">9:00 AM - 6:00 PM IST</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Saturday</span>
                  <span className="text-gray-900">10:00 AM - 4:00 PM IST</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Sunday</span>
                  <span className="text-gray-900">Closed</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                We typically respond to emails within 24 hours.
              </p>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Follow Us
              </h2>
              <p className="text-gray-600 mb-6">
                Connect with us on social media for travel tips, updates, and community stories.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={index}
                      href={link.href}
                      aria-label={link.label}
                      className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-lg hover:shadow-lg transition-shadow"
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto mt-16 bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Common Questions
        </h2>

        <div className="space-y-6">
          {[
            {
              q: "What's the best way to reach your support team?",
              a: "For quick responses, email us at hello@aitripplanner.com or use our contact form above. You can also call us during business hours.",
            },
            {
              q: "How long does it take to get a response?",
              a: "We aim to respond to all inquiries within 24 hours. For urgent matters, please call us during business hours.",
            },
            {
              q: "Do you offer technical support?",
              a: "Yes! Our technical support team is available to help with any issues. Reach out via email or phone with details about your problem.",
            },
            {
              q: "Can I schedule a demo or consultation?",
              a: "Absolutely! Email us with your preferred time, and we'll arrange a personalized demo or consultation session.",
            },
          ].map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {faq.q}
              </h3>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;
