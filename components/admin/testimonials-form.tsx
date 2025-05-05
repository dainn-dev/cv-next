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
import { Trash2, Plus } from "lucide-react"
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

const testimonialsFormSchema = z.object({
  testimonials: z.array(testimonialSchema),
})

type TestimonialsFormValues = z.infer<typeof testimonialsFormSchema>

export default function TestimonialsForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const { toast } = useToast()

  const form = useForm<TestimonialsFormValues>({
    resolver: zodResolver(testimonialsFormSchema),
    defaultValues: {
      testimonials: [],
    },
  })

  // Sync form with real-time Firestore data
  useEffect(() => {
    setIsDataLoading(true)
    const unsubscribe = subscribeToTestimonialsUpdates((data) => {
      if (data) {
        form.reset({
          testimonials: data,
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

  async function onSubmit(data: TestimonialsFormValues) {
    setIsLoading(true)
    try {
      await saveTestimonialsClient(data.testimonials)
      toast({
        title: "Testimonials updated",
        description: "Your testimonials have been updated successfully.",
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="bg-gray-50 py-4">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>Testimonial {index + 1}</span>
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
            </Card>
          ))}
        </div>

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
      </form>
    </Form>
  )
}
