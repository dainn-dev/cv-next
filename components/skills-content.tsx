"use client"

import { useState, useEffect } from "react"
import { subscribeToSkillsUpdates } from "@/lib/firebase/client"

export default function SkillsContent() {
  const [skills, setSkills] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToSkillsUpdates((data) => {
      setSkills(data)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Default skills to show while loading
  const defaultSkills = [
    { name: "HTML", percentage: 100 },
    { name: "CSS", percentage: 90 },
    { name: "JavaScript", percentage: 75 },
    { name: "PHP", percentage: 80 },
    { name: "WordPress/CMS", percentage: 90 },
    { name: "Photoshop", percentage: 55 },
  ]

  const skillsData = loading ? defaultSkills : skills

  // Split skills into two columns
  const halfwayIndex = Math.ceil(skillsData.length / 2)
  const firstColumnSkills = skillsData.slice(0, halfwayIndex)
  const secondColumnSkills = skillsData.slice(halfwayIndex)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div data-aos="fade-up">
        {firstColumnSkills.map((skill, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-[#173b6c] font-medium">{skill.name}</span>
              <span className="text-[#149ddd]">{skill.percentage}%</span>
            </div>
            <div className="progress-bar">
              <div style={{ width: `${skill.percentage}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      <div data-aos="fade-up" data-aos-delay="100">
        {secondColumnSkills.map((skill, index) => (
          <div key={index} className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-[#173b6c] font-medium">{skill.name}</span>
              <span className="text-[#149ddd]">{skill.percentage}%</span>
            </div>
            <div className="progress-bar">
              <div style={{ width: `${skill.percentage}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
