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
import { Trash2, Plus } from "lucide-react"
import { savePortfolioItemsClient } from "@/lib/firebase/client"
import { useToast } from "@/hooks/use-toast"
import { subscribeToPortfolioUpdates } from "@/lib/firebase/client"

const portfolioItemSchema = z.object({
  id: z.string().optional(),
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
    .url({
      message: "Please enter a valid details URL.",
    })
    .optional(),
})

const portfolioFormSchema = z.object({
  items: z.array(portfolioItemSchema),
})

type PortfolioFormValues = z.infer<typeof portfolioFormSchema>

export default function PortfolioItemsForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [portfolioItems, setPortfolioItems] = useState<any[]>([])

  useEffect(() => {
    const unsubscribe = subscribeToPortfolioUpdates(setPortfolioItems)
    return () => unsubscribe()
  }, [])

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      items: [
        {
          id: "1",
          title: "App 1",
          category: "app",
          imageUrl: "https://placeholder.com/600x400",
          detailsUrl: "https://example.com/portfolio/app1",
        },
        {
          id: "2",
          title: "Web 3",
          category: "web",
          imageUrl: "https://placeholder.com/600x400",
          detailsUrl: "https://example.com/portfolio/web3",
        },
        {
          id: "3",
          title: "Card 2",
          category: "card",
          imageUrl: "https://placeholder.com/600x400",
          detailsUrl: "https://example.com/portfolio/card2",
        },
      ],
    },
  })

  useEffect(() => {
    if (portfolioItems && portfolioItems.length > 0) {
      form.reset({ items: portfolioItems })
    }
  }, [portfolioItems, form])

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: form.control,
  })

  async function onSubmit(data: PortfolioFormValues) {
    setIsLoading(true)
    try {
      await savePortfolioItemsClient(data.items)
      toast({
        title: "Portfolio updated",
        description: "Your portfolio items have been updated successfully.",
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 py-4">
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>Portfolio Item {index + 1}</span>
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
                          <SelectContent>
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
              title: "",
              category: "web",
              imageUrl: "https://placeholder.com/600x400",
            })
          }
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Portfolio Item
        </Button>

        <Button type="submit" disabled={isLoading} className="bg-[#149ddd] hover:bg-[#37b3ed]">
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  )
}
