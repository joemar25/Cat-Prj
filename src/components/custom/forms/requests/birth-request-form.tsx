import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { BaseRegistryFormWithRelations } from "@/hooks/civil-registry-action";
import {
  BirthCertificateForm as BirthCertificateFormCTC,
  DeathCertificateForm,
  MarriageCertificateForm,
} from "@prisma/client";
import { useSubmitCertifiedCopyRequest } from "@/hooks/useSubmitCertifiedCopy";

// Define the types for formData prop
interface BirthCertificateFormProps {
  formData?: BaseRegistryFormWithRelations & {
    birthCertificateForm?: BirthCertificateFormCTC | null;
    deathCertificateForm?: DeathCertificateForm | null;
    marriageCertificateForm?: MarriageCertificateForm | null;
  };
}

const BirthCertificateForm: React.FC<BirthCertificateFormProps> = ({ formData }) => {
  const [isRegisteredLate, setIsRegisteredLate] = useState(false);
  const { submitRequest, isLoading, isError, error, successMessage } = useSubmitCertifiedCopyRequest();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  
    const formEntries = new FormData(event.currentTarget)
    const formObj = Object.fromEntries(formEntries.entries())
  
    // Required fields list
    const requiredFields = [
      "fullName",
      "dob",
      "birthplace",
      "motherName",
      "fatherName",
      "requesterName",
      "relationship",
      "address",
      "purpose",
      "copies",
      "orNo",
      "feesPaid",
      "lcrNo",
      "bookNo",
      "pageNo",
      "searchedBy",
      "contactNo",
      "datePaid",
      "signature"
    ]
  
    if (isRegisteredLate) {
      requiredFields.push("whenRegistered")
    }
  
    // Check for missing fields
    const missingFields = requiredFields.filter((field) => !formObj[field]?.toString().trim())
  
    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`)
      return
    }
  
    const requestData = {
      address: formObj.address.toString(),
      purpose: formObj.purpose.toString(),
      relationship: formObj.relationship.toString(),
      requesterName: formObj.requesterName.toString(),
      feesPaid: Number(formObj.feesPaid),
      orNo: formObj.orNo.toString(),
      signature: formObj.signature.toString(),
      lcrNo: formObj.lcrNo.toString(),
      bookNo: formObj.bookNo.toString(),
      pageNo: formObj.pageNo.toString(),
      searchedBy: formObj.searchedBy.toString(),
      contactNo: formObj.contactNo.toString(),
      datePaid: formObj.datePaid.toString(),
      isRegisteredLate,
      whenRegistered: isRegisteredLate ? formObj.whenRegistered.toString() : undefined
    }
  
    await submitRequest(requestData)
  }
  
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold text-center mb-8">Birth Certificate Request Form</h1>

      <form className="space-y-12" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Owner's Personal Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Enter full name"
                  defaultValue={
                    formData?.birthCertificateForm?.childName &&
                    typeof formData.birthCertificateForm.childName === "object"
                      ? `${(formData.birthCertificateForm.childName as any).first || ""} ${(formData.birthCertificateForm.childName as any).middle || ""} ${(formData.birthCertificateForm.childName as any).last || ""}`.trim()
                      : ""
                  }
                />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  defaultValue={formData?.createdAt.toISOString().split("T")[0] || ""}
                />
              </div>
              <div>
                <Label htmlFor="birthplace">Place of Birth</Label>
                <Input
                  id="birthplace"
                  name="birthplace"
                  placeholder="Enter place of birth"
                  defaultValue={
                    formData?.birthCertificateForm?.placeOfBirth &&
                    typeof formData.birthCertificateForm.placeOfBirth === "object"
                      ? `${(formData.birthCertificateForm.placeOfBirth as any).hospital || ""}, ${(formData.birthCertificateForm.placeOfBirth as any).street || ""}, ${(formData.birthCertificateForm.placeOfBirth as any).houseNo || ""}, ${(formData.birthCertificateForm.placeOfBirth as any).barangay || ""}, ${(formData.birthCertificateForm.placeOfBirth as any).cityMunicipality || ""}, ${(formData.birthCertificateForm.placeOfBirth as any).province || ""}, ${(formData.birthCertificateForm.placeOfBirth as any).region || ""}, ${(formData.birthCertificateForm.placeOfBirth as any).country || ""}`.trim()
                      : ""
                  }
                />
              </div>
              <div>
                <Label htmlFor="motherName">Maiden Name of Mother</Label>
                <Input
                  id="motherName"
                  name="motherName"
                  placeholder="Enter mother's maiden name"
                  defaultValue={
                    formData?.birthCertificateForm?.motherMaidenName &&
                    typeof formData.birthCertificateForm.motherMaidenName === "object"
                      ? `${(formData.birthCertificateForm.motherMaidenName as any).first || ""} ${(formData.birthCertificateForm.motherMaidenName as any).middle || ""} ${(formData.birthCertificateForm.motherMaidenName as any).last || ""}`.trim()
                      : ""
                  }
                />
              </div>
              <div>
                <Label htmlFor="fatherName">Name of Father</Label>
                <Input
                  id="fatherName"
                  name="fatherName"
                  placeholder="Enter father's name"
                  defaultValue={
                    formData?.birthCertificateForm?.fatherName &&
                    typeof formData.birthCertificateForm.fatherName === "object"
                      ? `${(formData.birthCertificateForm.fatherName as any).first || ""} ${(formData.birthCertificateForm.fatherName as any).middle || ""} ${(formData.birthCertificateForm.fatherName as any).last || ""}`.trim()
                      : ""
                  }
                />
              </div>
              <div>
                <Label>Registered Late?</Label>
                <RadioGroup
                  defaultValue="no"
                  onValueChange={(value) => setIsRegisteredLate(value === "yes")}
                  className="flex space-x-4 mt-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes">Yes</Label>
                  </div>
                </RadioGroup>
                {isRegisteredLate && (
                  <div className="mt-2">
                    <Label htmlFor="whenRegistered">When?</Label>
                    <Input id="whenRegistered" name="whenRegistered" type="date" />
                  </div>
                )}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Requester's Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="requesterName">Full Name</Label>
                <Input id="requesterName" name="requesterName" placeholder="Enter full name" />
              </div>
              <div>
                <Label htmlFor="relationship">Relationship to the Owner</Label>
                <Input id="relationship" name="relationship" placeholder="Enter relationship" />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" placeholder="Enter address" />
              </div>
              <div>
                <Label htmlFor="purpose">Purpose (please specify)</Label>
                <Input id="purpose" name="purpose" placeholder="Enter purpose" />
              </div>
            </div>
          </section>
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-4">Administrative Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="copies">No. of Copies</Label>
              <Input id="copies" name="copies" type="number" min="1" />
            </div>
            <div>
              <Label htmlFor="orNo">OR No.</Label>
              <Input id="orNo" name="orNo" placeholder="Original receipt no." />
            </div>
            <div>
              <Label htmlFor="feesPaid">Fees Paid</Label>
              <Input id="feesPaid" name="feesPaid" type="number" step="0.01" />
            </div>
            <div>
              <Label htmlFor="lcrNo">LCR No.</Label>
              <Input id="lcrNo" name="lcrNo" />
            </div>
            <div>
              <Label htmlFor="bookNo">Book No.</Label>
              <Input id="bookNo" name="bookNo" defaultValue={formData?.bookNumber || ""} />
            </div>
            <div>
              <Label htmlFor="pageNo">Page No.</Label>
              <Input id="pageNo" name="pageNo" defaultValue={formData?.pageNumber || ""} />
            </div>
            <div>
              <Label htmlFor="searchedBy">Searched By</Label>
              <Input id="searchedBy" name="searchedBy" />
            </div>
            <div>
              <Label htmlFor="contactNo">Contact No.</Label>
              <Input id="contactNo" name="contactNo" type="tel" />
            </div>
            <div>
              <Label htmlFor="datePaid">Date Paid</Label>
              <Input id="datePaid" name="datePaid" type="date" />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <p className="text-sm text-center">
            I hereby certify that the above information on the relationship is true
          </p>
          <div>
            <Label htmlFor="signature">Signature of the Requester</Label>
            <Input id="signature" name="signature" placeholder="Type full name as signature" />
          </div>
        </section>

        <Button type="submit" className="w-full sm:w-auto mx-auto block px-8" variant="outline" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Request"}
        </Button>
      </form>

      {isError && <p className="mt-4 text-red-600">{error}</p>}
      {successMessage && <p className="mt-4 text-green-600">{successMessage}</p>}
    </div>
  );
};

export default BirthCertificateForm;
