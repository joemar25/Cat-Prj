"use client";

import { useKioskStore } from "@/state/use-kiosk-store";
import { SuccessStep } from "@/components/custom/kiosk/success-step";
import { SelectServiceStep } from "@/components/custom/kiosk/select-service";
import { TrueCopyRequest } from "@/components/custom/kiosk/true-copy-request";
import { VerifyRegistration } from "@/components/custom/kiosk/verify-registration";
import { KioskHeader } from "@/components/custom/kiosk/kiosk-header";
import { motion, AnimatePresence } from "framer-motion";
import { CircleArrowRight, CircleArrowLeft } from "lucide-react";

export default function HomePage() {
  const { currentStep, service, goToStep, completeTrueCopy } = useKioskStore();

  const handleNextStep = () => {
    if (currentStep === 2 && service === "TRUE_COPY") {
      // For the last step of TrueCopyRequest, call the completion function
      completeTrueCopy();
    } else if (currentStep < 3) {
      goToStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const stepComponents: { [key: number]: JSX.Element } = {
    1: <SelectServiceStep />,
    2: service === "TRUE_COPY" ? <TrueCopyRequest /> : <VerifyRegistration />,
    3: <SuccessStep />,
  };

  return (
    <div className="w-full h-dvh">
      <div className="flex flex-col justify-center items-center h-full gap-8">
        <KioskHeader />
        <div className="flex relative justify-center items-center w-full h-full">
          <div className="max-w-screen-xl mx-auto w-full">
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
          </div>

          {/* Back Arrow */}
          {currentStep > 1 && (
            <button
              type="button"
              className="absolute top-1/2 left-12 -translate-y-1/2 hover:scale-105 transition-all hover:bg-gray-300 rounded-full"
              onClick={handlePreviousStep}
            >
              <CircleArrowLeft className="w-12 h-12" />
            </button>
          )}

          {/* Next/Submit Arrow */}
          <button
            type="button"
            className={`absolute top-1/2 right-12 -translate-y-1/2 hover:scale-105 transition-all rounded-full ${
              currentStep === 3 ? "bg-green-500 hover:bg-green-600" : "hover:bg-[#FFD101]"
            }`}
            onClick={handleNextStep}
          >
            {currentStep === 3 ? (
              <span className="px-6 py-3 text-white font-semibold">Submit</span>
            ) : (
              <CircleArrowRight className="w-12 h-12" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
