import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const DeathAnnotationForm = () => {
  const currentDate = "August 14, 2024";
  
  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto bg-white">
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="relative">
            <h2 className="text-lg font-medium">TO WHOM IT MAY CONCERN:</h2>
            <p className="absolute top-0 right-0">{currentDate}</p>
            <p className="mt-2">We certify that, among others, the following facts of death appear in our Register of Death on</p>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="space-y-1">
                <Label>Page number</Label>
                <Input />
              </div>
              <div className="space-y-1">
                <Label>of Book number</Label>
                <Input />
              </div>
            </div>
          </div>

          {/* Main Form Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
              <Label className="font-medium">Registry Number</Label>
              <Input />
            </div>

            <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
              <Label className="font-medium">Date of Registration</Label>
              <Input type="date" />
            </div>

            <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
              <Label className="font-medium">Name of Deceased</Label>
              <Input />
            </div>

            <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
              <Label className="font-medium">Sex</Label>
              <Input />
            </div>

            <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
              <Label className="font-medium">Age</Label>
              <Input />
            </div>

            <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
              <Label className="font-medium">Civil Status</Label>
              <Input />
            </div>

            <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
              <Label className="font-medium">Citizenship</Label>
              <Input />
            </div>

            <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
              <Label className="font-medium">Date of Death</Label>
              <Input type="date" />
            </div>

            <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
              <Label className="font-medium">Place of Death</Label>
              <Input />
            </div>

            <div className="grid grid-cols-[150px_1fr] gap-4 items-center">
              <Label className="font-medium">Cause of Death</Label>
              <Input />
            </div>
          </div>

          {/* Certification Section */}
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
              <p>This certification is issued to</p>
              <Input />
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
              <p>upon his/her request for</p>
              <Input />
            </div>
          </div>

          {/* Signature Section */}
          <div className="grid grid-cols-2 gap-8 pt-8">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="font-medium">Prepared By</p>
                <div className="space-y-1">
                  <Input className="text-center" placeholder="Name and Signature" />
                  <Input className="text-center" placeholder="Position" />
                </div>
              </div>

              <div className="space-y-4">
                <p className="font-medium">Verified By</p>
                <div className="space-y-1">
                  <Input className="text-center" placeholder="Name and Signature" />
                  <Input className="text-center" placeholder="Position" />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-end">
              <p className="font-medium text-center">PRISCILLA L. GALICIA</p>
              <p className="text-sm text-center">OIC - City Civil Registrar</p>
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-2 pt-4">
            <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
              <Label className="font-medium">Amount Paid</Label>
              <Input type="number" step="0.01" />
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
              <Label className="font-medium">O.R. Number</Label>
              <Input />
            </div>
            <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
              <Label className="font-medium">Date Paid</Label>
              <Input type="date" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeathAnnotationForm;