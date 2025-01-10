import Image from 'next/image';

const KioskHeader = () => {
  return (
    <header>
      <Image
        src='/path/to/image.jpg'
        alt='Kiosk Logo'
        width={500} // Replace with your desired width
        height={300} // Replace with your desired height
        priority // Use priority for critical images
      />
      <h1>Welcome to the Kiosk</h1>
    </header>
  );
};

export default KioskHeader;
