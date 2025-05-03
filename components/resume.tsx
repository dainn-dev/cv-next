"use client"

import { useEffect, useState } from "react"
import { getProfile } from "@/lib/actions"
import { subscribeToEducationUpdates, subscribeToExperienceUpdates, subscribeToProfileUpdates } from "@/lib/firebase/client"

export default function Resume() {
  const [profile, setProfile] = useState({
    name: "",
    summary: "",
    location: "",
    phone: "",
    email: "",
    resumeIntro: "",
  })
  const [education, setEducation] = useState<any[]>([])
  const [experience, setExperience] = useState<any[]>([])

  useEffect(() => {
    const unsubProfile = subscribeToProfileUpdates((data) => {
      if (data) {
        setProfile(prev => ({
          ...prev,
          ...data
        }))
      }
    })
    return () => unsubProfile()
  }, [])

  useEffect(() => {
    const unsubEdu = subscribeToEducationUpdates(setEducation)
    return () => unsubEdu()
  }, [])

  useEffect(() => {
    const unsubExp = subscribeToExperienceUpdates(setExperience)
    return () => unsubExp()
  }, [])

  return (
    <section id="resume" className="py-16">
      <div className="container mx-auto px-4">
        <div className="section-title mb-12">
          <h2>Resume</h2>
          <p className="text-gray-600">
            {profile.resumeIntro}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div data-aos="fade-up">
            <h3 className="text-xl font-bold text-[#173b6c] mb-4 border-l-4 border-[#149ddd] pl-3">Summary</h3>
            <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
              <h4 className="text-lg font-bold text-[#173b6c]">{profile.name}</h4>
              <p className="italic text-gray-600 mb-3">
                {profile.summary}
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>{profile.location}</li>
                <li>{profile.phone}</li>
                <li>{profile.email}</li>
              </ul>
            </div>

            <h3 className="text-xl font-bold text-[#173b6c] mb-4 border-l-4 border-[#149ddd] pl-3">Education</h3>
            {education.map((edu, index) => (
              <div key={edu.id || index} className="bg-white p-5 rounded-lg shadow-sm mb-6">
                <h4 className="text-lg font-bold text-[#173b6c]">{edu.degree}</h4>
                <h5 className="text-[#149ddd] font-semibold mb-2">{edu.school}</h5>
                <p className="italic mb-2">{edu.location}</p>
                <p className="text-gray-600">
                  {edu.description}
                </p>
              </div>
            ))}
          </div>

          <div data-aos="fade-up" data-aos-delay="100">
            <h3 className="text-xl font-bold text-[#173b6c] mb-4 border-l-4 border-[#149ddd] pl-3">
              Professional Experience
            </h3>
            {experience.map((exp, index) => (
              <div key={exp.id || index} className="bg-white p-5 rounded-lg shadow-sm mb-6">
                <h4 className="text-lg font-bold text-[#173b6c]">{exp.title}</h4>
                <h5 className="text-[#149ddd] font-semibold mb-2">{exp.company}</h5>
                <p className="italic mb-2">{exp.location}</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {exp.description?.split('\n').map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
