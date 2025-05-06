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
import { Textarea } from "@/components/ui/textarea"
import { saveServicesClient, subscribeToServicesUpdates } from "@/lib/firebase/client"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as lucideIcons from "lucide-react";

const serviceSchema = z.object({
  id: z.string().optional(),
  icon: z.string().min(1, { message: "Icon name is required" }),
  title: z.string().min(2, { message: "Title is required" }),
  description: z.string().min(5, { message: "Description is required" }),
})

const introSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
})

const servicesFormSchema = z.object({
  intro: introSchema,
  services: z.array(serviceSchema),
})

type ServicesFormValues = z.infer<typeof servicesFormSchema>

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

export default function ServicesForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [expanded, setExpanded] = useState<boolean[]>([])
  const { toast } = useToast()

  const form = useForm<ServicesFormValues>({
    resolver: zodResolver(servicesFormSchema),
    defaultValues: {
      intro: {
        title: "Services",
        description: "Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.",
      },
      services: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    name: "services",
    control: form.control,
  })

  useEffect(() => {
    setIsDataLoading(true)
    const unsub = subscribeToServicesUpdates((data) => {
      form.reset({
        intro: data.intro || form.getValues("intro"),
        services: data.services || [],
      })
      setIsDataLoading(false)
    })
    return () => unsub()
  }, [form])

  useEffect(() => {
    setExpanded((prev) => {
      if (fields.length !== prev.length) {
        return Array(fields.length).fill(false)
      }
      return prev
    })
  }, [fields.length])

  async function onSubmit(data: ServicesFormValues) {
    setIsLoading(true)
    try {
      await saveServicesClient(data)
      toast({
        title: "Services updated",
        description: "Your services have been updated successfully.",
        variant: "success"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update services. Please try again.",
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
                    <Input placeholder="e.g., Services" {...field} />
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
                    <Textarea placeholder="Enter a description for the services section" className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <Card key={field.id}>
                <CardHeader className="bg-gray-50 py-4 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span>Service {index + 1}</span>
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
                        name={`services.${index}.icon`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Icon Name</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <span className="flex items-center gap-2">
                                    <SelectValue placeholder="Select an icon" />
                                  </span>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white">
                                <div className="px-2 py-1 text-xs text-gray-500">General</div>
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
                        name={`services.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Service Title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`services.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Service description" {...field} />
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
            <div className="flex items-center gap-4 mt-8">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ icon: "", title: "", description: "" })}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Service
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
          </CardContent>
        </Card>
      </form>
    </Form>
  )
} 