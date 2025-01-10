'use client';

import { DocumentType, useKioskStore } from '@/state/use-kiosk-store';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface TrueCopyRequestProps {
  onDocumentsSelected: (documents: DocumentType[]) => void;
  showSubmitButton: boolean;
  onSubmit: () => void;
}

export function TrueCopyRequest({
  onDocumentsSelected,
  showSubmitButton,
  onSubmit,
}: TrueCopyRequestProps) {
  const { setSelectedDocuments } = useKioskStore();
  const [selectedDocs, setSelectedDocs] = useState<DocumentType[]>([]);

  const documentTypes = [
    {
      value: 'birth' as DocumentType,
      label: 'Birth Certificate',
      icon: '/birth-cert.svg',
    },
    {
      value: 'marriage' as DocumentType,
      label: 'Marriage Certificate',
      icon: '/marriage-cert.svg',
    },
    {
      value: 'death' as DocumentType,
      label: 'Death Certificate',
      icon: '/death-cert.svg',
    },
  ];

  const handleSelectDocument = (docType: DocumentType) => {
    let updatedDocs: DocumentType[];
    if (selectedDocs.includes(docType)) {
      updatedDocs = selectedDocs.filter((doc) => doc !== docType);
    } else {
      updatedDocs = [...selectedDocs, docType];
    }
    setSelectedDocs(updatedDocs);
    setSelectedDocuments(updatedDocs);
    onDocumentsSelected(updatedDocs);
  };

  return (
    <div className='w-full h-full flex flex-col justify-evenly items-center p-8'>
      <div className='flex justify-evenly items-center w-full'>
        {documentTypes.map((doc) => (
          <motion.div
            key={doc.value}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`rounded-lg shadow-sm p-4 h-72 w-72 border-2 border-black cursor-pointer ${
              selectedDocs.includes(doc.value) ? 'bg-[#FFD200] h-80 w-80' : ''
            }`}
            onClick={() => handleSelectDocument(doc.value)}
          >
            <div className='w-full h-full flex flex-col gap-4 justify-center items-center'>
              <Image
                src={doc.icon}
                alt={doc.label}
                width={96} // Set appropriate width
                height={96} // Set appropriate height
              />
              <span className='uppercase font-semibold w-full max-w-sm text-center'>
                {doc.label}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      {showSubmitButton && (
        <button
          type='button'
          className='mt-8 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all'
          onClick={onSubmit}
          disabled={selectedDocs.length === 0}
        >
          Submit
        </button>
      )}
    </div>
  );
}
