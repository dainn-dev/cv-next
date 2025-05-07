"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react"
import { saveTestimonialsClient } from "@/lib/firebase/client"
import { useToast } from "@/hooks/use-toast"
import { subscribeToTestimonialsUpdates } from "@/lib/firebase/client"

const testimonialSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  position: z.string().min(2, {
    message: "Position must be at least 2 characters.",
  }),
  text: z.string().min(10, {
    message: "Testimonial text must be at least 10 characters.",
  }),
  imageUrl: z.string().url({
    message: "Please enter a valid image URL.",
  }),
})

const introSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
})

const testimonialsFormSchema = z.object({
  intro: introSchema,
  testimonials: z.array(testimonialSchema),
})

type TestimonialsFormValues = z.infer<typeof testimonialsFormSchema>

export default function TestimonialsForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const { toast } = useToast()
  const [expanded, setExpanded] = useState<boolean[]>([])

  const form = useForm<TestimonialsFormValues>({
    resolver: zodResolver(testimonialsFormSchema),
    defaultValues: {
      intro: {
        title: "Testimonials",
        description: "Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.",
      },
      testimonials: [],
    },
  })

  // Sync form with real-time Firestore data
  useEffect(() => {
    setIsDataLoading(true)
    const unsubscribe = subscribeToTestimonialsUpdates((data) => {
      if (data) {
        form.reset({
          intro: data.intro || form.getValues("intro"),
          testimonials: data.testimonials || [],
        })
      }
      setIsDataLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const { fields, append, remove } = useFieldArray({
    name: "testimonials",
    control: form.control,
  })

  // Sync expanded state with fields
  useEffect(() => {
    setExpanded((prev) => {
      if (fields.length !== prev.length) {
        // Collapse all by default
        return Array(fields.length).fill(false)
      }
      return prev
    })
  }, [fields.length])

  async function onSubmit(data: TestimonialsFormValues) {
    setIsLoading(true)
    try {
      await saveTestimonialsClient(data)
      toast({
        title: "Testimonials updated",
        description: "Your testimonials have been updated successfully.",
        variant: "success"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update testimonials. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isDataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <img src="/loading.gif" alt="Loading..." className="h-12 w-12" />
      </div>
    );
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
                    <Input placeholder="e.g., Testimonials" {...field} />
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
                    <Textarea placeholder="Enter a description for the testimonials section" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="bg-gray-50 py-4 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>Testimonial {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpanded(exp => exp.map((v, i) => i === index ? !v : v))}
                    className="ml-2"
                  >
                    {expanded[index] ? <ChevronUp /> : <ChevronDown />}
                  </Button>
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              {expanded[index] && (
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name={`testimonials.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Client name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`testimonials.${index}.position`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <Input placeholder="CEO & Founder" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`testimonials.${index}.imageUrl`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-6">
                    <FormField
                      control={form.control}
                      name={`testimonials.${index}.text`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Testimonial</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Client testimonial text" className="min-h-[120px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-8">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                name: "",
                position: "",
                text: "",
                imageUrl: "https://placeholder.com/150x150",
              })
            }
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Testimonial
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-[#149ddd] hover:bg-[#37b3ed]">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
