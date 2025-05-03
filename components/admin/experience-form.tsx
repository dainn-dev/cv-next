"use client"

import { useEffect, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { subscribeToExperienceUpdates, saveExperienceClient } from "@/lib/firebase/client"
import { Plus } from "lucide-react"

const experienceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, { message: "Title is required" }),
  company: z.string().min(2, { message: "Company is required" }),
  startYear: z.string().min(2, { message: "Start year is required" }),
  endYear: z.string().min(2, { message: "End year is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  description: z.string().optional(),
})

type ExperienceFormValues = {
  experience: z.infer<typeof experienceSchema>[]
}

export default function ExperienceForm() {
  const [experience, setExperience] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const unsubExp = subscribeToExperienceUpdates(setExperience)
    return () => unsubExp()
  }, [])

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(z.object({ experience: z.array(experienceSchema) })),
    defaultValues: { experience: [] },
  })

  useEffect(() => {
    form.reset({ experience })
  }, [experience, form])

  const expFieldArray = useFieldArray({ name: "experience", control: form.control })

  async function onSubmit(data: ExperienceFormValues) {
    setIsLoading(true)
    try {
      await saveExperienceClient(data.experience)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h2 className="text-xl font-bold text-[#173b6c] mb-4 border-l-4 border-[#149ddd] pl-3">Professional Experience</h2>
        {expFieldArray.fields.map((field, index) => (
          <div key={field.id} className="bg-white p-5 rounded-lg shadow-sm mb-6">
            <FormField control={form.control} name={`experience.${index}.title`} render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-bold text-[#173b6c]">Title</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name={`experience.${index}.company`} render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#149ddd] font-semibold">Company</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name={`experience.${index}.startYear`} render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Year</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name={`experience.${index}.endYear`} render={({ field }) => (
                <FormItem>
                  <FormLabel>End Year</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name={`experience.${index}.location`} render={({ field }) => (
              <FormItem>
                <FormLabel className="italic">Location</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name={`experience.${index}.description`} render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-600">Description</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="button" variant="destructive" onClick={() => expFieldArray.remove(index)} className="mt-2">Delete</Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => expFieldArray.append({ title: "", company: "", startYear: "", endYear: "", location: "", description: "" })}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Experience
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-[#149ddd] hover:bg-[#37b3ed] mt-8">
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  )
} 