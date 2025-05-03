import { Suspense } from "react"
import SkillsContent from "./skills-content"

export default function Skills() {
  return (
    <section id="skills" className="py-16 bg-[#f5f8fd]">
      <div className="container mx-auto px-4">
        <div className="section-title mb-12">
          <h2>Skills</h2>
          <p className="text-gray-600">
            Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint
            consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit
            in iste officiis commodi quidem hic quas.
          </p>
        </div>

        <Suspense fallback={<p>Loading skills...</p>}>
          <SkillsContent />
        </Suspense>
      </div>
    </section>
  )
}
