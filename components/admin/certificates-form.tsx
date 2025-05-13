"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, Loader2, ChevronDown, ChevronUp } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { saveCertificatesClient, subscribeToCertificatesUpdates } from "@/lib/firebase/client"
import { useToast } from "@/hooks/use-toast"
import { RichTextEditor } from "@/components/ui/rich-text-editor"

const certificateSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, { message: "Title is required" }),
  issuer: z.string().min(2, { message: "Issuer is required" }),
  date: z.string().min(2, { message: "Date is required" }),
  description: z.string().optional(),
})

type CertificateFormValues = {
  certificates: z.infer<typeof certificateSchema>[]
}

export default function CertificatesForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [expanded, setExpanded] = useState<boolean[]>([])
  const { toast } = useToast()

  const form = useForm<CertificateFormValues>({
    resolver: zodResolver(z.object({ certificates: z.array(certificateSchema) })),
    defaultValues: { certificates: [] },
  })

  const { fields, append, remove } = useFieldArray({
    name: "certificates",
    control: form.control,
  })

  useEffect(() => {
    setIsDataLoading(true)
    const unsub = subscribeToCertificatesUpdates((data) => {
      form.reset({ certificates: data || [] })
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

  async function onSubmit(data: CertificateFormValues) {
    setIsLoading(true)
    try {
      await saveCertificatesClient(data.certificates)
      toast({
        title: "Certificates updated",
        description: "Your certificates have been updated successfully.",
        variant: "success"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update certificates. Please try again.",
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
            <CardTitle>Certificates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <Card key={field.id}>
                <CardHeader className="bg-gray-50 py-4 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span>Certificate {index + 1}</span>
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
                        name={`certificates.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., AWS Certified Solutions Architect" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`certificates.${index}.issuer`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Issuer</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Amazon Web Services" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`certificates.${index}.date`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., June 2023" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`certificates.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <RichTextEditor
                                value={field.value || ''}
                                onChange={field.onChange}
                                className="min-h-[150px]"
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
            <div className="flex items-center gap-4 mt-8">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ title: "", issuer: "", date: "", description: "" })}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Certificate
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