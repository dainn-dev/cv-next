"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { saveProfileClient } from "@/lib/firebase/client"
import { useToast } from "@/hooks/use-toast"
import { subscribeToProfileUpdates } from "@/lib/firebase/client"

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  about: z.string().min(10, {
    message: "About must be at least 10 characters.",
  }),
  aboutTop: z.string().min(10, { message: "About Top must be at least 10 characters." }).optional(),
  aboutBottom: z.string().min(10, { message: "About Bottom must be at least 10 characters." }).optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(5, {
    message: "Phone must be at least 5 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  birthday: z.string().min(2, {
    message: "Birthday must be at least 2 characters.",
  }),
  website: z.string().url({
    message: "Please enter a valid URL.",
  }),
  degree: z.string().min(2, {
    message: "Degree must be at least 2 characters.",
  }),
  freelance: z.string().min(2, {
    message: "Freelance status must be at least 2 characters.",
  }),
  image: z.string().url({ message: "Please enter a valid image URL." }).optional(),
  resumeIntro: z.string().min(10, { message: "Resume introduction must be at least 10 characters." }).optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Default values for the form
  const defaultValues: Partial<ProfileFormValues> = {
    name: "Your Name",
    title: "UI/UX Designer & Web Developer",
    about: "Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem.",
    aboutTop: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    aboutBottom: "Officiis eligendi itaque labore et dolorum mollitia officiis optio vero. Quisquam sunt adipisci omnis et ut. Nulla accusantium dolor incidunt officia tempore. Et eius omnis. Cupiditate ut dicta maxime officiis quidem quia. Sed et consectetur qui quia repellendus itaque neque. Aliquid amet quidem ut quaerat cupiditate. Ab et eum qui repellendus omnis culpa magni laudantium dolores.",
    email: "email@example.com",
    phone: "+123 456 7890",
    location: "New York, USA",
    birthday: "1 May 1995",
    website: "www.example.com",
    degree: "Master",
    freelance: "Available",
    image: "",
    resumeIntro: "Magnam dolores commodi suscipit. Necessitatibus eius consequatur ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea. Quia fugiat sit in iste officiis commodi quidem hic quas.",
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  })

  // Sync form with real-time Firestore data
  useEffect(() => {
    const unsubscribe = subscribeToProfileUpdates((profile) => {
      if (profile) {
        form.reset({
          name: profile.name || defaultValues.name,
          title: profile.title || defaultValues.title,
          about: profile.about || defaultValues.about,
          aboutTop: profile.aboutTop || defaultValues.aboutTop,
          aboutBottom: profile.aboutBottom || defaultValues.aboutBottom,
          email: profile.email || defaultValues.email,
          phone: profile.phone || defaultValues.phone,
          location: profile.location || defaultValues.location,
          birthday: profile.birthday || defaultValues.birthday,
          website: profile.website || defaultValues.website,
          degree: profile.degree || defaultValues.degree,
          freelance: profile.freelance || defaultValues.freelance,
          image: profile.image || defaultValues.image,
          resumeIntro: profile.resumeIntro || defaultValues.resumeIntro,
        })
      }
    })
    return () => unsubscribe()
  }, [])

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)
    try {
      await saveProfileClient(data)
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Title</FormLabel>
                <FormControl>
                  <Input placeholder="UI/UX Designer & Web Developer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About</FormLabel>
              <FormControl>
                <Textarea placeholder="Write a short bio about yourself" className="min-h-[120px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aboutTop"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About Top Text</FormLabel>
              <FormControl>
                <Textarea placeholder="Top paragraph for About section" className="min-h-[80px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aboutBottom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About Bottom Text</FormLabel>
              <FormControl>
                <Textarea placeholder="Bottom paragraph for About section" className="min-h-[80px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resumeIntro"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume Introduction</FormLabel>
              <FormControl>
                <Textarea placeholder="Write an introduction for your resume section" className="min-h-[80px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+123 456 7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="New York, USA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birthday</FormLabel>
                <FormControl>
                  <Input placeholder="1 May 1995" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="www.example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="degree"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Degree</FormLabel>
                <FormControl>
                  <Input placeholder="Master" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="freelance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Freelance Status</FormLabel>
                <FormControl>
                  <Input placeholder="Available" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/your-image.jpg" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="bg-[#149ddd] hover:bg-[#37b3ed]">
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  )
}
