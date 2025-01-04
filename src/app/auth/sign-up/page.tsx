'use client'

import { toast } from "sonner"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signUpSchema, SignUpForm } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { PasswordInput } from "@/components/custom/general/password-input"
import { handleCredentialsSignin, handleSignUp } from "@/hooks/auth-actions"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const Page = () => {
  const [isLoading, setIsLoading] = useState(false)
  // Use NEXT_PUBLIC env variable to determine development mode
  const isDevelopment = process.env.NEXT_PUBLIC_NODE_ENV === 'development'
  console.log("isDevelopment=", isDevelopment)
  console.log("process.env.NEXT_PUBLIC_NODE_ENV=", process.env.NEXT_PUBLIC_NODE_ENV)

  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: process.env.NEXT_PUBLIC_NODE_ENV === 'development' ? "mar" : "",
      email: process.env.NEXT_PUBLIC_NODE_ENV === 'development' ? "mar@test.com" : "",
      password: process.env.NEXT_PUBLIC_NODE_ENV === 'development' ? "mar1234!" : "",
      confirmPassword: process.env.NEXT_PUBLIC_NODE_ENV === 'development' ? "mar1234!" : "",
      role: "STAFF"
    },
  })

  const onSubmit = async (values: SignUpForm) => {
    setIsLoading(true)

    const data = await handleSignUp(values)

    if (data.success) {
      toast.success("Signed up successfully")

      const signInValues = {
        email: values.email,
        password: values.password,
      }
      await handleCredentialsSignin(signInValues)
    }
    else {
      toast.error(data.message)
    }
    setIsLoading(false)
  }

  const fields = [
    { name: "name", label: "Name", type: "text", placeholder: "Enter your name" },
    { name: "email", label: "Email", type: "email", placeholder: "Enter your email" },
  ] as const

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4">Create an Account</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{field.name === "name" ? "Name" : "Email"}</FormLabel>
                    <FormControl>
                      <Input
                        type={fields.find(f => f.name === field.name)?.type}
                        placeholder={fields.find(f => f.name === field.name)?.placeholder}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            {isDevelopment && (
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="STAFF">Staff</SelectItem>
                        <SelectItem value="USER">User</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Enter your password"
                      name="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Confirm your password"
                      name="confirmPassword"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button variant="outline" type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Page