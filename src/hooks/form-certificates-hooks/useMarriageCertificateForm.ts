
import { MarriageCertificateFormValues, marriageCertificateSchema } from '@/lib/types/zod-form-certificate/marriage-certificate-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { submitMarriageCertificateForm } from '../form-certificate-actions';

interface UseMarriageCertificateFormProps {
    onOpenChange?: (open: boolean) => void;
}

export function useMarriageCertificateForm({
    onOpenChange,
}: UseMarriageCertificateFormProps = {}) {
    const formMethods = useForm<MarriageCertificateFormValues>({
        resolver: zodResolver(marriageCertificateSchema),
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            registryNumber: '',
            province: '',
            cityMunicipality: '',

            // Husband's Information
            husbandInfo: {
                name: {
                    first: '',
                    middle: '',
                    last: ''
                },
                placeOfBirth: {
                    houseNo: '',
                    st: '',
                    barangay: '',
                    cityMunicipality: '',
                    province: '',
                    country: '',
                },
                sex: 'male',
                religion: '',
                age: '',
                birth: undefined,
                citizenship: '',
                civilStatus: undefined,
                residence: '',
                husbandParents: {
                    father: {
                        first: '',
                        middle: '',
                        last: '',
                    },
                    mother: {
                        first: '',
                        middle: '',
                        last: '',
                    },
                    motherCitizenship: '',
                    fatherCitizenship: '',
                },
                husbandConsentPerson: {
                    first: '',
                    middle: '',
                    last: '',
                    relationship: '',
                    residence: '',

                },
            },

            // Wife's Information
            wifeInfo: {
                name: {
                    first: '',
                    middle: '',
                    last: ''
                },
                placeOfBirth: {
                    houseNo: '',
                    st: '',
                    barangay: '',
                    cityMunicipality: '',
                    province: '',
                    country: '',
                },
                sex: 'female',
                age: '',
                birth: undefined,
                citizenship: '',
                civilStatus: undefined,
                residence: '',
                wifeParents: {
                    father: {
                        first: '',
                        middle: '',
                        last: '',
                    },
                    mother: {
                        first: '',
                        middle: '',
                        last: '',
                    },
                    fatherCitizenship: '',
                    motherCitizenship: '',
                },
                wifeConsentPerson: {
                    first: '',
                    middle: '',
                    last: '',
                    relationship: '',
                    residence: '',
                },
            },

            // Marriage Details
            marriageDetails: {
                placeOfMarriage: {
                    barangay: '',
                    cityMunicipality: '',
                    province: '',
                    country: '',
                },
                dateOfMarriage: undefined,
                timeOfMarriage: '',
            },

            //Contracting parties

            husbandContractParty: {
                contractingParties: {
                    agreement: {
                        agreement: false
                    },
                    signature: '',
                }
            },

            wifeContractParty: {
                contractingParties: {
                    agreement: {
                        agreement: false
                    },
                    signature: '',
                }
            },

            contractDay: undefined,

            // Witnesses
            husbandWitnesses:
            {
                name: '',
                signature: '',
                name2: '',
                signature2: ''
            },
            wifeWitnesses:
            {
                name: '',
                signature: '',
                name2: '',
                signature2: ''
            },

            // Solemnizing Officer (Missing in previous version)
            solemnizingOfficer: {
                name: '',
                position: '',
                religion: '',
                registryNoExpiryDate: undefined,
            },

            // Marriage License Details
            marriageLicenseDetails: {
                number: '',
                placeIssued: '',
                dateIssued: undefined,
                marriageAgree: {
                    agreement: false
                },

            },
            // Marriage article
            marriageArticle: {
                articleAgree: {
                    agreement: false
                },
                articleExecutiveOrder: '',

            },

            // Marriage solemnized
            marriageSolemnized: undefined,

            // Other details
            receivedBy: {
                date: undefined,
                nameInPrint: '',
                signature: '',
                title: ''
            },
            registeredAtCivilRegistrar: {
                date: undefined,
                nameInPrint: '',
                signature: '',
                title: ''
            },
            remarks: '',

            // **************************
            // BACK PAGE: AFFIDAVIT OF SOLEMNIZING OFFICER
            // **************************
            affidavitOfSolemnizingOfficer: {
                administeringInformation: {
                    nameOfOfficer: '',
                    signatureOfOfficer: '',
                    position: '',
                    addressOfOfficer: { cityMunicipality: '', province: '', country: '' },
                },
                nameOfPlace: '',
                addressAt: '',
                1: {
                    nameOfHusband: { first: '', middle: '', last: '' },
                    nameOfWife: { first: '', middle: '', last: '' },
                },
                2: {
                    a: { agreement: false },
                    b: { agreement: false },
                    c: {
                        agreement: false,
                        nameOfHusband: { first: '', middle: '', last: '' },
                        nameOfWife: { first: '', middle: '', last: '' },
                    },
                    d: { agreement: false },
                    e: { agreement: false },
                },
                3: '',
                4: {
                    agreement: false,
                    dayOf: undefined,
                    atPlaceOfMarriage: { cityMunicipality: '', province: '', country: '' },
                },
                dateSworn: {
                    agreement: false,
                    dayOf: undefined,
                    atPlaceOfSworn: { cityMunicipality: '', province: '', country: '' },
                    ctcInfo: {
                        number: '',
                        dateIssued: '',
                        placeIssued: '',
                    },
                },
            },

            // **************************
            // BACK PAGE: AFFIDAVIT FOR DELAYED REGISTRATION
            // **************************
            affidavitForDelayed: {
                administeringInformation: {
                    nameOfOfficer: '',
                    signatureOfOfficer: '',
                    position: '',
                    addressOfOfficer: { cityMunicipality: '', province: '', country: '' },
                },
                applicantInformation: {
                    nameOfApplicant: '',
                    addressOfOfficer: { cityMunicipality: '', province: '', country: '' },
                },
                1: {
                    a: {
                        agreement: false,
                        nameOfPartner: '',
                        placeOfMarriage: { cityMunicipality: '', province: '', country: '' },
                        dateOfMarriage: undefined,
                    },
                    b: {
                        agreement: false,
                        nameOfHusband: '',
                        nameOfWife: '',
                        placeOfMarriage: { cityMunicipality: '', province: '', country: '' },
                        dateOfMarriage: undefined,
                    },
                },
                2: {
                    solemnizedBy: '',
                    sector: 'religious ceremony',
                },
                3: {
                    a: {
                        agreement: false,
                        licenseNo: 0,
                        dateIssued: undefined,
                        placeOfSolemnizedMarriage: { cityMunicipality: '', province: '', country: '' },
                    },
                    b: { agreement: false, underArticle: '' },
                },
                4: {
                    husbandCitizenship: '',
                    wifeCitizenship: '',
                },
                5: '',
                6: {
                    agreement: false,
                    date: undefined,
                    place: { cityMunicipality: '', province: '', country: '' },
                },
                dateSworn: {
                    agreement: false,
                    dayOf: undefined,
                    atPlaceOfSworn: { cityMunicipality: '', province: '', country: '' },
                    ctcInfo: {
                        number: '',
                        dateIssued: '',
                        placeIssued: '',
                    },
                },
            },

        },
    })

    const onSubmit = async (data: MarriageCertificateFormValues) => {
        try {
            await submitMarriageCertificateForm(data);
            toast.success('Form submitted successfully');
            onOpenChange?.(false);
        } catch {
            toast.error('Submission failed, please try again');
        }
    };

    const handleError = (errors: any) => {
        toast.error('Please check form for errors');
    };

    return { formMethods, onSubmit, handleError };
}



