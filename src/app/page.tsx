// src/app/page.tsx
"use client"

import { useKioskStore } from "@/state/use-kiosk-store"
import { SuccessStep } from "@/components/custom/kiosk/success-step"
import { SelectServiceStep } from "@/components/custom/kiosk/select-service"
import { TrueCopyRequest } from "@/components/custom/kiosk/true-copy-request"
import { VerifyRegistration } from "@/components/custom/kiosk/verify-registration"
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

export default function HomePage() {
  const { currentStep, service } = useKioskStore()

  // Define stepComponents with explicit type
  const stepComponents: { [key: number]: JSX.Element } = {
    1: <SelectServiceStep />,
    2: service === "TRUE_COPY" ? <TrueCopyRequest /> : <VerifyRegistration />,
    3: <SuccessStep />,
  }

  return (
    <div className="min-h-screen p-8 flex items-center justify-center">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Center logo and text */}
        <div className="flex flex-col items-center justify-center space-y-4"> {/* Added flex-col and space-y-4 for vertical alignment */}
          <img 
            src="images/lgu-legazpi.png" 
            alt="LGU Legazpi Logo" 
            className="w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40" // Larger logo for desktop
          />
          <span className="text-3xl md:text-4xl lg:text-5xl font-semibold">LGU LEGAZPI</span> {/* Larger text for desktop */}
        </div>
        <div className="flex justify-center">
          <Card className="max-w-md w-full p-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {stepComponents[currentStep]}
              </motion.div>
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </div>
  )
}