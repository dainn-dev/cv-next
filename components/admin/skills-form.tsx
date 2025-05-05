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
import { saveSkillsClient } from "@/lib/firebase/client"
import { useToast } from "@/hooks/use-toast"
import { subscribeToSkillsUpdates } from "@/lib/firebase/client"

const technicalSkillSchema = z.object({
  category: z.string().min(1, { message: "Category is required." }),
  details: z.string().min(1, { message: "Details are required." }),
})

const skillsFormSchema = z.object({
  intro: z.object({
    title: z.string().min(2, { message: "Title must be at least 2 characters." }),
    description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  }),
  technicalSkills: z.array(technicalSkillSchema),
  softSkills: z.array(z.string().min(1, { message: "Soft skill cannot be empty." })),
})

type SkillsFormValues = z.infer<typeof skillsFormSchema>

export default function SkillsForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const { toast } = useToast()

  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsFormSchema),
    defaultValues: {
      intro: {
        title: "Skills",
        description: "Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.",
      },
      technicalSkills: [],
      softSkills: [],
    },
  })

  useEffect(() => {
    setIsDataLoading(true)
    const unsubscribe = subscribeToSkillsUpdates((data) => {
      if (data) {
        form.reset({
          intro: data.intro || form.getValues("intro"),
          technicalSkills: data.technicalSkills || [],
          softSkills: data.softSkills || [],
        })
      }
      setIsDataLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const { fields: technicalFields, append: appendTechnical, remove: removeTechnical } = useFieldArray({
    name: "technicalSkills",
    control: form.control,
  })

  const { fields: softFields, append: appendSoft, remove: removeSoft } = useFieldArray({
    name: "softSkills",
    control: form.control,
  })

  async function onSubmit(data: SkillsFormValues) {
    setIsLoading(true)
    try {
      await saveSkillsClient(data)
      toast({
        title: "Skills updated",
        description: "Your skills have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update skills. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isDataLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center space-x-2 text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading skills data...</span>
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
          <div className="grid grid-cols-1 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                    <Input placeholder="e.g., Skills" {...field} />
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
                    <Textarea
                      placeholder="Enter a description for the skills section"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technical Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {technicalFields.map((field, index) => (
              <Card key={field.id}>
                <CardHeader className="bg-gray-50 py-4">
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span>Technical Skill {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTechnical(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name={`technicalSkills.${index}.category`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Languages & Frameworks" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`technicalSkills.${index}.details`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Details</FormLabel>
                          <FormControl>
                            <Textarea placeholder="e.g., C#, ASP.NET Core, .NET 6/7, ..." {...field} />
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
              onClick={() => appendTechnical({ category: "", details: "" })}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Technical Skill
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Soft Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {softFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2 mb-2">
                <FormField
                  control={form.control}
                  name={`softSkills.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="e.g., Strong analytical and problem-solving skills" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSoft(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendSoft("")}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Soft Skill
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
