"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Home,
  User,
  FileText,
  Briefcase,
  Server,
  Mail,
  Menu,
} from "lucide-react"
import { getProfile } from "@/lib/actions"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const [profileName, setProfileName] = useState("Your Name")

  useEffect(() => {
    async function loadProfile() {
      const profile = await getProfile()
      if (profile && profile.name) {
        setProfileName(profile.name)
      }
    }

    loadProfile()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section")
      let current = ""

      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.clientHeight
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute("id") || ""
        }
      })

      if (current) {
        setActiveSection(current)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <button
        className="fixed top-4 right-4 z-50 p-2 bg-primary text-white rounded-md md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>

      <header
        className={`fixed top-0 left-0 bottom-0 w-72 bg-[#040b14] text-white transition-transform duration-300 ease-in-out z-40 
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="profile p-6 text-center">
            <Image
              src="/placeholder.svg?height=120&width=120"
              alt="Profile"
              width={120}
              height={120}
              className="mx-auto rounded-full border-8 border-[#2c2f3f]"
            />
            <h1 className="text-2xl font-semibold mt-4">
              <Link href="/" className="text-white hover:text-[#149ddd]">
                {profileName}
              </Link>
            </h1>
            <div className="social-links flex justify-center mt-4 space-x-2">
              <a href="#" className="bg-[#212431] p-2 rounded-full hover:bg-[#149ddd] transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="bg-[#212431] p-2 rounded-full hover:bg-[#149ddd] transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="bg-[#212431] p-2 rounded-full hover:bg-[#149ddd] transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="bg-[#212431] p-2 rounded-full hover:bg-[#149ddd] transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <nav className="nav-menu mt-6 flex-1">
            <ul className="space-y-2 px-4">
              <li>
                <a
                  href="#hero"
                  className={`flex items-center py-2 px-4 rounded-md transition-colors ${activeSection === "hero" ? "text-white bg-[#149ddd]/20" : "text-[#a8a9b4] hover:text-white"}`}
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="h-5 w-5 mr-3" />
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className={`flex items-center py-2 px-4 rounded-md transition-colors ${activeSection === "about" ? "text-white bg-[#149ddd]/20" : "text-[#a8a9b4] hover:text-white"}`}
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5 mr-3" />
                  <span>About</span>
                </a>
              </li>
              <li>
                <a
                  href="#resume"
                  className={`flex items-center py-2 px-4 rounded-md transition-colors ${activeSection === "resume" ? "text-white bg-[#149ddd]/20" : "text-[#a8a9b4] hover:text-white"}`}
                  onClick={() => setIsOpen(false)}
                >
                  <FileText className="h-5 w-5 mr-3" />
                  <span>Resume</span>
                </a>
              </li>
              <li>
                <a
                  href="#portfolio"
                  className={`flex items-center py-2 px-4 rounded-md transition-colors ${activeSection === "portfolio" ? "text-white bg-[#149ddd]/20" : "text-[#a8a9b4] hover:text-white"}`}
                  onClick={() => setIsOpen(false)}
                >
                  <Briefcase className="h-5 w-5 mr-3" />
                  <span>Portfolio</span>
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className={`flex items-center py-2 px-4 rounded-md transition-colors ${activeSection === "services" ? "text-white bg-[#149ddd]/20" : "text-[#a8a9b4] hover:text-white"}`}
                  onClick={() => setIsOpen(false)}
                >
                  <Server className="h-5 w-5 mr-3" />
                  <span>Services</span>
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className={`flex items-center py-2 px-4 rounded-md transition-colors ${activeSection === "contact" ? "text-white bg-[#149ddd]/20" : "text-[#a8a9b4] hover:text-white"}`}
                  onClick={() => setIsOpen(false)}
                >
                  <Mail className="h-5 w-5 mr-3" />
                  <span>Contact</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  )
}
