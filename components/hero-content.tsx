"use client"

import { useEffect, useRef, useState } from "react"
import Typed from "typed.js"
import { getProfile } from "@/lib/actions"
import { subscribeToProfileUpdates } from "@/lib/firebase/client"

export default function HeroContent() {
  const typedRef = useRef<HTMLSpanElement>(null)
  const typed = useRef<Typed | null>(null)
  const [profileData, setProfileData] = useState({
    name: "Your Name",
    title: "UI/UX Designer & Web Developer",
    image: "",
  })

  useEffect(() => {
    // Initial load
    async function loadProfile() {
      const profile = await getProfile()
      if (profile) {
        setProfileData({
          name: profile.name || "Your Name",
          title: profile.title || "UI/UX Designer & Web Developer",
          image: profile.image || "",
        })
      }
    }

    loadProfile()

    // Subscribe to real-time updates
    const unsubscribe = subscribeToProfileUpdates((profile) => {
      if (profile) {
        setProfileData({
          name: profile.name || "Your Name",
          title: profile.title || "UI/UX Designer & Web Developer",
          image: profile.image || "",
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (typedRef.current) {
      // Extract professional skills from title or use defaults
      const skills = profileData.title?.split("&").map((s) => s.trim()) || ["Designer", "Developer", "Freelancer"]

      typed.current = new Typed(typedRef.current, {
        strings: skills,
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000,
        loop: true,
      })
    }

    return () => {
      if (typed.current) {
        typed.current.destroy()
      }
    }
  }, [profileData.title])

  return (
    <div className="container mx-auto px-4 text-center relative z-10" data-aos="fade-in">
      {profileData.image && (
        <img
          src={profileData.image}
          alt={profileData.name}
          className="mx-auto mb-4 rounded-full w-32 h-32 object-cover border-4 border-white shadow-lg"
        />
      )}
      <h1 className="text-5xl font-bold text-white mb-4">{profileData.name}</h1>
      <p className="text-white text-2xl">
        I&apos;m <span ref={typedRef} className="text-[#149ddd]"></span>
      </p>
    </div>
  )
}
