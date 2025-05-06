"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, Loader2, ChevronDown, ChevronUp, Smile, FileText, Headphones, User, Star, Heart, Camera, Coffee, Book, Code, Briefcase, Award, Check, Clock, Cloud, Download, Edit, Eye, Gift, Globe, Key, Lock, Mail, Map, Music, Phone, Search, Settings, Shield, ShoppingCart, Tag, Upload, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { subscribeToFactsUpdates, saveFactsClient } from "@/lib/firebase/client"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const factSchema = z.object({
  id: z.string().optional(),
  icon: z.string().min(1, {
    message: "Icon name is required.",
  }),
  count: z.number().min(0),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
})

const factsFormSchema = z.object({
  intro: z.object({
    title: z.string().min(2, {
      message: "Title must be at least 2 characters.",
    }),
    description: z.string().min(10, {
      message: "Description must be at least 10 characters.",
    }),
  }),
  facts: z.array(factSchema),
})

type FactsFormValues = z.infer<typeof factsFormSchema>

interface Fact {
  id?: string
  icon: string
  count: number
  title: string
  description: string
}

const iconOptions = [
  "Smile",
  "FileText",
  "Headphones",
  "User",
  "Star",
  "Heart",
  "Camera",
  "Coffee",
  "Book",
  "Code",
  "Briefcase",
  "Award",
  "Check",
  "Clock",
  "Cloud",
  "Download",
  "Edit",
  "Eye",
  "Gift",
  "Globe",
  "Key",
  "Lock",
  "Mail",
  "Map",
  "Music",
  "Phone",
  "Search",
  "Settings",
  "Shield",
  "ShoppingCart",
  "Tag",
  "Trash2",
  "Upload",
  "Zap",
];

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Smile,
  FileText,
  Headphones,
  User,
  Star,
  Heart,
  Camera,
  Coffee,
  Book,
  Code,
  Briefcase,
  Award,
  Check,
  Clock,
  Cloud,
  Download,
  Edit,
  Eye,
  Gift,
  Globe,
  Key,
  Lock,
  Mail,
  Map,
  Music,
  Phone,
  Search,
  Settings,
  Shield,
  ShoppingCart,
  Tag,
  Trash2,
  Upload,
  Zap,
};

export default function FactsForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const { toast } = useToast()
  const [expanded, setExpanded] = useState<boolean[]>([])

  const form = useForm<FactsFormValues>({
    resolver: zodResolver(factsFormSchema),
    defaultValues: {
      intro: {
        title: "Facts",
        description: "Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.",
      },
      facts: [],
    },
  })

  // Sync form with real-time Firestore data
  useEffect(() => {
    setIsDataLoading(true)
    const unsubscribe = subscribeToFactsUpdates((data: any) => {
      if (data) {
        form.reset({
          intro: data.intro || form.getValues("intro"),
          facts: data.facts || [],
        })
      }
      setIsDataLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const { fields, append, remove } = useFieldArray({
    name: "facts",
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

  async function onSubmit(data: FactsFormValues) {
    setIsLoading(true)
    try {
      await saveFactsClient(data)
      toast({
        title: "Facts updated",
        description: "Your facts have been updated successfully.",
        variant: "success"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update facts. Please try again.",
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
                    <Input placeholder="e.g., Facts" {...field} />
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
                      placeholder="Enter a description for the facts section"
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

        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="bg-gray-50 py-4 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>Fact {index + 1}</span>
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
                      name={`facts.${index}.icon`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Icon Name</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an icon" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white">
                              {iconOptions.map((icon) => {
                                const LucideIcon = iconMap[icon];
                                return (
                                  <SelectItem key={icon} value={icon}>
                                    <span className="flex items-center gap-2">
                                      {LucideIcon ? <LucideIcon className="h-4 w-4" /> : null}
                                      {icon}
                                    </span>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`facts.${index}.count`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Count</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g., 232"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`facts.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Happy Clients" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`facts.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., consequuntur quae" {...field} />
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

        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                icon: "Smile",
                count: 0,
                title: "",
                description: "",
              })
            }
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Fact
          </Button>

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
        </div>
      </form>
    </Form>
  )
} 