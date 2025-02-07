"use client"

import { toast } from "sonner"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/signin/signin-input"
import { Label } from "@/components/ui/signin/signin-label"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { handleCredentialsSignin } from "@/hooks/auth-actions"
import { signInSchema, type SignInForm } from "@/lib/validation"
import { PasswordInput } from "@/components/custom/general/password-input"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import type React from "react" // Added import for React

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-[var(--yellowColor)] to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-[var(--yellowColor)] to-transparent" />
    </>
  )
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>
}

export const SignInFormComponent = () => {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: SignInForm) => {
    setIsLoading(true)

    try {
      const result = await handleCredentialsSignin(values)

      if (result?.success) {
        toast.success("Signed in successfully")
        window.location.href = result.redirectTo || "/dashboard"
      } else {
        toast.error(result?.message || "Sign-in failed")
      }
    } catch (error) {
      console.error("Sign-in error:", error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="my-2">
          <LabelInputContainer className="mb-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email">Email Address</Label>
                  <FormControl>
                    <Input id="email" placeholder="name@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-8">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="password">Password</Label>
                  <FormControl>
                    <Input placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </LabelInputContainer>
          <button
  type="submit"
  disabled={isLoading}
  className="bg-gradient-to-br relative group/btn from-blue-600 dark:from-[var(--blueColor)] dark:to-[var(--blueColor)] to-blue-800 block dark:bg-[var(--blueColor)] w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--blueColor)_inset,0px_-1px_0px_0px_var(--blueColor)_inset]"
>
  {isLoading ? "Signing In..." : "Sign In"} &rarr;
  <BottomGradient />
</button>

        </form>
      </Form>
  )
}

