"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Quote } from "lucide-react"
import { subscribeToTestimonialsUpdates } from "@/lib/firebase/client"

export default function Testimonials() {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToTestimonialsUpdates((data) => {
      setTestimonials(data)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Default testimonials to show while loading
  const defaultTestimonials = [
    {
      text: "Proin iaculis purus consequat sem cure digni ssim donec porttitora entum suscipit rhoncus. Accusantium quam, ultricies eget id, aliquam eget nibh et. Maecen aliquam, risus at semper.",
      image: "/placeholder.svg?height=150&width=150",
      name: "Saul Goodman",
      position: "CEO & Founder",
    },
    {
      text: "Export tempor illum tamen malis malis eram quae irure esse labore quem cillum quid cillum eram malis quorum velit fore eram velit sunt aliqua noster fugiat irure amet legam anim culpa.",
      image: "/placeholder.svg?height=150&width=150",
      name: "Sara Wilsson",
      position: "Designer",
    },
  ]

  const items = loading ? defaultTestimonials : testimonials

  useEffect(() => {
    let currentIndex = 0
    const interval = setInterval(() => {
      if (sliderRef.current && items.length > 1) {
        currentIndex = (currentIndex + 1) % items.length
        const slideWidth = sliderRef.current.clientWidth
        sliderRef.current.scrollTo({
          left: currentIndex * slideWidth,
          behavior: "smooth",
        })
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [items.length])

  return (
    <section id="testimonials" className="py-16 bg-[#f5f8fd]">
      <div className="container mx-auto px-4">
        <div className="section-title mb-12">
          <h2>Testimonials</h2>
          <p className="text-gray-600">
            Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint
            consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit
            in iste officiis commodi quidem hic quas.
          </p>
        </div>

        <div className="relative overflow-hidden" data-aos="fade-up" data-aos-delay="100">
          <div
            ref={sliderRef}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {items.map((testimonial, index) => (
              <div key={index} className="min-w-full snap-center px-4">
                <div className="testimonial-item relative bg-white p-8 rounded-lg shadow-sm">
                  <Quote className="h-8 w-8 text-[#c3e8fa] absolute top-4 left-4 opacity-30" />
                  <p className="italic text-gray-600 mb-6 relative z-10 pl-6">{testimonial.text}</p>
                  <div className="flex items-center">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={70}
                      height={70}
                      className="rounded-full border-4 border-white shadow-sm mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-[#173b6c]">{testimonial.name}</h3>
                      <h4 className="text-sm text-gray-500">{testimonial.position}</h4>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6 space-x-2">
            {items.map((_, index) => (
              <button
                key={index}
                className="w-3 h-3 rounded-full bg-gray-300 hover:bg-[#149ddd] focus:outline-none"
                onClick={() => {
                  if (sliderRef.current) {
                    const slideWidth = sliderRef.current.clientWidth
                    sliderRef.current.scrollTo({
                      left: index * slideWidth,
                      behavior: "smooth",
                    })
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
