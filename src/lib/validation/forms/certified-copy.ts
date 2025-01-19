// src\lib\validation\forms\certified-copy.ts
import { z } from 'zod';

export const certifiedCopySchema = z.object({
    lcrNo: z.string().min(1, 'LCR number is required'),
    bookNo: z.string().min(1, 'Book number is required'),
    pageNo: z.string().min(1, 'Page number is required'),
    searchedBy: z.string().min(1, 'Searcher name is required'),
    contactNo: z.string().min(1, 'Contact number is required'),
    date: z.string().min(1, 'Date is required'),
    requesterName: z.string().min(1, 'Requester name is required'),
    relationshipToOwner: z.string().min(1, 'Relationship to owner is required'),
    address: z.string().min(1, 'Address is required'),
    purpose: z.string().min(1, 'Purpose is required'),
    formId: z.string().min(1, 'Form ID is required'),
});

export type CertifiedCopyFormData = z.infer<typeof certifiedCopySchema>;