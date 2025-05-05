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
// import { saveCertificatesClient, subscribeToCertificatesUpdates } from "@/lib/firebase/client"

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
    // Placeholder for Firestore sync
    setTimeout(() => {
      form.reset({ certificates: [] })
      setIsDataLoading(false)
    }, 500)
    // Uncomment and implement Firestore sync:
    // const unsub = subscribeToCertificatesUpdates((data) => {
    //   form.reset({ certificates: data || [] })
    //   setIsDataLoading(false)
    // })
    // return () => unsub()
  }, [form])

  async function onSubmit(data: CertificateFormValues) {
    setIsLoading(true)
    // await saveCertificatesClient(data.certificates)
    setTimeout(() => setIsLoading(false), 500)
  }

  if (isDataLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center space-x-2 text-gray-500">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading certificates...</span>
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
        </div>
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
                <CardHeader className="bg-gray-50 py-4">
                  <CardTitle className="text-lg flex justify-between items-center">
                    <span>Certificate {index + 1}</span>
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
                            <Textarea placeholder="Certificate description (optional)" {...field} />
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
              onClick={() => append({ title: "", issuer: "", date: "", description: "" })}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Certificate
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