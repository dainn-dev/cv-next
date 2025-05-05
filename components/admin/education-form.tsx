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
import { Plus, ChevronDown, ChevronUp, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
  const [expanded, setExpanded] = useState<boolean[]>([])
  const [isDataLoading, setIsDataLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    setIsDataLoading(true)
    const unsubEdu = subscribeToEducationUpdates((data) => {
      setEducation(data)
      setIsDataLoading(false)
    })
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

  useEffect(() => {
    setExpanded((prev) => {
      if (eduFieldArray.fields.length !== prev.length) {
        return Array(eduFieldArray.fields.length).fill(false)
      }
      return prev
    })
  }, [eduFieldArray.fields.length])

  async function onSubmit(data: EducationFormValues) {
    setIsLoading(true)
    try {
      await saveEducationClient(data.education)
      toast({
        title: "Education updated",
        description: "Your education information has been updated successfully.",
        variant: "success"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update education. Please try again.",
        variant: "destructive"
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
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <h2 className="text-xl font-bold text-[#173b6c] mb-4 border-l-4 border-[#149ddd] pl-3">Education</h2>
        {eduFieldArray.fields.map((field, index) => (
          <div key={field.id} className="bg-white p-5 rounded-lg shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#173b6c]">Education {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanded(exp => exp.map((v, i) => i === index ? !v : v))}
                  className="ml-2"
                >
                  {expanded[index] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </Button>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => eduFieldArray.remove(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            {expanded[index] && (
              <>
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
              </>
            )}
          </div>
        ))}
        <div className="flex items-center gap-4 mt-8">
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
          <Button type="submit" disabled={isLoading} className="bg-[#149ddd] hover:bg-[#37b3ed]">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 