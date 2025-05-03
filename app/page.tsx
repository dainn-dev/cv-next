import Sidebar from "@/components/sidebar"
import Hero from "@/components/hero"
import About from "@/components/about"
import Facts from "@/components/facts"
import Skills from "@/components/skills"
import Resume from "@/components/resume"
import Portfolio from "@/components/portfolio"
import Services from "@/components/services"
import Testimonials from "@/components/testimonials"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import BackToTop from "@/components/back-to-top"

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <main className="w-full md:ml-72">
        <Hero />
        <About />
        <Facts />
        <Skills />
        <Resume />
        <Portfolio />
        <Services />
        <Testimonials />
        <Contact />
        <Footer />
        <BackToTop />
      </main>
    </div>
  )
}
