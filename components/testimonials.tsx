"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Quote } from "lucide-react"
import { subscribeToTestimonialsUpdates } from "@/lib/firebase/client"

interface Testimonial {
  name: string
  position: string
  text: string
  imageUrl: string
}

interface TestimonialsData {
  intro: {
    title: string
    description: string
  }
  testimonials: Testimonial[]
}

const TESTIMONIALS_PER_PAGE = 3

export default function Testimonials() {
  const [data, setData] = useState<TestimonialsData>({
    intro: {
      title: "Testimonials",
      description: "Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.",
    },
    testimonials: [],
  })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)

  useEffect(() => {
    const unsubscribe = subscribeToTestimonialsUpdates((newData: TestimonialsData) => {
      if (newData) {
        setData(newData)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Auto-advance carousel
  useEffect(() => {
    if (data.testimonials.length > TESTIMONIALS_PER_PAGE) {
      const interval = setInterval(() => {
        setPage((prev) => (prev + 1) % Math.ceil(data.testimonials.length / TESTIMONIALS_PER_PAGE))
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [data.testimonials.length])

  if (loading) {
    return (
      <section id="testimonials" className="py-16 bg-[#f5f8fd]">
        <div className="container mx-auto px-4">
          <div className="section-title mb-12">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(TESTIMONIALS_PER_PAGE)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="bg-white p-8 rounded-lg shadow-sm animate-pulse w-full max-w-xl mb-8 relative">
                  <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-6"></div>
                </div>
                <div className="h-24 w-24 bg-gray-200 rounded-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Pagination logic
  const totalPages = Math.ceil(data.testimonials.length / TESTIMONIALS_PER_PAGE)
  const startIdx = page * TESTIMONIALS_PER_PAGE
  const testimonialsToShow = data.testimonials.slice(startIdx, startIdx + TESTIMONIALS_PER_PAGE)

  return (
    <section id="testimonials" className="py-16 bg-[#f5f8fd]">
      <div className="container mx-auto px-4">
        <div className="section-title mb-12 text-center">
          <h2>{data.intro.title}</h2>
          <p className="text-gray-600">{data.intro.description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsToShow.map((testimonial, idx) => (
            <div key={startIdx + idx} className="flex flex-col items-center">
              {/* Testimonial Card with speech bubble */}
              <div className="relative bg-white p-8 rounded-lg shadow-md w-full text-center mb-8">
                <Quote className="h-8 w-8 text-[#c3e8fa] mx-auto mb-2" />
                <p className="italic text-gray-700 text-lg font-medium leading-relaxed">
                  {testimonial.text}
                </p>
                {/* Speech bubble pointer */}
                <div className="absolute left-1/2 -bottom-5 -translate-x-1/2 w-0 h-0 border-l-12 border-l-transparent border-r-12 border-r-transparent border-t-12 border-t-white" style={{borderLeftWidth: 24, borderRightWidth: 24, borderTopWidth: 20}} />
              </div>
              {/* User info */}
              <Image
                src={testimonial.imageUrl}
                alt={testimonial.name}
                width={96}
                height={96}
                className="rounded-full border-4 border-white shadow-md object-cover mb-2"
              />
              <h3 className="text-xl font-bold text-[#173b6c] mt-2">{testimonial.name}</h3>
              <h4 className="text-gray-500 text-base mt-1">{testimonial.position}</h4>
            </div>
          ))}
        </div>
        {/* Dots navigation */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 space-x-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full ${page === idx ? 'bg-[#149ddd]' : 'bg-gray-300'} focus:outline-none`}
                onClick={() => setPage(idx)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
