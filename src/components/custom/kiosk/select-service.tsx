'use client';

import { KioskService, useKioskStore } from '@/state/use-kiosk-store';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface SelectServiceStepProps {
  onServiceSelected: (service: string) => void;
  selectedService: string | null;
}

export function SelectServiceStep({
  onServiceSelected,
  selectedService: initialService,
}: SelectServiceStepProps) {
  const { service, setService } = useKioskStore();
  const [selectedService, setSelectedService] = useState<string>(
    initialService || 'VERIFY'
  );

  useEffect(() => {
    if (service) {
      setSelectedService(service);
    } else {
      setSelectedService('VERIFY');
    }
  }, [service]);

  const handleSelectService = (service: string) => {
    setSelectedService(service);
    setService(service as KioskService);
    onServiceSelected(service);
  };

  return (
    <div className='w-full h-full flex justify-evenly items-center p-8'>
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`rounded-lg shadow-sm p-4 h-72 w-72 border-2 border-black cursor-pointer ${
          selectedService === 'VERIFY' ? 'bg-[#FFD101] h-80 w-80' : ''
        }`}
        onClick={() => handleSelectService('VERIFY')}
      >
        <div className='w-full h-full flex flex-col gap-4 justify-center items-center'>
          <Image
            src='/select-reg.svg'
            width={96} // Adjust based on your design
            height={96} // Adjust based on your design
            alt='New Application Registration'
          />
          <span className='uppercase font-semibold w-full max-w-48 text-center'>
            New Application Registration
          </span>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`rounded-lg shadow-sm p-4 h-72 w-72 border-2 cursor-pointer border-black ${
          selectedService === 'TRUE_COPY' ? 'bg-[#FFD101] h-80 w-80' : ''
        }`}
        onClick={() => handleSelectService('TRUE_COPY')}
      >
        <div className='w-full h-full flex flex-col gap-4 justify-center items-center'>
          <Image
            src='/select-cert.svg'
            width={96} // Adjust based on your design
            height={96} // Adjust based on your design
            alt='Apply for Certified True Xerox Copy'
          />
          <span className='uppercase font-semibold w-full max-w-sm text-center'>
            Apply for certified true xerox copy
          </span>
        </div>
      </motion.div>
    </div>
  );
}
