// src\app\auth\sign-in\page.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SignInForm } from "@/components/custom/auth/sign-in-form";
import { SignUpForm } from "@/components/custom/auth/sign-up-form";
import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import certificate from "../../../public/lottie/certificate.json";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { ThemeChange } from "@/components/theme/theme-change";

const Login = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isDevelopment, setIsDevelopment] = useState(false);
  const { setTheme, theme } = useTheme();

  const lottieRef = useRef<LottieRefCurrentProps>(null);
  useEffect(() => {
    setIsDevelopment(process.env.NEXT_PUBLIC_NODE_ENV === "development");
  }, []);

  return (
    <div className="w-full h-screen font-inter">
      <div className="w-full h-full flex justify-end items-center relative bg-white dark:bg-[#19191e]">
        <div className="absolute inset-0 bg-gradient-to-tr from-blueColor/10 via-white via-50% to-blueColor/10 dark:hidden" />
        <div className="w-full z-20 h-full flex justify-center px-4 items-center ">
          <Card className="w-full max-w-5xl max-h-[90dvh] mx-auto shadow-xl flex flex-row overflow-hidden border border-gray-500/30 dark:border-[#2a2a30]   dark:bg-[#19191e]">
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
                      <img src="/images/new.png" className="w-28 h-28" alt="" />
                      <div>
                        <CardTitle className="text-2xl w-full font-bold tracking-wide uppercase ">
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
                    <CardContent className="pt-2">
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
                        <CardTitle className="text-2xl font-bold">
                          Create Account
                        </CardTitle>
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

            {/* Right Section - Auth Forms */}
            <div className="w-full hidden lg:flex flex-col items-center justify-center dark:bg-blueColor/15 bg-blueColor/10 relative overflow-hidden">
              <span className="z-50 absolute top-2 right-0">
                <ThemeChange />
              </span>

              {/* Lottie animation */}
              <Lottie
                lottieRef={lottieRef}
                animationData={certificate}
                loop={true}
                autoplay={true}
                className="w-full h-full relative z-10"
                onComplete={() => {
                  if (lottieRef.current) {
                    lottieRef.current.play();
                  }
                }}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;

const imageSet = [
  {
    src: "/images/hall-2.jpg",
    alt: "plates",
  },
  {
    src: "/images/BUSINESS.jpg",
    alt: "Bread",
  },
  {
    src: "/images/hall.jpg",
    alt: "idk",
  },
  {
    src: "/images/new.png",
    alt: "idk",
  },

  // {
  //   src: "/images/homepage/cake.png",
  //   alt: "Cakes",
  // },
  // {
  //   src: "/images/homepage/sili.png",
  //   alt: "Sili",
  // },
];

const RightSide = ({
  currentIndex,
  setCurrentIndex,
}: {
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>; // Updated type
}) => {
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Total slides (includes duplicates for seamless looping)
  const totalSlides = imageSet.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (totalSlides + 1));
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [setCurrentIndex, totalSlides]);

  const handleTransitionEnd = () => {
    // If we're at the end of the duplicated slides, reset position to the start
    if (currentIndex === totalSlides) {
      setIsTransitioning(false); // Temporarily disable transition
      setCurrentIndex(0); // Reset to the first slide
    }
  };

  // Re-enable transition after resetting position
  useEffect(() => {
    if (!isTransitioning) {
      const timeout = setTimeout(() => {
        setIsTransitioning(true);
      }, 50); // Short delay to re-enable transition
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

  return (
    <div className="w-full md:max-w-[55%]  h-full overflow-hidden relative">
      {/* Gradient overlay */}
      {/* <div className="md:block hidden absolute inset-0 bg-gradient-to-r from-white dark:from-black dark:via-black/50 via-white/50 to-transparent z-10" />
      <div className="block md:hidden absolute inset-0 bg-gradient-to-r from-white dark:from-black dark:via-black/70 via-white/70 to-transparent z-10" /> */}
      {/* Image container with sliding effect */}
      <div
        className={`flex w-full h-full ${
          isTransitioning ? "transition-transform duration-500 ease-in-out" : ""
        }`}
        style={{
          transform: `translateX(-${
            (currentIndex % (totalSlides + 1)) * 100
          }%)`,
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {/* Duplicate the imageSet and append the first image for seamless looping */}
        {[...imageSet, imageSet[0]].map((image, index) => (
          <div key={index} className="w-full h-full flex-shrink-0">
            <img
              className="w-full h-full object-fill"
              src={image.src}
              alt={image.alt}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
