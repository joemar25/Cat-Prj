"use client";

import { useKioskStore, DocumentType } from "@/state/use-kiosk-store";
import { SuccessStep } from "@/components/custom/kiosk/success-step";
import { SelectServiceStep } from "@/components/custom/kiosk/select-service";
import { TrueCopyRequest } from "@/components/custom/kiosk/true-copy-request";
import { VerifyRegistration } from "@/components/custom/kiosk/verify-registration";
import { KioskHeader } from "@/components/custom/kiosk/kiosk-header";
import { motion, AnimatePresence } from "framer-motion";
import { CircleArrowRight, CircleArrowLeft } from "lucide-react";
import { useState } from "react";

export default function HomePage() {
  const { currentStep, service, goToStep, completeTrueCopy } = useKioskStore();
  const [selectedService, setSelectedService] = useState<string | null>("VERIFY"); // Default to "VERIFY"
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentType[]>([]);

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedService) {
      alert("Please select a service before proceeding.");
      return;
    }

    if (currentStep === 2 && service === "TRUE_COPY") {
      if (selectedDocuments.length === 0) {
        alert("Please select at least one document before proceeding.");
        return;
      }
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
    1: (
      <SelectServiceStep
        onServiceSelected={(service) => setSelectedService(service)}
        selectedService={selectedService} // Pass selectedService prop
      />
    ),
    2: service === "TRUE_COPY" ? (
      <TrueCopyRequest
        onDocumentsSelected={(documents) => setSelectedDocuments(documents)}
        showSubmitButton={currentStep === 2}
        onSubmit={handleNextStep}
      />
    ) : (
      <VerifyRegistration />
    ),
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
          {currentStep > 1 && currentStep !== 3 && (
            <button
              type="button"
              className="absolute top-1/2 left-12 -translate-y-1/2 hover:scale-105 transition-all hover:bg-gray-300 rounded-full"
              onClick={handlePreviousStep}
            >
              <CircleArrowLeft className="w-12 h-12" />
            </button>
          )}

          {/* Next/Submit Arrow */}
          {currentStep !== 2 && currentStep !== 3 && (
            <button
              type="button"
              className={`absolute top-1/2 right-12 -translate-y-1/2 hover:scale-105 transition-all rounded-full ${
                currentStep === 3 ? "bg-green-500 hover:bg-green-600" : "hover:bg-[#FFD101]"
              } ${
                (currentStep === 1 && !selectedService) || (currentStep === 2 && selectedDocuments.length === 0)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`} // Disable styling
              onClick={handleNextStep}
              disabled={
                (currentStep === 1 && !selectedService) || (currentStep === 2 && selectedDocuments.length === 0)
              } // Disable if no service or no documents are selected
            >
              {currentStep === 3 ? (
                <span className="px-6 py-3 text-white font-semibold">Submit</span>
              ) : (
                <CircleArrowRight className="w-12 h-12" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}