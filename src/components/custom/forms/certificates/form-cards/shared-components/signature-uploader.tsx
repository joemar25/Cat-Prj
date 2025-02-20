import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';

interface SignatureUploaderProps {
  /**
   * The name of the field for use in your form and Zod schema.
   */
  name: string;
  /**
   * The label for the field.
   */
  label?: string;
  /**
   * Callback to pass the selected file back to the parent.
   */
  onChange?: (file: File) => void;
}

const SignatureUploader: React.FC<SignatureUploaderProps> = ({
  name,
  label = 'Signature',
  onChange,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onChange?.(file);
    }
  };

  const triggerFileInput = () => {
    document.getElementById(name)?.click();
  };

  return (
    <div className='signature-uploader'>
      {/* Hidden file input */}
      <input
        id={name}
        name={name}
        type='file'
        accept='image/*'
        onChange={handleFileChange}
        className='hidden'
      />

      <HoverCard>
        <HoverCardTrigger asChild>
          <div className='relative'>
            <Input
              placeholder={
                selectedFile ? 'Change Signature' : 'Upload Signature'
              }
              readOnly
              onClick={triggerFileInput}
              className='h-10 cursor-pointer pr-10'
            />
            {selectedFile && (
              <span className='absolute inset-y-0 right-2 flex items-center text-green-500'>
                <CheckCircle2 className='w-5 h-5' />
              </span>
            )}
          </div>
        </HoverCardTrigger>
        {selectedFile && (
          <HoverCardContent
            side='top'
            align='center'
            className='p-2 flex items-center justify-center'
          >
            <img
              src={URL.createObjectURL(selectedFile)}
              alt='Signature Preview'
              className='w-full h-full object-contain'
            />
          </HoverCardContent>
        )}
      </HoverCard>
    </div>
  );
};

export default SignatureUploader;
