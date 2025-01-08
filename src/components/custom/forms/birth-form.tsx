import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const BirthCertificateForm = () => {
  const [isRegisteredLate, setIsRegisteredLate] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Birth Certificate Request Form</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-lg">Owner's Personal Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="Enter full name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthplace">Place of Birth</Label>
                <Input id="birthplace" placeholder="Enter place of birth" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="motherName">Maiden Name of Mother</Label>
                <Input id="motherName" placeholder="Enter mother's maiden name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fatherName">Name of Father</Label>
                <Input id="fatherName" placeholder="Enter father's name" />
              </div>

              <div className="space-y-2">
                <Label>Registered Late?</Label>
                <RadioGroup
                  defaultValue="no"
                  onValueChange={(value) => setIsRegisteredLate(value === "yes")}
                  className="flex space-x-4"
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

            {/* Right Column - Split into two sections */}
            <div className="space-y-6">
              {/* Requester's Information */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold text-lg">Requester's Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="requesterName">Full Name</Label>
                  <Input id="requesterName" placeholder="Enter full name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship to the Owner</Label>
                  <Input id="relationship" placeholder="Enter relationship" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="Enter address" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose (please specify)</Label>
                  <Input id="purpose" placeholder="Enter purpose" />
                </div>
              </div>

              {/* Administrative Details */}
              <div className="border rounded-lg p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="copies">No. of Copies</Label>
                  <Input id="copies" type="number" min="1" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orNo">OR No.</Label>
                  <Input id="orNo" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feesPaid">Fees Paid</Label>
                  <Input id="feesPaid" type="number" step="0.01" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lcrNo">LCR No.</Label>
                  <Input id="lcrNo" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bookNo">Book No.</Label>
                  <Input id="bookNo" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pageNo">Page No.</Label>
                  <Input id="pageNo" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="searchedBy">Searched By</Label>
                  <Input id="searchedBy" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNo">Contact No.</Label>
                  <Input id="contactNo" type="tel" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-6 p-6">
          <div className="w-full space-y-4">
            <p className="text-sm text-center">
              I hereby certify that the above information on the relationship is true
            </p>
            <div className="space-y-2">
              <Label htmlFor="signature">Signature of the Requester</Label>
              <Input id="signature" placeholder="Type full name as signature" />
            </div>
          </div>

          <Alert className="bg-blue-50">
            <AlertDescription>
              <p className="font-semibold mb-2">Remarks: Authorization I.D bearing signature of the authorizing party are required if the person is not any of the following:</p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>Owner of the document</li>
                <li>His/her parents</li>
                <li>His/her spouse</li>
                <li>Son/Daughter</li>
                <li>The Institution in charge</li>
              </ol>
            </AlertDescription>
          </Alert>

          <Button type="submit" className="w-full md:w-auto mx-auto">
            Submit Request
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BirthCertificateForm;