// src/hooks/useSubmitCertifiedCopyRequest.ts
import { useState } from "react";

export interface SubmitCertifiedCopyRequestParams {
  address: string;
  feesPaid?: string | number; // maps to amountPaid
  orNo?: string; // maps to orNumber
  purpose: string;
  relationship: string; // maps to relationshipToOwner
  requesterName: string;
  signature?: string;
  lcrNo?: string;
  bookNo?: string;
  pageNo?: string;
  searchedBy?: string;
  contactNo?: string;
  date?: string; // expected in YYYY-MM-DD format
  isRegisteredLate: boolean;
  whenRegistered?: string; // expected in YYYY-MM-DD format if applicable
}

export const useSubmitCertifiedCopyRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const submitRequest = async (data: SubmitCertifiedCopyRequestParams) => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/ctc/request-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        setIsError(true);
        setError(responseData.message || "Something went wrong");
      } else {
        setSuccessMessage(responseData.message || "Request submitted successfully.");
      }
    } catch (err: any) {
      setIsError(true);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return { submitRequest, isLoading, isError, error, successMessage };
};
