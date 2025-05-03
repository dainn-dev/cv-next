import { Briefcase, ClipboardList, BarChart, TelescopeIcon as Binoculars, Sun, Calendar } from "lucide-react"

export default function Services() {
  const services = [
    {
      icon: <Briefcase className="h-10 w-10 text-[#149ddd]" />,
      title: "Lorem Ipsum",
      description:
        "Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident",
    },
    {
      icon: <ClipboardList className="h-10 w-10 text-[#149ddd]" />,
      title: "Dolor Sitema",
      description:
        "Minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat tarad limino ata",
    },
    {
      icon: <BarChart className="h-10 w-10 text-[#149ddd]" />,
      title: "Sed ut perspiciatis",
      description:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
    },
    {
      icon: <Binoculars className="h-10 w-10 text-[#149ddd]" />,
      title: "Magni Dolores",
      description:
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    },
    {
      icon: <Sun className="h-10 w-10 text-[#149ddd]" />,
      title: "Nemo Enim",
      description:
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque",
    },
    {
      icon: <Calendar className="h-10 w-10 text-[#149ddd]" />,
      title: "Eiusmod Tempor",
      description:
        "Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi",
    },
  ]

  return (
    <section id="services" className="py-16">
      <div className="container mx-auto px-4">
        <div className="section-title mb-12">
          <h2>Services</h2>
          <p className="text-gray-600">
            Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint
            consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit
            in iste officiis commodi quidem hic quas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={index} className="icon-box" data-aos="fade-up" data-aos-delay={index * 100}>
              <div className="icon mb-4">{service.icon}</div>
              <h4 className="title text-xl font-bold mb-2">
                <a href="#" className="text-[#173b6c] hover:text-[#149ddd]">
                  {service.title}
                </a>
              </h4>
              <p className="description text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
