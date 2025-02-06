// // src/components/custom/certified-true-copies/components/form-selection.tsx - not used for the meantime
// 'use client'

// import { useState } from 'react'
// import { useTranslation } from 'react-i18next'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

// import BirthAnnotationForm from '@/components/custom/forms/annotations/birth-cert'
// import DeathAnnotationForm from '@/components/custom/forms/annotations/death-annotation'
// import BirthCertificateForm from '@/components/custom/forms/certificates/birth-certificate-form'
// import DeathCertificateForm from '@/components/custom/forms/certificates/death-certificate-form'
// import MarriageAnnotationForm from '@/components/custom/forms/annotations/marriage-annotation-form'
// import MarriageCertificateForm from '@/components/custom/forms/certificates/marriage-certificate-form'

// interface FormSelectionProps {
//     open: boolean
//     onOpenChangeAction: (open: boolean) => void
// }

// export function FormSelection({ open, onOpenChangeAction }: FormSelectionProps) {
//     const { t } = useTranslation()
//     // Local states for the various certificate/annotation forms:
//     const [birthFormOpen, setBirthFormOpen] = useState(false)
//     const [deathFormOpen, setDeathFormOpen] = useState(false)
//     const [marriageFormOpen, setMarriageFormOpen] = useState(false)
//     const [marriageCertificateOpen, setMarriageCertificateOpen] = useState(false)
//     const [birthCertificateFormOpen, setBirthCertificateFormOpen] = useState(false)
//     const [deathCertificateOpen, setDeathCertificateOpen] = useState(false)

//     const handleFormSelect = (formType: string) => {
//         // Close the selection dialog...
//         onOpenChangeAction(false)
//         // ... and then open the corresponding form
//         switch (formType) {
//             case 'birth-annotation':
//                 setBirthFormOpen(true)
//                 break
//             case 'death-annotation':
//                 setDeathFormOpen(true)
//                 break
//             case 'marriage-annotation':
//                 setMarriageFormOpen(true)
//                 break
//             default:
//                 break
//         }
//     }

//     return (
//         <>
//             <Dialog open={open} onOpenChange={onOpenChangeAction}>
//                 <DialogContent className="sm:max-w-4xl">
//                     <DialogHeader>
//                         <DialogTitle className="text-center text-xl font-semibold">
//                             {t('formSelection.selectFormType')}
//                         </DialogTitle>
//                     </DialogHeader>

//                     <div className="flex gap-4">
//                         <Card
//                             className="flex-1 cursor-pointer hover:bg-accent transition-colors border dark:border-border"
//                             onClick={() => handleFormSelect('birth-annotation')}
//                         >
//                             <CardHeader>
//                                 <CardTitle className="text-center text-base">
//                                     {t('formSelection.birthForm')}
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent className="text-center">
//                                 <p className="text-sm text-muted-foreground">
//                                     {t('formSelection.birthAvailable')}
//                                 </p>
//                             </CardContent>
//                         </Card>
//                         <Card
//                             className="flex-1 cursor-pointer hover:bg-accent transition-colors border dark:border-border"
//                             onClick={() => handleFormSelect('death-annotation')}
//                         >
//                             <CardHeader>
//                                 <CardTitle className="text-center text-base">
//                                     {t('formSelection.deathForm')}
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent className="text-center">
//                                 <p className="text-sm text-muted-foreground">
//                                     {t('formSelection.deathAvailable')}
//                                 </p>
//                             </CardContent>
//                         </Card>
//                         <Card
//                             className="flex-1 cursor-pointer hover:bg-accent transition-colors border dark:border-border"
//                             onClick={() => handleFormSelect('marriage-annotation')}
//                         >
//                             <CardHeader>
//                                 <CardTitle className="text-center text-base">
//                                     {t('formSelection.marriageForm')}
//                                 </CardTitle>
//                             </CardHeader>
//                             <CardContent className="text-center">
//                                 <p className="text-sm text-muted-foreground">
//                                     {t('formSelection.marriageAvailable')}
//                                 </p>
//                             </CardContent>
//                         </Card>
//                     </div>
//                 </DialogContent>
//             </Dialog>

//             <BirthAnnotationForm
//                 open={birthFormOpen}
//                 onOpenChange={setBirthFormOpen}
//                 onCancel={() => setBirthFormOpen(false)}
//             />
//             <DeathAnnotationForm
//                 open={deathFormOpen}
//                 onOpenChange={setDeathFormOpen}
//                 onCancel={() => setDeathFormOpen(false)}
//             />
//             <MarriageAnnotationForm
//                 open={marriageFormOpen}
//                 onOpenChange={setMarriageFormOpen}
//                 onCancel={() => setMarriageFormOpen(false)}
//             />
//             <BirthCertificateForm
//                 open={birthCertificateFormOpen}
//                 onOpenChange={setBirthCertificateFormOpen}
//                 onCancel={() => setBirthCertificateFormOpen(false)}
//             />
//             <DeathCertificateForm
//                 open={deathCertificateOpen}
//                 onOpenChange={setDeathCertificateOpen}
//                 onCancel={() => setDeathCertificateOpen(false)}
//             />
//             <MarriageCertificateForm
//                 open={marriageCertificateOpen}
//                 onOpenChange={setMarriageCertificateOpen}
//                 onCancel={() => setMarriageCertificateOpen(false)}
//             />
//         </>
//     )
// }
