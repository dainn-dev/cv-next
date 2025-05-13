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
import { Plus, ChevronDown, ChevronUp, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

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
  const [isDataLoading, setIsDataLoading] = useState(true)
  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(z.object({ experience: z.array(experienceSchema) })),
    defaultValues: { experience: [] },
  })
  const expFieldArray = useFieldArray({ name: "experience", control: form.control })
  const [expanded, setExpanded] = useState<boolean[]>([])
  const { toast } = useToast()

  useEffect(() => {
    setIsDataLoading(true)
    const unsubExp = subscribeToExperienceUpdates((data) => {
      setExperience(data)
      setIsDataLoading(false)
    })
    return () => unsubExp()
  }, [])

  useEffect(() => {
    form.reset({ experience })
  }, [experience, form])

  useEffect(() => {
    setExpanded((prev) => {
      if (expFieldArray.fields.length !== prev.length) {
        return Array(expFieldArray.fields.length).fill(false)
      }
      return prev
    })
  }, [expFieldArray.fields.length])

  async function onSubmit(data: ExperienceFormValues) {
    setIsLoading(true)
    try {
      await saveExperienceClient(data.experience)
      toast({
        title: "Experience updated",
        description: "Your experience information has been updated successfully.",
        variant: "success"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update experience. Please try again.",
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
        <h2 className="text-xl font-bold text-[#173b6c] mb-4 border-l-4 border-[#149ddd] pl-3">Professional Experience</h2>
        {expFieldArray.fields.map((field, index) => (
          <div key={field.id} className="bg-white p-5 rounded-lg shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#173b6c]">Experience {index + 1}</span>
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
                onClick={() => expFieldArray.remove(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            {expanded[index] && (
              <>
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
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        className="min-h-[150px]"
                      />
                    </FormControl>
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
            onClick={() => expFieldArray.append({ title: "", company: "", startYear: "", endYear: "", location: "", description: "" })}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Experience
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-[#149ddd] hover:bg-[#37b3ed]">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 