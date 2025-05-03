"use client"

import { useEffect } from "react"
import { Smile, FileText, Headphones, Users } from "lucide-react"

export default function Facts() {
  useEffect(() => {
    const counters = document.querySelectorAll(".count-number")

    const animateCounter = (counter: Element) => {
      const target = Number.parseInt(counter.getAttribute("data-target") || "0")
      const duration = 2000 // ms
      const step = target / (duration / 16) // 16ms is roughly 60fps
      let current = 0

      const updateCounter = () => {
        current += step
        if (current < target) {
          counter.textContent = Math.ceil(current).toString()
          requestAnimationFrame(updateCounter)
        } else {
          counter.textContent = target.toString()
        }
      }

      updateCounter()
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 },
    )

    counters.forEach((counter) => {
      observer.observe(counter)
    })

    return () => {
      counters.forEach((counter) => {
        observer.unobserve(counter)
      })
    }
  }, [])

  return (
    <section id="facts" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="section-title mb-12">
          <h2>Facts</h2>
          <p className="text-gray-600">
            Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint
            consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit
            in iste officiis commodi quidem hic quas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col items-center" data-aos="fade-up">
            <div className="flex justify-center items-center w-16 h-16 rounded-full bg-[#e8f7fb] mb-4">
              <Smile className="h-8 w-8 text-[#149ddd]" />
            </div>
            <div className="text-center">
              <span className="count-number text-4xl font-bold text-[#173b6c]" data-target="232">
                0
              </span>
              <p className="mt-2 text-gray-600">
                <strong>Happy Clients</strong> consequuntur quae
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center" data-aos="fade-up" data-aos-delay="100">
            <div className="flex justify-center items-center w-16 h-16 rounded-full bg-[#e8f7fb] mb-4">
              <FileText className="h-8 w-8 text-[#149ddd]" />
            </div>
            <div className="text-center">
              <span className="count-number text-4xl font-bold text-[#173b6c]" data-target="521">
                0
              </span>
              <p className="mt-2 text-gray-600">
                <strong>Projects</strong> adipisci atque cum quia aut
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center" data-aos="fade-up" data-aos-delay="200">
            <div className="flex justify-center items-center w-16 h-16 rounded-full bg-[#e8f7fb] mb-4">
              <Headphones className="h-8 w-8 text-[#149ddd]" />
            </div>
            <div className="text-center">
              <span className="count-number text-4xl font-bold text-[#173b6c]" data-target="1453">
                0
              </span>
              <p className="mt-2 text-gray-600">
                <strong>Hours Of Support</strong> aut commodi quaerat
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center" data-aos="fade-up" data-aos-delay="300">
            <div className="flex justify-center items-center w-16 h-16 rounded-full bg-[#e8f7fb] mb-4">
              <Users className="h-8 w-8 text-[#149ddd]" />
            </div>
            <div className="text-center">
              <span className="count-number text-4xl font-bold text-[#173b6c]" data-target="32">
                0
              </span>
              <p className="mt-2 text-gray-600">
                <strong>Hard Workers</strong> rerum asperiores dolor
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
