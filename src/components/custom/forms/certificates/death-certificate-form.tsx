"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import DatePickerField from "../../datepickerfield/date-picker-field";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

// Define the schema for the form
const deathCertificateSchema = z.object({
  // Registry Information
  registryNumber: z.string(),

  // Location Information
  province: z.string(),
  cityMunicipality: z.string(),

  // Personal Information
  name: z.object({
    first: z.string(),
    middle: z.string(),
    last: z.string(),
  }),
  timeOfDeath: z.object({
    a: z.string(),
    b: z.string(),
    c: z.string(),
  }),
  sex: z.enum(["Male", "Female"]),
  dateOfDeath: z.date(),
  dateOfBirth: z.date(),
  ageAtDeath: z.object({
    years: z.number().optional(),
    months: z.number().optional(),
    days: z.number().optional(),
    hours: z.number().optional(),
  }),
  placeOfDeath: z.string(),
  civilStatus: z.enum(["Single", "Married", "Widowed", "Divorced"]),
  religion: z.string(),
  citizenship: z.string(),
  residence: z.string(),
  occupation: z.string(),

  // Family Information
  fatherName: z.object({
    first: z.string(),
    middle: z.string(),
    last: z.string(),
  }),
  motherMaidenName: z.object({
    first: z.string(),
    middle: z.string(),
    last: z.string(),
  }),

  // Medical Certificate
  causesOfDeath: z.object({
    immediate: z.string(),
    antecedent: z.string(),
    underlying: z.string(),
    contributingConditions: z.string(),
  }),
  maternalCondition: z
    .enum([
      "pregnant_not_in_labour",
      "pregnant_in_labour",
      "less_than_42_days",
      "42_days_to_1_year",
      "none",
    ])
    .optional(),
  deathByExternalCauses: z.object({
    mannerOfDeath: z.string(),
    placeOfOccurrence: z.string(),
  }),
  attendant: z.object({
    type: z.enum([
      "Private Physician",
      "Public Health Officer",
      "Hospital Authority",
      "None",
      "Others",
    ]),
    duration: z.object({
      from: z.date().optional(),
      to: z.date().optional(),
    }),
  }),
  certification: z.object({
    hasAttended: z.boolean(),
    deathDateTime: z.string(),
    signature: z.string(),
    nameInPrint: z.string(),
    titleOfPosition: z.string(),
    address: z.string(),
    date: z.date(),
  }),
  disposal: z.object({
    method: z.string(),
    burialPermit: z.object({
      number: z.string(),
      dateIssued: z.date(),
    }),
    transferPermit: z.object({
      number: z.string(),
      dateIssued: z.date(),
    }),
  }),
  cemeteryAddress: z.string(),
  informant: z.object({
    signature: z.string(),
    nameInPrint: z.string(),
    relationshipToDeceased: z.string(),
    address: z.string(),
    date: z.date(),
  }),
  preparedBy: z.object({
    signature: z.string(),
    nameInPrint: z.string(),
    titleOrPosition: z.string(),
    date: z.date(),
  }),
  receivedBy: z.object({
    signature: z.string(),
    nameInPrint: z.string(),
    titleOrPosition: z.string(),
    date: z.date(),
  }),
  registeredAtCivilRegistrar: z.object({
    signature: z.string(),
    nameInPrint: z.string(),
    titleOrPosition: z.string(),
    date: z.date(),
  }),
  remarks: z.string().optional(),
});

type DeathCertificateFormValues = z.infer<typeof deathCertificateSchema>;

interface DeathCertificateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
}

export default function DeathCertificateForm({
  open,
  onOpenChange,
  onCancel,
}: DeathCertificateFormProps) {
  const form = useForm<DeathCertificateFormValues>({
    resolver: zodResolver(deathCertificateSchema),
    defaultValues: {
      sex: "Male",
      civilStatus: "Single",
      attendant: { type: "None" },
    },
  });

  function onSubmit(data: DeathCertificateFormValues) {
    console.log(data);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Republic of the Philippines
            <br />
            OFFICE OF THE CIVIL REGISTRAR GENERAL
            <br />
            CERTIFICATE OF DEATH
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="w-full max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle>Certificate of Death</CardTitle>
                <CardDescription>
                  Republic of the Philippines - Office of the Civil Registrar
                  General
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Registry Information */}

                {/* Location Information */}
                <div className="grid grid-cols-3 gap-4 pb-2">
                  <FormField
                    control={form.control}
                    name="registryNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registry Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Province</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cityMunicipality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City/Municipality</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="name.first"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name.middle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Middle Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name.last"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sex</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select sex" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Sex and Civil Status */}
                <div className="grid grid-cols-2 gap-4">
                  
                  <FormField
                    control={form.control}
                    name="civilStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Civil Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select civil status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Single">Single</SelectItem>
                            <SelectItem value="Married">Married</SelectItem>
                            <SelectItem value="Widowed">Widowed</SelectItem>
                            <SelectItem value="Divorced">Divorced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Date of Death and Date of Birth */}
                <div className="grid grid-cols-2 gap-4 py-2">
                  <FormField
                    control={form.control}
                    name="dateOfDeath"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <DatePickerField field={field} label="Date of Death" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className=" pb-2">
                        <DatePickerField field={field} label="Date of Birth" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Age at the Time of Death */}
                <div className="flex flex-col gap-2">
                  <h1>Age at the Time of Death</h1>
                  <div className="grid grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="ageAtDeath.years"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min={0}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value, 10))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ageAtDeath.months"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Months</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min={0}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value, 10))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ageAtDeath.days"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Days</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min={0}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value, 10))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ageAtDeath.hours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hours</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min={0}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value, 10))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Place of Death */}
                <FormField
                  control={form.control}
                  name="placeOfDeath"
                  render={({ field }) => (
                    <FormItem className="pb-2">
                      <FormLabel>Place of Death</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Religion, Citizenship, Residence, and Occupation */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="religion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Religion</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="citizenship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Citizenship</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="residence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Residence</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Occupation</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Family Information */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fatherName.first"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father's First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fatherName.last"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father's Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="motherMaidenName.first"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mother's First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="motherMaidenName.last"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mother's Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Medical Certificate */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Medical Certificate</h3>
                  <FormField
                    control={form.control}
                    name="causesOfDeath.immediate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Immediate Cause</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="causesOfDeath.antecedent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Antecedent Cause</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="causesOfDeath.underlying"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Underlying Cause</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Maternal Condition */}
                {form.watch("sex") === "Female" && (
                  <FormField
                    control={form.control}
                    name="maternalCondition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maternal Condition</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select maternal condition" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="pregnant_not_in_labour">
                              Pregnant, not in labour
                            </SelectItem>
                            <SelectItem value="pregnant_in_labour">
                              Pregnant, in labour
                            </SelectItem>
                            <SelectItem value="less_than_42_days">
                              Less than 42 days after delivery
                            </SelectItem>
                            <SelectItem value="42_days_to_1_year">
                              42 days to 1 year after delivery
                            </SelectItem>
                            <SelectItem value="none">
                              None of the choices
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Death by External Causes */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Death by External Causes
                  </h3>
                  <FormField
                    control={form.control}
                    name="deathByExternalCauses.mannerOfDeath"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manner of Death</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Homicide, Suicide, Accident, Legal Intervention, etc."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deathByExternalCauses.placeOfOccurrence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Place of Occurrence</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="home, farm, factory, street, sea, etc."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Attendant Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Attendant Information
                  </h3>
                  <FormField
                    control={form.control}
                    name="attendant.type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Attendant</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select attendant type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Private Physician">
                              Private Physician
                            </SelectItem>
                            <SelectItem value="Public Health Officer">
                              Public Health Officer
                            </SelectItem>
                            <SelectItem value="Hospital Authority">
                              Hospital Authority
                            </SelectItem>
                            <SelectItem value="None">None</SelectItem>
                            <SelectItem value="Others">Others</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="attendant.duration.from"
                      render={({ field }) => (
                        <FormItem>
                          <DatePickerField field={field} label="From" />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="attendant.duration.to"
                      render={({ field }) => (
                        <FormItem>
                          <DatePickerField field={field} label="To" />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Certification of Death */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Certification of Death
                  </h3>
                  <FormField
                    control={form.control}
                    name="certification.hasAttended"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Have you attended the deceased?
                          </FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="certification.deathDateTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date and Time of Death</FormLabel>
                        <FormControl>
                          <Input {...field} type="datetime-local" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="certification.signature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Signature</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="certification.nameInPrint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name in Print</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="certification.titleOfPosition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title or Position</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="certification.address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="certification.date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <DatePickerField field={field} label="Date" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Disposal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Disposal Information
                  </h3>
                  <FormField
                    control={form.control}
                    name="disposal.method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Method of Disposal</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Burial, Cremation, etc."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">
                        Burial/Cremation Permit
                      </h4>
                      <FormField
                        control={form.control}
                        name="disposal.burialPermit.number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Permit Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="disposal.burialPermit.dateIssued"
                        render={({ field }) => (
                          <FormItem>
                            <DatePickerField
                              field={field}
                              label="Date Issued"
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Transfer Permit</h4>
                      <FormField
                        control={form.control}
                        name="disposal.transferPermit.number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Permit Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="disposal.transferPermit.dateIssued"
                        render={({ field }) => (
                          <FormItem>
                            <DatePickerField
                              field={field}
                              label="Date Issued"
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Cemetery Information */}
                <FormField
                  control={form.control}
                  name="cemeteryAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Name and Address of Cemetery or Crematory
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Informant Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Certification of Informant
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="informant.signature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Signature</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="informant.nameInPrint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name in Print</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="informant.relationshipToDeceased"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship to the Deceased</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="informant.address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="informant.date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <DatePickerField field={field} label="Date" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Received By */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Received By</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="receivedBy.signature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Signature</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="receivedBy.nameInPrint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name in Print</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="receivedBy.titleOrPosition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title or Position</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="receivedBy.date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <DatePickerField field={field} label="Date" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Registered at Civil Registrar */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Registered at the Office of the Civil Registrar
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="registeredAtCivilRegistrar.signature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Signature</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="registeredAtCivilRegistrar.nameInPrint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name in Print</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="registeredAtCivilRegistrar.titleOrPosition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title or Position</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="registeredAtCivilRegistrar.date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <DatePickerField field={field} label="Date" />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Remarks/Annotations */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Remarks/Annotations (For LCRO/OCRG Use Only)
                  </h3>
                  <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[100px]"
                            placeholder="Official remarks and annotations will be entered here"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10"
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="h-10 ml-2">
                    <Save className="mr-2 h-4 w-4" />
                    Save Registration
                  </Button>
                </DialogFooter>
              </CardContent>
            </Card>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
