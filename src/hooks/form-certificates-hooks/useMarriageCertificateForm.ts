
import { MarriageCertificateFormValues, marriageCertificateSchema } from '@/lib/types/zod-form-certificate/marriage-certificate-form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
// import { submitMarriageCertificateForm } from '../form-certificate-actions';

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
            registryNumber: '2025-000001', // Example registry number
            province: 'Albay',
            cityMunicipality: 'City of Tabaco',

            // Husband's Information
            husbandInfo: {
                name: {
                    first: 'Juan',
                    middle: 'Dela',
                    last: 'Cruz'
                },
                placeOfBirth: {
                    cityMunicipality: 'City of Tabaco',
                    province: 'Albay',
                    country: 'Philippines',
                },
                sex: 'male',
                religion: 'Catholic',
                age: '30',
                birth: new Date('1995-05-15'), // Example Date
                citizenship: 'Filipino',
                civilStatus: 'single',
                residence: 'Brgy. San Roque, Tabaco City',
                husbandParents: {
                    father: {
                        first: 'Pedro',
                        middle: 'Reyes',
                        last: 'Cruz',
                    },
                    mother: {
                        first: 'Maria',
                        middle: 'Santos',
                        last: 'Cruz',
                    },
                    motherCitizenship: 'Filipino',
                    fatherCitizenship: 'Filipino',
                },
                husbandConsentPerson: {
                    first: 'Jose',
                    middle: 'Martinez',
                    last: 'Lopez',
                    relationship: 'Guardian',
                    residence: 'Legazpi City',
                },
            },

            // Wife's Information
            wifeInfo: {
                name: {
                    first: 'Maria',
                    middle: 'Santos',
                    last: 'Reyes'
                },
                placeOfBirth: {
                    cityMunicipality: 'Legazpi City',
                    province: 'Albay',
                    country: 'Philippines',
                },
                sex: 'female',
                age: '28',
                birth: new Date('1997-10-20'), // Example Date
                citizenship: 'Filipino',
                civilStatus: 'single',
                religion: 'Catholic',
                residence: 'Brgy. Binanuahan, Legazpi City',
                wifeParents: {
                    father: {
                        first: 'Antonio',
                        middle: 'Gomez',
                        last: 'Reyes',
                    },
                    mother: {
                        first: 'Isabel',
                        middle: 'Dela Cruz',
                        last: 'Reyes',
                    },
                    fatherCitizenship: 'Filipino',
                    motherCitizenship: 'Filipino',
                },
                wifeConsentPerson: {
                    first: 'Ana',
                    middle: 'Gonzales',
                    last: 'Santos',
                    relationship: 'Aunt',
                    residence: 'Naga City',
                },
            },

            // Marriage Details
            marriageDetails: {
                placeOfMarriage: {
                    barangay: 'San Roque',
                    cityMunicipality: 'City of Tabaco',
                    province: 'Albay',
                    country: 'Philippines',
                },
                dateOfMarriage: new Date('2025-02-14'), // Example Date
                timeOfMarriage: '07:30',
            },

            // Contracting parties
            husbandContractParty: {
                contractingParties: {
                    agreement: {
                        agreement: true
                    },
                    signature: 'Juan D. Cruz',
                }
            },

            wifeContractParty: {
                contractingParties: {
                    agreement: {
                        agreement: true
                    },
                    signature: 'Maria S. Reyes',
                }
            },

            contractDay: new Date('2025-02-14'), // Example Date

            // Witnesses
            husbandWitnesses: {
                name: 'Carlos Mendoza',
                signature: 'Carlos Mendoza',
                name2: 'Fernando Ramos',
                signature2: 'Fernando Ramos'
            },

            wifeWitnesses: {
                name: 'Luisa Santos',
                signature: 'Luisa Santos',
                name2: 'Angela Dela Cruz',
                signature2: 'Angela Dela Cruz'
            },

            // Solemnizing Officer
            solemnizingOfficer: {
                name: 'Fr. Miguel Santos',
                position: 'Parish Priest',
                religion: 'Catholic',
                registryNoExpiryDate: '2027-12-31',
            },

            // Marriage License Details
            marriageLicenseDetails: {
                number: 'ML-2025-0001',
                placeIssued: 'Civil Registry of Tabaco',
                dateIssued: new Date('2025-01-10'),
                marriageAgree: {
                    agreement: true
                },
            },

            // Marriage Article
            marriageArticle: {
                articleAgree: {
                    agreement: true
                },
                articleExecutiveOrder: 'XVII',
            },

            // Marriage solemnized
            marriageSolemnized: {
                agreement: true
            },

            // Other details
            receivedBy: {
                date: new Date('2025-02-20'),
                nameInPrint: 'Verification Officer 3',
                signature: 'Verification Officer 3',
                title: 'Officer',
            },

            registeredAtCivilRegistrar: {
                date: new Date('2025-02-15'),
                nameInPrint: 'Registrar Officer 3',
                signature: 'Registrar Officer 3',
                title: 'Registrar',
            },

            remarks: 'No remarks',

            // **************************
            // BACK PAGE: AFFIDAVIT OF SOLEMNIZING OFFICER
            // **************************
            affidavitOfSolemnizingOfficer: {
                administeringInformation: {
                    nameOfOfficer: 'John Doe',
                    signatureOfOfficer: 'JohnDoeSignature',
                    position: 'Civil Registrar',
                    addressOfOffice: {
                        cityMunicipality: 'City of Manila',
                        province: 'Metro Manila',
                        country: 'Philippines'
                    },
                },
                nameOfPlace: 'Manila City Hall',
                addressAt: 'A. Villegas Street, Ermita, Manila, Philippines',
                a: {
                    nameOfHusband: {
                        first: '',
                        middle: '',
                        last: ''
                    },
                    nameOfWife: {
                        first: '',
                        middle: '',
                        last: ''
                    },
                },
                b: {
                    a: { agreement: true },
                    b: { agreement: false },
                    c: {
                        agreement: true,
                    },
                    d: { agreement: true },
                    e: { agreement: false },
                },
                c: 'Marriage was conducted under civil ceremony.',
                d: {

                    dayOf: new Date('2024-02-15'),
                    atPlaceOfMarriage: {
                        cityMunicipality: 'Quezon City',
                        province: 'Metro Manila',
                        country: 'Philippines',
                        barangay: 'Bagumbayan',
                        st: 'Katipunan Avenue'
                    },
                },
                dateSworn: {

                    dayOf: new Date('2024-02-16'),
                    atPlaceOfSworn: {
                        cityMunicipality: 'Makati',
                        province: 'Metro Manila',
                        country: 'Philippines',
                        barangay: 'Poblacion',
                        st: 'J.P. Rizal Street'
                    },
                    ctcInfo: {
                        number: 'CTC-987654321',
                        dateIssued: new Date('2024-02-16'),
                        placeIssued: 'Makati City Hall',
                    },
                },
                nameOfAdmin: {
                    address: 'National Statistics Office, Manila',
                    signature: {
                        signature: 'AdminSignature',
                        position: 'Senior Registrar',
                        name2: 'Robert Lim',
                    }
                }
            },


            // **************************
            // BACK PAGE: AFFIDAVIT FOR DELAYED REGISTRATION
            // **************************
            affidavitForDelayed: {
                administeringInformation: {
                    signatureOfAdmin: 'John Doe',
                    nameOfOfficer: 'Officer Name',
                    position: 'Admin Officer',
                    addressOfOfficer: {
                        cityMunicipality: 'Makati',
                        province: 'Metro Manila',
                        country: 'Philippines',
                        st: 'J.P. Rizal Street',
                        barangay: 'Poblacion'
                    }
                },
                applicantInformation: {
                    signatureOfApplicant: 'Jane Doe',
                    nameOfApplicant: 'Jane Marie Doe',
                    postalCode: '1210',
                    applicantAddress: {
                        cityMunicipality: 'Taguig',
                        province: 'Metro Manila',
                        country: 'Philippines',
                        st: 'C-5 Road',
                        barangay: 'Ususan'
                    }
                },
                a: {
                    a: {
                        agreement: true,
                        nameOfPartner: {
                            first: 'James',
                            middle: 'M',
                            last: 'Smith'
                        },
                        placeOfMarriage: 'Makati City Hall',
                        dateOfMarriage: new Date('2024-02-16'),
                    },
                    b: {
                        agreement: false,
                        nameOfHusband: {
                            first: 'Jome',
                            middle: '',
                            last: 'Pal'
                        },
                        nameOfWife: {
                            first: 'Queen',
                            middle: '',
                            last: 'Doe'
                        },
                        placeOfMarriage: 'Makati City Hall',
                        dateOfMarriage: undefined,
                    }
                },
                b: {
                    solemnizedBy: 'Rev. Father John',
                    sector: 'religious-ceremony',
                },
                c: {
                    a: {
                        licenseNo: '123456789',
                        dateIssued: new Date('2024-02-16'),
                        placeOfSolemnizedMarriage: 'Makati City Hall',
                    },
                    b: { underArticle: 'Article 34 of Executive Order No. 209' },
                },
                d: {
                    husbandCitizenship: 'Filipino',
                    wifeCitizenship: 'Filipino',
                },
                e: 'Additional remarks or information goes here.',
                f: {
                    date: new Date('2024-02-16'),
                    place: {
                        cityMunicipality: 'Makati',
                        province: 'Metro Manila',
                        country: 'Philippines',
                        barangay: 'Poblacion',
                        st: 'J.P. Rizal Street'
                    }
                },
                dateSworn: {
                    dayOf: new Date('2024-02-16'),
                    atPlaceOfSworn: {
                        cityMunicipality: 'Makati',
                        province: 'Metro Manila',
                        country: 'Philippines',
                        barangay: 'Poblacion',
                        st: 'J.P. Rizal Street'
                    },
                    ctcInfo: {
                        number: 'CTC-987654321',
                        dateIssued: new Date('2024-02-16'),
                        placeIssued: 'Makati City Hall',
                    }
                }
            }

        }

    })

    const onSubmit = async (data: MarriageCertificateFormValues) => {
        try {
            console.log('✅ Form Data Submitted:', JSON.stringify(data, null, 2)); // Pretty-print JSON data
            console.log('✅ Form Current State:', JSON.stringify(formMethods.getValues(), null, 2)); // Debug current state

            toast.success('Form submitted successfully');
            onOpenChange?.(false);
        } catch (error) {
            console.error('❌ Error submitting form:', error);
            toast.error('Submission failed, please try again');
        }
    };

    const handleError = (errors: any) => {
        console.error("❌ Form Errors:", errors); // Log errors for debugging

        const errorMessages: string[] = [];

        Object.entries(errors).forEach(([fieldName, error]: any) => {
            if (error?.message) {
                errorMessages.push(`${formatFieldName(fieldName)}: ${error.message}`);
            } else if (typeof error === "object") {
                Object.entries(error).forEach(([subField, subError]: any) => {
                    if (subError?.message) {
                        errorMessages.push(`${formatFieldName(fieldName)} → ${formatFieldName(subField)}: ${subError.message}`);
                    }
                });
            }
        });

        if (errorMessages.length > 0) {
            toast.error(errorMessages.join("\n")); // Show all errors in a single toast
        } else {
            toast.error("Please check the form for errors");
        }
    };

    // Helper function to make field names user-friendly
    const formatFieldName = (fieldName: string) => {
        return fieldName
            .replace(/([A-Z])/g, " $1") // Add space before capital letters
            .replace(/\./g, " → ") // Replace dots with arrows
            .trim()
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter
    };

    // ✅ Watch changes in husband's and wife's names
    const husbandName = useWatch({ control: formMethods.control, name: 'husbandInfo.name' });
    const wifeName = useWatch({ control: formMethods.control, name: 'wifeInfo.name' });

    // ✅ Sync husband's name to affidavit
    React.useEffect(() => {
        if (husbandName) {
            formMethods.setValue('affidavitOfSolemnizingOfficer.a.nameOfHusband', {
                first: husbandName.first || '',
                middle: husbandName.middle || '',
                last: husbandName.last || '',
            });
        }
    }, [husbandName, formMethods]);

    // ✅ Sync wife's name to affidavit
    React.useEffect(() => {
        if (wifeName) {
            formMethods.setValue('affidavitOfSolemnizingOfficer.a.nameOfWife', {
                first: wifeName.first || '',
                middle: wifeName.middle || '',
                last: wifeName.last || '',
            });
        }
    }, [wifeName, formMethods]);


    return { formMethods, onSubmit, handleError };
}



