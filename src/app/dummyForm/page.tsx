// app/dummyForm/page.tsx
"use client"; // Mark this as a Client Component

import { useState } from "react";
import BirthCertificateForm from "@/components/custom/forms/birth-form";
import DeathCertificateForm from "@/components/custom/forms/death-form";
import MarriageCertificateForm from "@/components/custom/forms/marriage-form";
import  RequestCertificatesModal  from "@/components/custom/modals/request-certificates-modal"; // Corrected import
import MarriageAnnotationForm from "@/components/custom/annotation/marriage";

export default function DummyForm() {
  const [isBirthModalOpen, setIsBirthModalOpen] = useState(false);
  const [isDeathModalOpen, setIsDeathModalOpen] = useState(false);
  const [isMarriageModalOpen, setIsMarriageModalOpen] = useState(false);
  const [isMarriageAnnotationModalOpen, setIsMarriageAnnotationModalOpen] = useState(false);

  return (
    <div>
      <div>
        <button onClick={() => setIsBirthModalOpen(true)}>Birth Certificate</button>
        <button onClick={() => setIsDeathModalOpen(true)}>Death Certificate</button>
        <button onClick={() => setIsMarriageModalOpen(true)}>Marriage Certificate</button>
        <button onClick={() => setIsMarriageAnnotationModalOpen(true)}>Marriage Annotation</button>
      </div>

      {/* Birth Certificate Modal */}
      <RequestCertificatesModal isOpen={isBirthModalOpen} onClose={() => setIsBirthModalOpen(false)}>
        <BirthCertificateForm />
      </RequestCertificatesModal>

      {/* Death Certificate Modal */}
      <RequestCertificatesModal isOpen={isDeathModalOpen} onClose={() => setIsDeathModalOpen(false)}>
        <DeathCertificateForm />
      </RequestCertificatesModal>

      {/* Marriage Certificate Modal */}
      <RequestCertificatesModal isOpen={isMarriageModalOpen} onClose={() => setIsMarriageModalOpen(false)}>
        <MarriageCertificateForm />
      </RequestCertificatesModal>

      {/* Marriage Annotation Modal */}
      <RequestCertificatesModal isOpen={isMarriageAnnotationModalOpen} onClose={() => setIsMarriageAnnotationModalOpen(false)}>
        <MarriageAnnotationForm />
      </RequestCertificatesModal>
    </div>
  );
}