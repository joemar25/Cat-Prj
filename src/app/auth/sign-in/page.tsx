// src/app/sign-in/page.tsx
'use client'

import { toast } from "sonner"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signInSchema, SignInForm } from "@/lib/zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { handleCredentialsSignin } from "@/hooks/auth-actions"
import { PasswordInput } from "@/components/custom/general/password-input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { SignUpModal } from "@/components/modal/SignUpModal" 

const Page = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: SignInForm) => {
    setIsLoading(true)
    const result = await handleCredentialsSignin(values)

    if (result?.message) {
      toast.error(result.message)
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12 mt-28">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Sign In</h1>
          </div>
          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-600">
              Log in to continue.
            </span>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        placeholder="Enter your password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1D2050] hover:bg-[#1D2261] text-white"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>
          <div className="text-center text-[12px] mt-[10px]">
            <p>
              Don't have an account?{" "}
              <span
                onClick={() => setIsSignUpModalOpen(true)} // Open the modal
                className="underline cursor-pointer"
              >
                Sign up here
              </span>
            </p>
          </div>
        </div>
        <div className="hidden lg:flex flex-1 bg-[#1D2050] items-center justify-center">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            // Image or illustration here
          />
        </div>
      </div>

      {/* Render the SignUpModal */}
      <SignUpModal isOpen={isSignUpModalOpen} onClose={() => setIsSignUpModalOpen(false)} />
    </div>
  )
}

export default Page