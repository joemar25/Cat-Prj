'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BirthAnnotationForm = () => {
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <Card className='max-w-3xl mx-auto p-6'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl text-center'>
          BIRTH CERTIFICATE
        </CardTitle>
        <div className='text-right text-sm'>June 20, 2024</div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='text-sm mb-4'>
            TO WHOM IT MAY CONCERN:
            <p>
              We certify that, among others, the following facts of birth appear
              in our Register of Birth on
            </p>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='flex items-center gap-2'>
              <span className='whitespace-nowrap'>page number</span>
              <input type='text' className='flex-1 p-2 border rounded' />
            </div>
            <div className='flex items-center gap-2'>
              <span>book number</span>
              <input type='text' className='flex-1 p-2 border rounded' />
            </div>
          </div>

          {[
            'Registry Number',
            'Date of Registration',
            'Name of Child',
            'Sex',
            'Date of Birth',
            'Place of Birth',
            'Name of Mother',
            'Citizenship of Mother',
            'Name of Father',
            'Citizenship of Father',
            'Date of Marriage Parents',
            'Place of Marriage of Parents',
          ].map((label) => (
            <div key={label} className='flex items-center gap-4'>
              <label className='min-w-[200px]'>{label}</label>
              <span className='px-2'>:</span>
              <input
                type='text'
                className='flex-1 p-2 border rounded'
                name={label.toLowerCase().replace(/\s+/g, '_')}
              />
            </div>
          ))}

          <div className='space-y-2 mt-6'>
            <p>This certification is issued to</p>
            <input type='text' className='w-full p-2 border rounded' />
            <p>upon his/her request for</p>
            <input type='text' className='w-full p-2 border rounded' />
          </div>

          <div className='mt-6'>
            <p className='font-semibold'>REMARKS</p>
            <textarea className='w-full p-2 border rounded mt-2 h-24' />
          </div>

          <div className='grid grid-cols-2 gap-8 mt-8'>
            <div className='space-y-4'>
              <p>Prepared by</p>
              <input
                type='text'
                className='w-full p-2 border rounded'
                placeholder='Name and Signature'
              />
              <input
                type='text'
                className='w-full p-2 border rounded'
                placeholder='Position'
              />
            </div>
            <div className='space-y-4'>
              <p>Verified by</p>
              <input
                type='text'
                className='w-full p-2 border rounded'
                placeholder='Name and Signature'
              />
              <input
                type='text'
                className='w-full p-2 border rounded'
                placeholder='Position'
              />
            </div>
          </div>

          <div className='text-right mt-4'>
            <p className='font-semibold'>PRISCILLA L. GALICIA</p>
            <p className='text-sm'>OIC - City Civil Registrar</p>
          </div>

          <button
            type='submit'
            className='w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 mt-6'
          >
            Submit Form
          </button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BirthAnnotationForm;
