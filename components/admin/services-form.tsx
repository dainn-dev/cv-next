"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
// import { saveServicesClient, subscribeToServicesUpdates } from "@/lib/firebase/client"

const serviceSchema = z.object({
  id: z.string().optional(),
  icon: z.string().min(1, { message: "Icon name is required" }),
  title: z.string().min(2, { message: "Title is required" }),
  description: z.string().min(5, { message: "Description is required" }),
})

const introSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
})

const servicesFormSchema = z.object({
  intro: introSchema,
  services: z.array(serviceSchema),
})

type ServicesFormValues = z.infer<typeof servicesFormSchema>

export default function ServicesForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)

  const form = useForm<ServicesFormValues>({
    resolver: zodResolver(servicesFormSchema),
    defaultValues: {
      intro: {
        title: "Services",
        description: "Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.",
      },
      services: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    name: "services",
    control: form.control,
  })

  useEffect(() => {
    setIsDataLoading(true)
    // Placeholder for Firestore sync
    setTimeout(() => {
      form.reset({
        intro: {
          title: "Services",
          description: "Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.",
        },
        services: [],
      })
      setIsDataLoading(false)
    }, 500)
    // Uncomment and implement Firestore sync:
    // const unsub = subscribeToServicesUpdates((data) => {
    //   form.reset({
    //     intro: data.intro || form.getValues("intro"),
    //     services: data.services || [],
    //   })
    //   setIsDataLoading(false)
    // })
    // return () => unsub()
  }, [form])

  async function onSubmit(data: ServicesFormValues) {
    setIsLoading(true)
    // await saveServicesClient(data)
    setTimeout(() => setIsLoading(false), 500)
  }

  if (isDataLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center space-x-2 text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading services...</span>
        </div>
        <div className="space-y-4">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Section Intro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="intro.title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Services" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="intro.description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter a description for the services section" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <Card key={field.id}>
                <CardHeader className="bg-gray-50 py-4">
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span>Service {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name={`services.${index}.icon`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Icon Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Briefcase, ClipboardList, BarChart" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`services.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Service Title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`services.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Service description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ icon: "", title: "", description: "" })}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </CardContent>
        </Card>
        <Button type="submit" disabled={isLoading} className="bg-[#149ddd] hover:bg-[#37b3ed]">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </Form>
  )
} 