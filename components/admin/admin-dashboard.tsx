"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileForm from "./profile-form"
import PortfolioItemsForm from "./portfolio-items-form"
import SkillsForm from "./skills-form"
import TestimonialsForm from "./testimonials-form"
import ResumeForm from "@/components/admin/resume-form"
import EducationForm from "@/components/admin/education-form"
import ExperienceForm from "@/components/admin/experience-form"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="experience">Professional Experience</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <ProfileForm />
          </TabsContent>
          <TabsContent value="education">
            <EducationForm />
          </TabsContent>
          <TabsContent value="experience">
            <ExperienceForm />
          </TabsContent>
          <TabsContent value="portfolio">
            <PortfolioItemsForm />
          </TabsContent>
          <TabsContent value="skills">
            <SkillsForm />
          </TabsContent>
          <TabsContent value="testimonials">
            <TestimonialsForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
