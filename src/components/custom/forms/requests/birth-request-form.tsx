'use client'

import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { BaseRegistryFormWithRelations } from "@/hooks/civil-registry-action"
import { SubmitCertifiedCopyRequestParams, useSubmitCertifiedCopyRequest } from "@/hooks/use-submit-certified"
import { toast } from "sonner"
import { z } from "zod"
import {
  BirthCertificateForm as BirthCertificateFormCTC,
  DeathCertificateForm,
  MarriageCertificateForm,
} from "@prisma/client"
import { Checkbox } from "@/components/ui/checkbox"
import { NameObject, PlaceOfBirthObject } from "@/lib/types/json"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AttachmentWithCertifiedCopies } from "../../civil-registry/components/attachment-table"

// Update the Zod schema to match
const schema = z.object({
  // Required fields
  address: z.string().min(1, "Address is required"),
  purpose: z.string().min(1, "Purpose is required"),
  relationship: z.string().min(1, "Relationship to owner is required"),
  requesterName: z.string().min(1, "Requester name is required"),

  // Optional fields
  feesPaid: z.string().optional(),
  orNo: z.string().optional(),
  signature: z.string().optional(),
  lcrNo: z.string().optional(),
  bookNo: z.string().optional(),
  pageNo: z.string().optional(),
  searchedBy: z.string().optional(),
  contactNo: z.string().optional(),
  datePaid: z.string().optional(),
  whenRegistered: z.string().optional(),

  // Form control fields
  copies: z.number().min(1, "At least one copy is required"),
  isCertified: z.boolean().refine((val) => val === true, "You must certify the information"),
})

interface BirthCertificateFormProps {
  formData?: BaseRegistryFormWithRelations & {
    birthCertificateForm?: BirthCertificateFormCTC | null
    deathCertificateForm?: DeathCertificateForm | null
    marriageCertificateForm?: MarriageCertificateForm | null
  }
  open: boolean
  onClose?: () => void
  onOpenChange: (open: boolean) => void
  attachment: AttachmentWithCertifiedCopies | null
}

const BirthCertificateForm: React.FC<BirthCertificateFormProps> = ({ formData, open, onOpenChange, onClose, attachment }) => {
  const [isRegisteredLate, setIsRegisteredLate] = useState(false)
  const [isCertified, setIsCertified] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)
  const { submitRequest, isLoading, isError, error, successMessage } = useSubmitCertifiedCopyRequest()

  const [formState, setFormState] = useState({
    required: {
      requesterName: "",
      relationship: "",
      address: "",
      purpose: "",
      copies: "1",
    },
    optional: {
      orNo: "",
      feesPaid: "",
      lcrNo: "",
      bookNo: "",
      pageNo: "",
      searchedBy: "",
      contactNo: "",
      datePaid: "",
      signature: ""
    }
  })

  const resetForm = () => {
    // Reset form state
    setFormState({
      required: {
        requesterName: "",
        relationship: "",
        address: "",
        purpose: "",
        copies: "1",
      },
      optional: {
        orNo: "",
        feesPaid: "",
        lcrNo: "",
        bookNo: "",
        pageNo: "",
        searchedBy: "",
        contactNo: "",
        datePaid: "",
        signature: ""
      }
    });

    // Reset other state
    setIsCertified(false);
    setIsRegisteredLate(false);

    // Reset the HTML form
    const form = document.querySelector('form');
    if (form) {
      form.reset();

      // Reset all input values explicitly
      const inputs = form.querySelectorAll('input');
      inputs.forEach(input => {
        if (input.type === 'number' && input.name === 'copies') {
          input.value = '1';
        } else {
          input.value = '';
        }
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Check if the field is in required or optional object
    if (name in formState.required) {
      setFormState(prev => ({
        ...prev,
        required: {
          ...prev.required,
          [name]: value.trim()
        }
      }));
    } else {
      setFormState(prev => ({
        ...prev,
        optional: {
          ...prev.optional,
          [name]: value
        }
      }));
    }
  };

  // Add this useEffect for debugging
  useEffect(() => {
    console.log('Form State:', formState);
    console.log('Required fields filled:', Object.values(formState.required).every(value => value !== ""));
    console.log('Is Certified:', isCertified);
    console.log('Is Form Valid:', isFormValid);
  }, [formState, isCertified, isFormValid]);

  // Update form validation useEffect
  useEffect(() => {
    const requiredFieldsFilled = Object.values(formState.required).every(value => value !== "");
    setIsFormValid(requiredFieldsFilled && isCertified);
  }, [formState.required, isCertified]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      resetForm();
      // Close the dialog after a short delay to allow the toast to be visible
      setTimeout(() => {
        onClose?.();
      }, 500);
    }
  }, [successMessage, onClose]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Then modify your handleSubmit function to remove the success/error checks
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isCertified) {
      toast.error("Please certify that the information is true");
      return;
    }

    const formEntries = new FormData(event.currentTarget);
    const formObj = Object.fromEntries(formEntries.entries());

    // Convert copies to number before validation
    const validationObj = {
      ...formObj,
      copies: parseInt(formObj.copies as string, 10),
      isCertified
    };

    // Zod validation
    const result = schema.safeParse(validationObj);

    if (!result.success) {
      toast.error(`Please fill in all required fields: ${result.error.errors.map(e => e.message).join(", ")}`);
      return;
    }

    const requestData: SubmitCertifiedCopyRequestParams = {
      // Required fields
      address: formObj.address.toString(),
      purpose: formObj.purpose.toString(),
      relationship: formObj.relationship.toString(),
      requesterName: formObj.requesterName.toString(),
      isRegisteredLate,

      // Optional fields with proper mapping
      feesPaid: formObj.feesPaid ? formObj.feesPaid.toString() : undefined,
      orNo: formObj.orNo?.toString(),
      signature: formObj.signature?.toString(),
      lcrNo: formObj.lcrNo?.toString(),
      bookNo: formObj.bookNo?.toString(),
      pageNo: formObj.pageNo?.toString(),
      searchedBy: formObj.searchedBy?.toString(),
      contactNo: formObj.contactNo?.toString(),
      date: formObj.datePaid ? formObj.datePaid.toString() : undefined,
      whenRegistered: isRegisteredLate ? formObj.whenRegistered?.toString() : undefined,
      attachmentId: attachment?.id ?? '',
    };
    try {
      await submitRequest(requestData);
      toast.success("Request submitted successfully");
      resetForm();
      onClose?.();
    } catch (error) {
      toast.error("Failed to submit request");
    }
  };

  // Type-safe data extraction
  const childName = formData?.birthCertificateForm?.childName as NameObject | undefined
  const placeOfBirth = formData?.birthCertificateForm?.placeOfBirth as PlaceOfBirthObject | undefined
  const motherMaidenName = formData?.birthCertificateForm?.motherMaidenName as NameObject | undefined
  const fatherName = formData?.birthCertificateForm?.fatherName as NameObject | undefined
  const dob = formData?.birthCertificateForm?.dateOfBirth

  const formatName = (name: NameObject | undefined): string => {
    if (!name || !name.first || !name.last) return ""
    return `${name.first} ${name.middle || ""} ${name.last}`.trim()
  }

  const formatPlaceOfBirth = (place: PlaceOfBirthObject | undefined): string => {
    if (!place || !place.hospital || !place.cityMunicipality || !place.province || !place.country) return ""
    return `${place.hospital}, ${place.street || ""}, ${place.barangay || ""}, ${place.cityMunicipality}, ${place.province}, ${place.country}`.trim()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[90vw] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div className="w-full">
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
                        defaultValue={formatName(childName)}
                        disabled={true}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        name="dob"
                        type="date"
                        defaultValue={dob ? new Date(dob).toISOString().split("T")[0] : ""}
                        disabled={true}
                      />
                    </div>
                    <div>
                      <Label htmlFor="birthplace">Place of Birth</Label>
                      <Input
                        id="birthplace"
                        name="birthplace"
                        placeholder="Enter place of birth"
                        defaultValue={formatPlaceOfBirth(placeOfBirth)}
                        disabled={true}
                      />
                    </div>
                    <div>
                      <Label htmlFor="motherName">Maiden Name of Mother</Label>
                      <Input
                        id="motherName"
                        name="motherName"
                        placeholder="Enter mother's maiden name"
                        defaultValue={formatName(motherMaidenName)}
                        disabled={true}
                      />
                    </div>
                    <div>
                      <Label htmlFor="fatherName">Name of Father</Label>
                      <Input
                        id="fatherName"
                        name="fatherName"
                        placeholder="Enter father's name"
                        defaultValue={formatName(fatherName)}
                        disabled={true}
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
                    </div>

                    {isRegisteredLate && (
                      <div className="mt-2">
                        <Label htmlFor="whenRegistered">When Registered?</Label>
                        <Input id="whenRegistered" name="whenRegistered" type="date" />
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">Requester's Information</h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="requesterName">Full Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="requesterName"
                        name="requesterName"
                        placeholder="Enter full name"
                        value={formState.required.requesterName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="relationship">Relationship to the Owner <span className="text-red-500">*</span></Label>
                      <Input
                        id="relationship"
                        name="relationship"
                        placeholder="Enter relationship"
                        value={formState.required.relationship}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="Enter address"
                        value={formState.required.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="purpose">Purpose (please specify) <span className="text-red-500">*</span></Label>
                      <Input
                        id="purpose"
                        name="purpose"
                        placeholder="Enter purpose"
                        value={formState.required.purpose}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </section>
              </div>
              <section>
                <h2 className="text-xl font-semibold mb-4">Administrative Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="copies">No. of Copies <span className="text-red-500">*</span></Label>
                    <Input
                      id="copies"
                      name="copies"
                      type="number"
                      min="1"
                      value={formState.required.copies}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="orNo">OR No.</Label>
                    <Input
                      id="orNo"
                      name="orNo"
                      placeholder="Original receipt no."
                      value={formState.optional.orNo}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="feesPaid">Fees Paid</Label>
                    <Input
                      id="feesPaid"
                      name="feesPaid"
                      type="number"
                      step="0.01"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lcrNo">LCR No.</Label>
                    <Input
                      id="lcrNo"
                      name="lcrNo"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bookNo">Book No.</Label>
                    <Input
                      id="bookNo"
                      name="bookNo"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pageNo">Page No.</Label>
                    <Input
                      id="pageNo"
                      name="pageNo"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="searchedBy">Searched By</Label>
                    <Input
                      id="searchedBy"
                      name="searchedBy"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactNo">Contact No.</Label>
                    <Input
                      id="contactNo"
                      name="contactNo"
                      type="tel"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="datePaid">Date Paid</Label>
                    <Input
                      id="datePaid"
                      name="datePaid"
                      type="date"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="certification"
                    checked={isCertified}
                    onCheckedChange={(checked) => setIsCertified(checked as boolean)}
                    required
                  />
                  <Label htmlFor="certification" className="text-sm">
                    I hereby certify that the above information on the relationship is true. <span className="text-red-500">*</span>
                  </Label>
                </div>
                <div>
                  <Label htmlFor="signature">Signature of the Requester</Label>
                  <Input
                    id="signature"
                    name="signature"
                    placeholder="Type full name as signature"
                    className="w-full sm:w-auto"
                    onChange={handleInputChange}
                  />
                </div>
              </section>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="default"
                  disabled={isLoading || !isFormValid}
                >
                  {isLoading ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>

  )
}

export default BirthCertificateForm