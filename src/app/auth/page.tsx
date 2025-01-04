// src\app\auth\sign-in\page.tsx
"use client"

import { AnimatePresence, motion } from "framer-motion"
import { SignInForm } from "@/components/custom/auth/sign-in-form"
import { SignUpForm } from "@/components/custom/auth/sign-up-form"
import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isDevelopment, setIsDevelopment] = useState(false)

  useEffect(() => {
    setIsDevelopment(process.env.NEXT_PUBLIC_NODE_ENV === 'development')
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-4xl mx-auto shadow-lg flex overflow-hidden">
        {/* Left Section - Welcome Message */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 to-primary/5 items-center justify-center border-r">
          <CardHeader className="p-12 text-center">
            <CardTitle className="text-3xl mb-4">
              {isSignUp ? "Welcome!" : "Welcome Back!"}
            </CardTitle>
            <CardDescription className="text-lg">
              {isSignUp
                ? "Create your account to get started with our amazing features."
                : "Sign in to continue your journey with us."}
            </CardDescription>
          </CardHeader>
        </div>

        {/* Right Section - Auth Forms */}
        <div className="flex-1">
          <AnimatePresence mode="wait" initial={false}>
            {!isSignUp ? (
              <motion.div
                key="sign-in"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="h-full"
              >
                <CardHeader className="text-center space-y-1 p-6 sm:p-12 pb-0">
                  <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                  <CardDescription>
                    Welcome back! Please sign in to continue.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 sm:p-12 pt-6">
                  <SignInForm />
                  {isDevelopment && (
                    <div className="text-center text-sm mt-6">
                      <p className="text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Button
                          variant="link"
                          className="text-primary p-0"
                          onClick={() => setIsSignUp(true)}
                        >
                          Sign up here
                        </Button>
                      </p>
                    </div>
                  )}
                </CardContent>
              </motion.div>
            ) : (
              isDevelopment && (
                <motion.div
                  key="sign-up"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="h-full"
                >
                  <CardHeader className="text-center space-y-1 p-6 sm:p-12 pb-0">
                    <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                    <CardDescription>
                      Join us today! Create your account to get started.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 sm:p-12 pt-6">
                    <SignUpForm />
                    <div className="text-center text-sm mt-6">
                      <p className="text-muted-foreground">
                        Already have an account?{" "}
                        <Button
                          variant="link"
                          className="text-primary p-0"
                          onClick={() => setIsSignUp(false)}
                        >
                          Sign in here
                        </Button>
                      </p>
                    </div>
                  </CardContent>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  )
}

export default Login