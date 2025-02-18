"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

const DeathCertificateFormCTC = () => {
  const [isRegisteredLate, setIsRegisteredLate] = useState(false)

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold text-center mb-8">Death Certificate Request Form</h1>

      <form className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Deceased's Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="deceasedName">Full Name of the Deceased</Label>
                <Input id="deceasedName" placeholder="Enter full name" />
              </div>
              <div>
                <Label htmlFor="deathDate">Date of Death</Label>
                <Input id="deathDate" type="date" />
              </div>
              <div>
                <Label htmlFor="deathPlace">Place of Death</Label>
                <Input id="deathPlace" placeholder="Enter place of death" />
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
                <Label htmlFor="relationship">Relationship to the Deceased</Label>
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

        <Alert className="bg-blue-50">
          <AlertDescription>
            <p className="font-semibold mb-2">
              Remarks: Authorization I.D bearing signature of the authorizing party are required if the person is not
              any of the following:
            </p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Owner of the document</li>
              <li>His/her parents</li>
              <li>His/her spouse</li>
              <li>Son/Daughter</li>
              <li>The Institution in charge</li>
            </ol>
          </AlertDescription>
        </Alert>

        <Button className="w-full sm:w-auto mx-auto block px-8" variant="outline">
          Submit Request
        </Button>
      </form>
    </div>
  )
}

export default DeathCertificateFormCTC

