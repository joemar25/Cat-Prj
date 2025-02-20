// components/SignatureUploader.tsx
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

interface SignatureUploaderProps {
  /**
   * The name of the field for use in your form and Zod schema.
   */
  name: string;
  /**
   * The label for the upload button.
   */
  label?: string;
  /**
   * Callback to pass the selected file back to the parent.
   */
  onChange?: (file: File) => void;
}

const SignatureUploader: React.FC<SignatureUploaderProps> = ({
  name,
  label = 'Upload Signature',
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

  return (
    <div className='signature-uploader'>
      <label htmlFor={name} className='block text-sm font-medium text-gray-700'>
        {label}
      </label>
      <div className='mt-2 flex items-center space-x-4'>
        <Button
          variant='outline'
          onClick={() => document.getElementById(name)?.click()}
        >
          {selectedFile ? 'Change Signature' : label}
        </Button>
        <input
          id={name}
          name={name}
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          className='hidden'
        />
        {selectedFile && (
          <div>
            <a
              href={URL.createObjectURL(selectedFile)}
              download={selectedFile.name}
              className='text-blue-500 underline'
            >
              Download Signature
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignatureUploader;
