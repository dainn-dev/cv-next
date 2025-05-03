"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { saveSkillsClient } from "@/lib/firebase/client"
import { useToast } from "@/hooks/use-toast"
import { subscribeToSkillsUpdates } from "@/lib/firebase/client"

const skillSchema = z.object({
  name: z.string().min(1, {
    message: "Skill name is required.",
  }),
  percentage: z.number().min(0).max(100),
})

const skillsFormSchema = z.object({
  skills: z.array(skillSchema),
})

type SkillsFormValues = z.infer<typeof skillsFormSchema>

export default function SkillsForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [skills, setSkills] = useState<any[]>([])

  useEffect(() => {
    const unsubscribe = subscribeToSkillsUpdates(setSkills)
    return () => unsubscribe()
  }, [])

  // Default values for the form
  const defaultValues: Partial<SkillsFormValues> = {
    skills: [
      { name: "HTML", percentage: 100 },
      { name: "CSS", percentage: 90 },
      { name: "JavaScript", percentage: 75 },
      { name: "PHP", percentage: 80 },
      { name: "WordPress/CMS", percentage: 90 },
      { name: "Photoshop", percentage: 55 },
    ],
  }

  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (skills && skills.length > 0) {
      form.reset({ skills })
    }
  }, [skills, form])

  const { fields, append, remove } = useFieldArray({
    name: "skills",
    control: form.control,
  })

  async function onSubmit(data: SkillsFormValues) {
    setIsLoading(true)
    try {
      await saveSkillsClient(data.skills)
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="bg-gray-50 py-4">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>Skill {index + 1}</span>
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
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    control={form.control}
                    name={`skills.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skill Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., HTML, CSS, JavaScript" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`skills.${index}.percentage`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proficiency ({field.value}%)</FormLabel>
                        <FormControl>
                          <Slider
                            min={0}
                            max={100}
                            step={1}
                            defaultValue={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            className="py-4"
                          />
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
          onClick={() => append({ name: "", percentage: 50 })}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Skill
        </Button>

        <Button type="submit" disabled={isLoading} className="bg-[#149ddd] hover:bg-[#37b3ed]">
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  )
}
