import BirthCertificateForm from "@/components/custom/forms/birth-form";
import DeathCertificateForm from "@/components/custom/forms/death-form";
import MarriageCertificateForm from "@/components/custom/forms/marriage-form";

export default async function dummyForm() {
  return (
    <>
      <div>
        {/* <BirthCertificateForm /> */}
        {/* <DeathCertificateForm /> */}
        <MarriageCertificateForm />
      </div>
    </>
  );
}
