"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Mail, Phone } from "lucide-react"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [status, setStatus] = useState({
    loading: false,
    error: false,
    success: false,
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus({ loading: true, error: false, success: false, message: "" })

    // Simulate form submission
    setTimeout(() => {
      setStatus({
        loading: false,
        error: false,
        success: true,
        message: "Your message has been sent. Thank you!",
      })
      setFormData({ name: "", email: "", subject: "", message: "" })
    }, 1500)
  }

  return (
    <section id="contact" className="py-16">
      <div className="container mx-auto px-4">
        <div className="section-title mb-12">
          <h2>Contact</h2>
          <p className="text-gray-600">
            Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint
            consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit
            in iste officiis commodi quidem hic quas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" data-aos="fade-in">
          <div className="lg:col-span-5">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start mb-6">
                <div className="flex items-center justify-center bg-[#dff3fc] w-12 h-12 rounded-full mr-4 flex-shrink-0">
                  <MapPin className="h-6 w-6 text-[#149ddd]" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#173b6c]">Location:</h4>
                  <p className="text-gray-600">A108 Adam Street, New York, NY 535022</p>
                </div>
              </div>

              <div className="flex items-start mb-6">
                <div className="flex items-center justify-center bg-[#dff3fc] w-12 h-12 rounded-full mr-4 flex-shrink-0">
                  <Mail className="h-6 w-6 text-[#149ddd]" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#173b6c]">Email:</h4>
                  <p className="text-gray-600">info@example.com</p>
                </div>
              </div>

              <div className="flex items-start mb-6">
                <div className="flex items-center justify-center bg-[#dff3fc] w-12 h-12 rounded-full mr-4 flex-shrink-0">
                  <Phone className="h-6 w-6 text-[#149ddd]" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#173b6c]">Call:</h4>
                  <p className="text-gray-600">+1 5589 55488 55s</p>
                </div>
              </div>

              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12097.433213460943!2d-74.0062269!3d40.7101282!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xb89d1fe6bc499443!2sDowntown+Conference+Center!5e0!3m2!1smk!2sbg!4v1539943755621"
                className="w-full h-64 rounded-lg border-0"
                allowFullScreen
                loading="lazy"
                title="Google Maps"
              ></iframe>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#149ddd]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#149ddd]"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="subject" className="block text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#149ddd]"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={10}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#149ddd]"
                  required
                ></textarea>
              </div>
              <div className="mb-4 text-center">
                {status.loading && <div className="text-gray-600">Loading...</div>}
                {status.error && <div className="text-red-500">{status.message}</div>}
                {status.success && <div className="text-green-500">{status.message}</div>}
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#149ddd] text-white rounded-md hover:bg-[#37b3ed] transition-colors disabled:opacity-70"
                  disabled={status.loading}
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
