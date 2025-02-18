
import { MarriageCertificateFormValues, marriageCertificateSchema } from '@/lib/types/zod-form-certificate/marriage-certificate-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

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
                    cityMunicipality: '',
                    province: '',
                    country: '',

                },
                sex: 'male',
                religion: '',
                age: undefined,
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
                    cityMunicipality: '',
                    province: '',
                    country: '',

                },
                sex: 'female',
                age: undefined,
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
                    office: '',
                    cityMunicipality: '',
                    province: '',
                },
                dateOfMarriage: undefined,
                timeOfMarriage: undefined,
            },

            //Contracting parties

            husbandContractParty: {
                signature: {
                    signature: '',
                    name: {
                        first: '',
                        middle: '',
                        last: ''
                    }
                }
            },

            wifeContractParty: {
                signature: {
                    signature: '',
                    name: {
                        first: '',
                        middle: '',
                        last: ''
                    }
                }
            },

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
                marriageAgree: undefined,
                number: '',
                dateIssued: undefined,
                placeIssued: '',
            },
            // Marriage article
            marriageArticle: {
                articleAgree: undefined,
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
    });

    return formMethods;
}
