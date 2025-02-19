"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ThemeChange } from "@/components/theme/theme-change"
import { SignUpFormComponent } from "@/components/custom/auth/sign-up-form"
import { SignInFormComponent } from "@/components/custom/auth/sign-in-form-v2"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import Image from "next/image"
import red from "@lottie/red.json"
import lock from "@lottie/lock.json"
import check from "@lottie/check.json"
import Lottie, { LottieRefCurrentProps } from "lottie-react"

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isDevelopment, setIsDevelopment] = useState(false)

  useEffect(() => {
    setIsDevelopment(process.env.NEXT_PUBLIC_NODE_ENV === "development")
  }, [])

  return (
    <div className="w-full h-screen font-manrope relative">
      {/* Development Mode Indicator */}
      {isDevelopment && (
        <div className="absolute top-0 left-0 bg-red-600 text-white text-xs px-4 py-1 rounded-br-lg shadow-md z-50">
          Development Mode
        </div>
      )}

      <div className="w-full h-full flex justify-end items-center relative bg-white dark:bg-[#19191e]">
        <div className="absolute inset-0 bg-gradient-to-tr from-blueColor/10 via-white via-50% to-blueColor/10 dark:hidden" />
        <div className="w-full z-20 h-full flex justify-center px-4 items-center ">
          <Card className="w-full max-w-5xl max-h-[90dvh] mx-auto shadow-xl flex flex-row overflow-hidden border border-gray-500/30 dark:border-[#2a2a30] dark:bg-[#19191e]">
            {/* Left Section - Welcome Message */}
            <div className="w-full dark:bg-[#19191e] rounded-l-lg">
              <AnimatePresence mode="wait" initial={false}>
                {!isSignUp ? (
                  <motion.div
                    key="sign-in"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="h-full w-full"
                  >
                    <CardHeader className="w-full text-left md:flex-row flex-col gap-2 space-y-1 flex items-center md:justify-start justify-center">
                      <Image
                        src="/images/new.png"
                        alt="New Image"
                        width={96}
                        height={96}
                        className="w-24 h-24"
                        loading="eager"
                      />
                      <Image
                        src="/images/logo.png"
                        alt="Logo"
                        width={96}
                        height={96}
                        className="w-24 h-24 rounded-full"
                        loading="eager"
                      />
                      <div className="pl-2">
                        <CardTitle className="text-xl w-full font-bold font-inter tracking-tight uppercase">
                          City Government of Legazpi
                        </CardTitle>
                        <CardDescription>
                          Office of the City Civil Registrar
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardHeader className="text-left space-y-1">
                      <CardTitle className="text-2xl font-bold capitalize">
                        Welcome Back
                      </CardTitle>
                      <CardDescription className="font-normal">
                        Sign in to your account to continue
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SignInFormComponent />
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
                        <CardTitle className="text-2xl font-bold">
                          Create Account
                        </CardTitle>
                        <CardDescription>
                          Join us today! Create your account to get started.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 sm:p-12 pt-6">
                        <SignUpFormComponent />
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

            {/* Right Section - Auth Forms */}
            <RightSide />
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Login

const lottieSet = [
  { animationData: red, color: "#fcd000" },
  { animationData: check, color: "#fcd000" },
  { animationData: lock, color: "#fcd000" },
  // { animationData: files, color: "#fcd000" },
]

const RightSide = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSliding, setIsSliding] = useState(false)
  const lottieRef = useRef<LottieRefCurrentProps>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSliding(true)
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % lottieSet.length)
        setIsSliding(false)
      }, 500)
    }, 7000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full hidden lg:flex flex-col items-center justify-center blueColor dark:bg-blueColor/30 bg-chart-1/5 relative overflow-hidden">
      <span className="z-50 absolute top-2 right-0">
        <ThemeChange />
      </span>

      <div className="w-full top-6 absolute flex flex-col justify-start items-start px-6">
        <CardTitle className="text-3xl font-bold font-manrope dark:text-white">
          <span
            style={{
              color: currentIndex === 0 ? lottieSet[0].color : "inherit",
            }}
          >
            Secure.
          </span>{" "}
          <span
            style={{
              color: currentIndex === 1 ? lottieSet[1].color : "inherit",
            }}
          >
            Reliable.
          </span>{" "}
          <span
            style={{
              color: currentIndex === 2 ? lottieSet[2].color : "inherit",
            }}
          >
            Efficient.
          </span>
        </CardTitle>
        <CardDescription className="max-w-md pt-2">
          Committed to provide high-quality services and ensuring that all the
          data stored is protected.
        </CardDescription>

      </div>

      <div className="flex gap-2 mt-4 absolute bottom-6 z-50">
        {lottieSet.map((_, index) => (
          <div
            key={index}
            className={`rounded-full transition-colors duration-300 ${currentIndex === index
              ? "bg-muted-foreground dark:bg-white h-3 w-6"
              : "border-2 border-muted-foreground dark:border-white w-3 h-3"
              }`}
          />
        ))}
      </div>

      <div
        className={`w-fit h-full overflow-hidden transition-transform duration-500 ${isSliding ? "translate-y-full" : "translate-y-[30%]"
          }`}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={lottieSet[currentIndex].animationData}
          loop
          autoplay
          className="w-56 h-56"
        />
      </div>
    </div>
  )
}
