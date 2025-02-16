import {
  DeathCertificateFormValues,
  deathCertificateFormSchema,
} from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface UseDeathCertificateFormProps {
  onOpenChange?: (open: boolean) => void;
}

export function useDeathCertificateForm({
  onOpenChange,
}: UseDeathCertificateFormProps = {}) {
  const formMethods = useForm<DeathCertificateFormValues>({
    resolver: zodResolver(deathCertificateFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      registryNumber: '',
      province: '',
      cityMunicipality: '',
      // Deceased Information
      name: {
        first: '',
        middle: '',
        last: '',
      },
      sex: undefined,
      dateOfDeath: undefined,
      timeOfDeath: undefined,
      ageAtDeath: {
        years: '',
        months: '',
        days: '',
        hours: '',
      },
      placeOfDeath: {
        houseNo: '',
        st: '',
        barangay: '',
        cityMunicipality: '',
        province: '',
        country: '',
      },
      civilStatus: '',
      religion: '',
      citizenship: '',
      residence: {
        houseNo: '',
        st: '',
        barangay: '',
        cityMunicipality: '',
        province: '',
        country: '',
      },
      occupation: '',
      // Parent Information
      parents: {
        fatherName: {
          first: '',
          middle: '',
          last: '',
        },
        motherName: {
          first: '',
          middle: '',
          last: '',
        },
      },
      // Medical Certificate
      medicalCertificate: {
        infantDeathDetails: undefined,
        causesOfDeath: {
          immediate: { cause: '', interval: '' },
          antecedent: { cause: '', interval: '' },
          underlying: { cause: '', interval: '' },
          otherSignificantConditions: '',
        },
        maternalCondition: undefined,
        externalCauses: {
          mannerOfDeath: '',
          placeOfOccurrence: '',
        },
        attendant: {
          privatePhysician: false,
          publicHealthOfficer: false,
          hospitalAuthority: false,
          none: false,
          others: false,
          othersSpecify: '',
          duration: { from: '', to: '' },
        },
        autopsy: false,
      },
      // Certification of Death
      certificationOfDeath: {
        hasAttended: false,
        signature: '',
        nameInPrint: '',
        titleOfPosition: '',
        address: '',
        date: undefined,
      },
      // Review
      reviewedBy: {
        signature: '',
        date: undefined,
      },
      // Certificates
      postmortemCertificate: undefined,
      embalmerCertification: undefined,
      delayedRegistration: undefined,
      // Disposal Information
      corpseDisposal: '',
      burialPermit: {
        number: '',
        dateIssued: undefined,
      },
      transferPermit: undefined,
      cemeteryOrCrematory: {
        name: '',
        address: '',
      },
      // Informant
      informant: {
        signature: '',
        nameInPrint: '',
        relationshipToDeceased: '',
        address: '',
        date: undefined,
      },
      // Processing Information
      preparedBy: {
        signature: '',
        nameInPrint: '',
        titleOrPosition: '',
        date: undefined,
      },
      receivedBy: {
        signature: '',
        nameInPrint: '',
        titleOrPosition: '',
        date: undefined,
      },
      registeredByOffice: {
        signature: '',
        nameInPrint: '',
        titleOrPosition: '',
        date: undefined,
      },
      remarks: '',
    },
  });

  // For now, simply log the data on valid submission.
  const onSubmit = async (data: DeathCertificateFormValues) => {
    console.log('Valid submission:', data);
    toast.success('Form validated successfully');
    onOpenChange?.(false);
  };

  const handleError = (errors: any) => {
    console.log('Form Validation Errors:', JSON.stringify(errors, null, 2));
    toast.error('Please check form for errors');
  };

  return { formMethods, onSubmit, handleError };
}
