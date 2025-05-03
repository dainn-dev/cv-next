"use client"

import { useEffect, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { subscribeToEducationUpdates, saveEducationClient } from "@/lib/firebase/client"
import { Plus } from "lucide-react"

const educationSchema = z.object({
  id: z.string().optional(),
  degree: z.string().min(2, { message: "Degree is required" }),
  school: z.string().min(2, { message: "School is required" }),
  startYear: z.string().min(2, { message: "Start year is required" }),
  endYear: z.string().min(2, { message: "End year is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  description: z.string().optional(),
})

type EducationFormValues = {
  education: z.infer<typeof educationSchema>[]
}

export default function EducationForm() {
  const [education, setEducation] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const unsubEdu = subscribeToEducationUpdates(setEducation)
    return () => unsubEdu()
  }, [])

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(z.object({ education: z.array(educationSchema) })),
    defaultValues: { education: [] },
  })

  useEffect(() => {
    form.reset({ education })
  }, [education, form])

  const eduFieldArray = useFieldArray({ name: "education", control: form.control })

  async function onSubmit(data: EducationFormValues) {
    setIsLoading(true)
    try {
      await saveEducationClient(data.education)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h2 className="text-xl font-bold text-[#173b6c] mb-4 border-l-4 border-[#149ddd] pl-3">Education</h2>
        {eduFieldArray.fields.map((field, index) => (
          <div key={field.id} className="bg-white p-5 rounded-lg shadow-sm mb-6">
            <FormField control={form.control} name={`education.${index}.degree`} render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-bold text-[#173b6c]">Degree</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name={`education.${index}.school`} render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#149ddd] font-semibold">School</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name={`education.${index}.startYear`} render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Year</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name={`education.${index}.endYear`} render={({ field }) => (
                <FormItem>
                  <FormLabel>End Year</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name={`education.${index}.location`} render={({ field }) => (
              <FormItem>
                <FormLabel className="italic">Location</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name={`education.${index}.description`} render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-600">Description</FormLabel>
                <FormControl><Textarea {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="button" variant="destructive" onClick={() => eduFieldArray.remove(index)} className="mt-2">Delete</Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => eduFieldArray.append({ degree: "", school: "", startYear: "", endYear: "", location: "", description: "" })}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Education
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-[#149ddd] hover:bg-[#37b3ed] mt-8">
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  )
} 