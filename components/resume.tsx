"use client"

import { useEffect, useState } from "react"
import { getProfile } from "@/lib/actions"
import { subscribeToEducationUpdates, subscribeToExperienceUpdates, subscribeToProfileUpdates, subscribeToCertificatesUpdates } from "@/lib/firebase/client"

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
  const [certificates, setCertificates] = useState<any[]>([])
  const [profileLoading, setProfileLoading] = useState(true)
  const [educationLoading, setEducationLoading] = useState(true)
  const [experienceLoading, setExperienceLoading] = useState(true)
  const [certificateLoading, setCertificateLoading] = useState(true)

  useEffect(() => {
    setProfileLoading(true)
    const unsubProfile = subscribeToProfileUpdates((data) => {
      if (data) {
        setProfile(prev => ({
          ...prev,
          ...data
        }))
      }
      setProfileLoading(false)
    })
    return () => unsubProfile()
  }, [])

  useEffect(() => {
    setEducationLoading(true)
    const unsubEdu = subscribeToEducationUpdates((data) => {
      setEducation(data)
      setEducationLoading(false)
    })
    return () => unsubEdu()
  }, [])

  useEffect(() => {
    setExperienceLoading(true)
    const unsubExp = subscribeToExperienceUpdates((data) => {
      setExperience(data)
      setExperienceLoading(false)
    })
    return () => unsubExp()
  }, [])

  useEffect(() => {
    setCertificateLoading(true)
    const unsubCert = subscribeToCertificatesUpdates((data) => {
      setCertificates(data)
      setCertificateLoading(false)
    })
    return () => unsubCert()
  }, [])

  useEffect(() => {
    console.log("Profile data:", profile)
  }, [profile])

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
            <h3 className="text-xl font-bold text-[#173b6c] mb-4 border-l-4 border-[#149ddd] pl-3">Professional Experience</h3>
            {experience.map((exp, index) => (
              <div key={exp.id || index} className="bg-white p-5 rounded-lg shadow-sm mb-6">
                <h4 className="text-lg font-bold text-[#173b6c]">{exp.title}</h4>
                <h5 className="text-[#149ddd] font-semibold mb-2">{exp.company}</h5>
                <p className="text-sm text-gray-500 mb-1">{exp.startYear} - {exp.endYear}</p>
                <p className="italic mb-2">{exp.location}</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {exp.description?.split('\n').map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div data-aos="fade-up">
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

            <h3 className="text-xl font-bold text-[#173b6c] mb-4 border-l-4 border-[#149ddd] pl-3">Certificates</h3>
            {certificateLoading ? (
              <div className="bg-white p-5 rounded-lg shadow-sm mb-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ) : certificates.length === 0 ? (
              <div className="text-gray-500 italic mb-6">No certificates added yet.</div>
            ) : (
              certificates.map((cert, index) => (
                <div key={cert.id || index} className="bg-white p-5 rounded-lg shadow-sm mb-6">
                  <h4 className="text-lg font-bold text-[#173b6c]">{cert.title}</h4>
                  <h5 className="text-[#149ddd] font-semibold mb-2">{cert.issuer}</h5>
                  <p className="italic mb-2">{cert.date}</p>
                  <p className="text-gray-600">{cert.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
