// src/app/page.tsx
"use client"

import { useKioskStore } from "@/state/use-kiosk-store"
import { SuccessStep } from "@/components/custom/kiosk/success-step"
import { SelectServiceStep } from "@/components/custom/kiosk/select-service"
import { TrueCopyRequest } from "@/components/custom/kiosk/true-copy-request"
import { VerifyRegistration } from "@/components/custom/kiosk/verify-registration"

export default function HomePage() {
  const { currentStep, service } = useKioskStore()

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-center">
          {currentStep === 1 && <SelectServiceStep />}
          {currentStep === 2 && service === "TRUE_COPY" && <TrueCopyRequest />}
          {currentStep === 2 && service === "VERIFY" && <VerifyRegistration />}
          {currentStep === 3 && <SuccessStep />}
        </div>
      </div>
    </div>
  )
}