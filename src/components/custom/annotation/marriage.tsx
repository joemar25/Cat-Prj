"Use client"

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const MarriageAnnotationForm = () => {
  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto bg-white">
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-lg font-medium">TO WHOM IT MAY CONCERN:</h2>
            <p>We certify that, among others, the following marriage appear in our Register of Marriages</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>on page</Label>
                <Input />
              </div>
              <div className="space-y-1">
                <Label>book number</Label>
                <Input />
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="space-y-4">
            {/* Column Headers */}
            <div className="grid grid-cols-2 gap-4">
              <h3 className="font-medium text-center">HUSBAND</h3>
              <h3 className="font-medium text-center">WIFE</h3>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Name */}
              <div className="grid grid-cols-[120px_1fr_1fr] gap-4 items-center">
                <Label className="font-medium">Name</Label>
                <Input />
                <Input />
              </div>

              {/* Date of Birth/Age */}
              <div className="grid grid-cols-[120px_1fr_1fr] gap-4 items-center">
                <Label className="font-medium">Date of Birth/Age</Label>
                <Input />
                <Input />
              </div>

              {/* Citizenship */}
              <div className="grid grid-cols-[120px_1fr_1fr] gap-4 items-center">
                <Label className="font-medium">Citizenship</Label>
                <Input />
                <Input />
              </div>

              {/* Civil Status */}
              <div className="grid grid-cols-[120px_1fr_1fr] gap-4 items-center">
                <Label className="font-medium">Civil Status</Label>
                <Input />
                <Input />
              </div>

              {/* Mother */}
              <div className="grid grid-cols-[120px_1fr_1fr] gap-4 items-center">
                <Label className="font-medium">Mother</Label>
                <Input />
                <Input />
              </div>

              {/* Father */}
              <div className="grid grid-cols-[120px_1fr_1fr] gap-4 items-center">
                <Label className="font-medium">Father</Label>
                <Input />
                <Input />
              </div>
            </div>

            {/* Single Column Fields */}
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                <Label className="font-medium">Registry number</Label>
                <Input />
              </div>

              <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                <Label className="font-medium">Date of registration</Label>
                <Input type="date" />
              </div>

              <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                <Label className="font-medium">Date of marriage</Label>
                <Input type="date" />
              </div>

              <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
                <Label className="font-medium">Place of marriage</Label>
                <Input />
              </div>
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
                <p className="font-medium">Prepared by:</p>
                <div className="space-y-1">
                  <Input className="text-center" placeholder="Name and Signature" />
                  <Input className="text-center" placeholder="Position" />
                </div>
              </div>

              <div className="space-y-4">
                <p className="font-medium">Verified by:</p>
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
              <Label className="font-medium">Amount paid</Label>
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

export default MarriageAnnotationForm;