"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react"
import { savePortfolioItemsClient } from "@/lib/firebase/client"
import { useToast } from "@/hooks/use-toast"
import { subscribeToPortfolioUpdates } from "@/lib/firebase/client"
import { Textarea } from "@/components/ui/textarea"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

const portfolioItemSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  imageUrl: z.string().url({
    message: "Please enter a valid image URL.",
  }),
  detailsUrl: z
    .string()
    .url({ message: "Please enter a valid details URL." })
    .optional()
    .or(z.literal('')),
  client: z.string().min(1, { message: "Client is required." }),
  date: z.string().min(1, { message: "Date is required." }),
  url: z.string().url({ message: "Please enter a valid project URL." }).optional().or(z.literal('')),
  description: z.string().min(1, { message: "Description is required." }),
  images: z.array(z.string().url({ message: "Please enter a valid image URL." })).min(1, { message: "At least one image is required." }),
})

const introSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
})

const portfolioFormSchema = z.object({
  intro: introSchema,
  items: z.array(portfolioItemSchema),
})

type PortfolioFormValues = z.infer<typeof portfolioFormSchema>

export default function PortfolioItemsForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const { toast } = useToast()
  const [expanded, setExpanded] = useState<boolean[]>([])

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      intro: {
        title: "Portfolio",
        description: "Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.",
      },
      items: [],
    },
  })

  // Sync form with real-time Firestore data
  useEffect(() => {
    setIsDataLoading(true)
    const unsubscribe = subscribeToPortfolioUpdates((data) => {
      if (data) {
        form.reset({
          intro: data.intro || form.getValues("intro"),
          items: data.items || data,
        })
      }
      setIsDataLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  })

  // Sync expanded state with fields
  useEffect(() => {
    setExpanded((prev) => {
      if (fields.length !== prev.length) {
        return Array(fields.length).fill(false)
      }
      return prev
    })
  }, [fields.length])

  async function onSubmit(data: PortfolioFormValues) {
    setIsLoading(true)
    try {
      // Convert all ids to string before saving
      const dataToSave = {
        ...data,
        items: data.items.map(item => ({
          ...item,
          id: item.id !== undefined ? String(item.id) : undefined,
        })),
      }
      await savePortfolioItemsClient(dataToSave)
      toast({
        title: "Portfolio updated",
        description: "Your portfolio items have been updated successfully.",
        variant: "success",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update portfolio items. Please try again.",
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
                    <Input placeholder="e.g., Portfolio" {...field} />
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
                    <Textarea placeholder="Enter a description for the portfolio section" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 py-4 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>Portfolio Item {index + 1}</span>
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
                      name={`items.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Project Title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.category`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white">
                              <SelectItem value="app">App</SelectItem>
                              <SelectItem value="web">Web</SelectItem>
                              <SelectItem value="card">Card</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.imageUrl`}
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
                    <FormField
                      control={form.control}
                      name={`items.${index}.detailsUrl`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Details URL (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/details" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.client`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client</FormLabel>
                          <FormControl>
                            <Input placeholder="Client Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.date`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input placeholder="January 2023" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.url`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project URL (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <RichTextEditor
                              value={field.value}
                              onChange={field.onChange}
                              className="min-h-[150px]"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.images`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Images (one per line)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="https://example.com/image1.jpg\nhttps://example.com/image2.jpg"
                              value={field.value?.join("\n") || ""}
                              onChange={e => field.onChange(e.target.value.split("\n").filter(Boolean))}
                            />
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
            onClick={() => {
              append({
                id: crypto.randomUUID(),
                title: "",
                category: "web",
                imageUrl: "https://placeholder.com/600x400",
                client: "",
                date: "",
                url: "",
                description: "",
                images: ["https://placeholder.com/600x400"],
              })
              setExpanded(exp => exp.map(() => false).concat(true))
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Portfolio Item
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-[#149ddd] hover:bg-[#37b3ed]">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  )
}