"use client"

import { useState, useEffect } from "react"
import { subscribeToServicesUpdates } from "@/lib/firebase/client"
import { Briefcase, ClipboardList, BarChart, TelescopeIcon as Binoculars, Sun, Calendar } from "lucide-react"

interface Service {
  id?: string
  icon: string
  title: string
  description: string
}

interface ServicesData {
  intro: {
    title: string
    description: string
  }
  services: Service[]
}

const iconMap: { [key: string]: any } = {
  Briefcase: Briefcase,
  ClipboardList: ClipboardList,
  BarChart: BarChart,
  Binoculars: Binoculars,
  Sun: Sun,
  Calendar: Calendar,
}

export default function Services() {
  const [data, setData] = useState<ServicesData>({
    intro: {
      title: "Services",
      description: "Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.",
    },
    services: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const unsub = subscribeToServicesUpdates((newData) => {
      if (newData) {
        setData(newData)
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  if (loading) {
    return (
      <section id="services" className="py-16">
        <div className="container mx-auto px-4">
          <div className="section-title mb-12">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
                <div className="flex gap-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="py-16">
      <div className="container mx-auto px-4">
        <div className="section-title mb-12">
          <h2>{data.intro.title}</h2>
          <p className="text-gray-600">{data.intro.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.services.map((service, index) => {
            const Icon = iconMap[service.icon] || Briefcase
            return (
              <div key={service.id || index} className="icon-box bg-white p-6 rounded-lg shadow-sm" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="flex gap-4">
                  <div className="icon">
                    <Icon className="h-10 w-10 text-[#149ddd]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="title text-xl font-bold mb-2">
                      <a href="#" className="text-[#173b6c] hover:text-[#149ddd]">
                        {service.title}
                      </a>
                    </h4>
                    <p className="description text-gray-600">{service.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
