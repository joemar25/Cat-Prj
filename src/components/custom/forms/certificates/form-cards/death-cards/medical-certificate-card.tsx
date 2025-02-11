// MedicalCertificateCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
;

const MedicalCertificateCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Certificate</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          The Medical Certificate section is located on the back of the death
          certificate form. Please navigate to the back of the form to fill out
          the required information.
        </p>
      </CardContent>
    </Card>
  );
};

export default MedicalCertificateCard;
