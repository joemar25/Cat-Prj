// src\app\auth\sign-in\page.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SignInForm } from "@/components/custom/auth/sign-in-form";
import { SignUpForm } from "@/components/custom/auth/sign-up-form";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Login = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isDevelopment, setIsDevelopment] = useState(false);

  useEffect(() => {
    setIsDevelopment(process.env.NEXT_PUBLIC_NODE_ENV === "development");
  }, []);

  return (
    <div className="min-h-dvh w-dvh flex items-center justify-center">
      <div className="w-full h-screen bg-palette-5 overflow-hidden">
        <div className="w-full h-full flex justify-end items-center relative bg-gray-700">
         
          {/* Left side parent */}
          <div className="md:w-[60%] w-full  absolute top-0 md:left-[5%] left-[2%] z-20 h-full flex justify-center items-center">
            <Card className="w-full max-w-4xl mx-auto shadow-lg flex overflow-hidden">
              {/* Left Section - Welcome Message */}
              <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 to-primary/5 items-center justify-center border-r">
                <CardHeader className=" text-center h-[27rem] w-[27rem]">
                  <img src="/images/logo.jpg" className="w-fit h-full object-cover rounded-full" alt="" />
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
                        <CardTitle className="text-2xl font-bold">
                          Sign In
                        </CardTitle>
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
            </Card>
          </div>

          <RightSide
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
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
      <div className="md:block hidden absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-500/50 to-transparent z-10" />
      <div className="block md:hidden absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-500/70 to-transparent z-10" />
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
