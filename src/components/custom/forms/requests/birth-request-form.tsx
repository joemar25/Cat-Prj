import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { BaseRegistryFormWithRelations } from "@/hooks/civil-registry-action";
import { BirthCertificateForm as BirthCertificateFormCTC, DeathCertificateForm, MarriageCertificateForm } from "@prisma/client";

// Define the types for formData prop
interface BirthCertificateFormProps {
 formData?: BaseRegistryFormWithRelations & {
         birthCertificateForm?: BirthCertificateFormCTC | null
         deathCertificateForm?: DeathCertificateForm | null
         marriageCertificateForm?: MarriageCertificateForm | null
     }
}

const BirthCertificateForm: React.FC<BirthCertificateFormProps> = ({ formData }) => {
  const [isRegisteredLate, setIsRegisteredLate] = useState(false);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold text-center mb-8">Birth Certificate Request Form</h1>

      <form className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Owner's Personal Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="Enter full name" defaultValue={formData?.formNumber || ''} />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" defaultValue={formData?.createdAt.toISOString().split("T")[0] || ''} />
              </div>
              <div>
                <Label htmlFor="birthplace">Place of Birth</Label>
                <Input id="birthplace" placeholder="Enter place of birth" />
              </div>
              <div>
                <Label htmlFor="motherName">Maiden Name of Mother</Label>
                <Input id="motherName" placeholder="Enter mother's maiden name" />
              </div>
              <div>
                <Label htmlFor="fatherName">Name of Father</Label>
                <Input id="fatherName" placeholder="Enter father's name" />
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
                    <Input id="whenRegistered" type="date" />
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
                <Input id="requesterName" placeholder="Enter full name" />
              </div>
              <div>
                <Label htmlFor="relationship">Relationship to the Owner</Label>
                <Input id="relationship" placeholder="Enter relationship" />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Enter address" />
              </div>
              <div>
                <Label htmlFor="purpose">Purpose (please specify)</Label>
                <Input id="purpose" placeholder="Enter purpose" />
              </div>
            </div>
          </section>
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-4">Administrative Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="copies">No. of Copies</Label>
              <Input id="copies" type="number" min="1" />
            </div>
            <div>
              <Label htmlFor="orNo">OR No.</Label>
              <Input id="orNo" />
            </div>
            <div>
              <Label htmlFor="feesPaid">Fees Paid</Label>
              <Input id="feesPaid" type="number" step="0.01" />
            </div>
            <div>
              <Label htmlFor="lcrNo">LCR No.</Label>
              <Input id="lcrNo" />
            </div>
            <div>
              <Label htmlFor="bookNo">Book No.</Label>
              <Input id="bookNo" />
            </div>
            <div>
              <Label htmlFor="pageNo">Page No.</Label>
              <Input id="pageNo" />
            </div>
            <div>
              <Label htmlFor="searchedBy">Searched By</Label>
              <Input id="searchedBy" />
            </div>
            <div>
              <Label htmlFor="contactNo">Contact No.</Label>
              <Input id="contactNo" type="tel" />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <p className="text-sm text-center">I hereby certify that the above information on the relationship is true</p>
          <div>
            <Label htmlFor="signature">Signature of the Requester</Label>
            <Input id="signature" placeholder="Type full name as signature" />
          </div>
        </section>

        <Button className="w-full sm:w-auto mx-auto block px-8" variant="outline">
          Submit Request
        </Button>
      </form>
    </div>
  );
};

export default BirthCertificateForm;
