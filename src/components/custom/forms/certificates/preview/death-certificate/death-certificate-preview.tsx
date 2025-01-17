"use client";

import { DeathCertificateFormValues } from "@/lib/types/zod-form-certificate/formSchemaCertificate";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import React from "react";
import { styles } from "./style";

interface DeathCertificatePDFProps {
  data: Partial<DeathCertificateFormValues>;
}

const formatDate = (date?: Date): string => {
  if (!date) return "N/A";
  return date.toLocaleDateString();
};

const DeathCertificatePDF: React.FC<DeathCertificatePDFProps> = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <Document>
        <Page size="LEGAL" style={styles.page}>
          <View style={styles.section}>
            <Text>No data available for preview.</Text>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="LEGAL" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.municipal}>
            <Text>Municipal Form No. 103</Text>
            <Text style={styles.headerNote1}>Revised August 2016</Text>
          </View>
          <View style={styles.republic}>
            <Text style={styles.headerSubtitle}>
              Republic of the Philippines
            </Text>
            <Text style={styles.headerSubtitle}>
              OFFICE OF THE CIVIL REGISTRAR GENERAL
            </Text>
            <Text style={styles.headerTitle}>CERTIFICATE OF DEATH</Text>
          </View>
          <View>
            <Text style={styles.headerNote2}>
              (To be accomplished in quadruplicate using black ink)
            </Text>
          </View>
        </View>

        {/* Registry Information */}
        <View style={styles.section1}>
          <View style={styles.fieldContainer1}>
            <View style={styles.fieldContainer2}>
              <Text style={styles.label}>Province:</Text>
              <Text style={styles.value}>{data.province || "N/A"}</Text>
            </View>
            <View style={styles.fieldContainer2}>
              <Text style={styles.label}>City/Municipality:</Text>
              <Text style={styles.value}>{data.cityMunicipality || "N/A"}</Text>
            </View>
          </View>
          <View style={styles.registry}>
            <Text style={styles.label}>Registry No.:</Text>
            <Text style={styles.data1}>{data.registryNumber || "N/A"}</Text>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.personalInfo}>
          <View style={styles.fieldContainer3}>
            <Text style={styles.label}>1. NAME</Text>
          </View>
          <View style={styles.fieldContainer3}>
            <Text style={styles.label}>(First):</Text>
            <Text style={styles.data1}>{data.name?.first || "N/A"}</Text>
          </View>
          <View style={styles.fieldContainer3}>
            <Text style={styles.label}>(Middle):</Text>
            <Text style={styles.data1}>{data.name?.middle || "N/A"}</Text>
          </View>
          <View style={styles.fieldContainer3}>
            <Text style={styles.label}>(Last):</Text>
            <Text style={styles.data1}>{data.name?.last || "N/A"}</Text>
          </View>

          <View style={styles.fieldContainer3}>
            <Text style={styles.label}>2. SEX:</Text>
            <Text style={styles.data1}>{data.sex || "N/A"}</Text>
          </View>
        </View>

        {/* Date of Death, Birth, and Age */}
        <View style={styles.DateOfDeath}>
          <View style={styles.fieldContainer4}>
            <Text style={styles.label}>3. DATE OF DEATH:</Text>
            <Text style={styles.data1}>
              {data.dateOfDeath ? formatDate(data.dateOfDeath) : "N/A"}
            </Text>
          </View>
          <View style={styles.fieldContainer4}>
            <Text style={styles.label}>4. DATE OF BIRTH:</Text>
            <Text style={styles.data1}>
              {data.dateOfBirth ? formatDate(data.dateOfBirth) : "N/A"}
            </Text>
          </View>
          <View style={styles.fieldContainer4}>
            <Text style={styles.label}>5. AGE AT THE TIME OF DEATH:</Text>
            <Text style={styles.data1}>
              {data.ageAtDeath
                ? `${data.ageAtDeath.years || 0} yrs, ${
                    data.ageAtDeath.months || 0
                  } mos, ${data.ageAtDeath.days || 0} d, ${
                    data.ageAtDeath.hours || 0
                  } hrs`
                : "N/A"}
            </Text>
          </View>
        </View>

        {/* Place of Death and Civil Status */}
        <View style={styles.fieldContainer5}>
          <View style={styles.PlaceOfDeathParent}>
            <View style={styles.PlaceOfDeath}>
              <Text style={styles.label}>6. PLACE OF DEATH:</Text>
              <Text style={styles.hospital}>
                (Name of Hospital/Clinic/Institution/House No., St., Brgy,
                City/Municipality, Province)
              </Text>
            </View>
            <Text style={styles.data1}>{data.placeOfDeath || "N/A"}</Text>
          </View>
          <View style={styles.CivilStatus}>
            <Text style={styles.label}>7. CIVIL STATUS:</Text>
            <Text style={styles.data1}>{data.civilStatus || "N/A"}</Text>
          </View>
        </View>

        {/* Religion, Citizenship, and Residence */}
        <View style={styles.fieldContainer6}>
          <View style={styles.religion}>
            <Text style={styles.label}>8. RELIGION:</Text>
            <Text style={styles.data1}>{data.religion || "N/A"}</Text>
          </View>
          <View style={styles.citizenship}>
            <Text style={styles.label}>9. CITIZENSHIP:</Text>
            <Text style={styles.data1}>{data.citizenship || "N/A"}</Text>
          </View>
          <View style={styles.residence}>
            <Text style={styles.label}>10. RESIDENCE:</Text>
            <Text style={styles.data1}>{data.residence || "N/A"}</Text>
          </View>
        </View>

        {/* Family Information */}
        <View style={styles.section2}>
          <View style={styles.occupation}>
            <Text style={styles.label}>11. OCCUPATION:</Text>
            <Text style={styles.data1}>{data.occupation || "N/A"}</Text>
          </View>
          <View style={styles.fieldContainer7}>
            <View style={styles.fatherName}>
              <Text style={styles.label}>12. NAME OF FATHER</Text>
              <Text style={styles.label1}>(First, Middle, Last)</Text>
            </View>
            <Text style={styles.data1}>
              {data.fatherName
                ? `${data.fatherName.first} ${data.fatherName.middle || ""} ${
                    data.fatherName.last
                  }`
                : "N/A"}
            </Text>
          </View>
          <View style={styles.fieldContainer8}>
            <View style={styles.motherMaidenName}>
              <Text style={styles.label}>13. MOTHER MAIDEN NAME</Text>
              <Text style={styles.label1}>(First, Middle, Last)</Text>
            </View>
            <Text style={styles.data1}>
              {data.motherMaidenName
                ? `${data.motherMaidenName.first} ${
                    data.motherMaidenName.middle || ""
                  } ${data.motherMaidenName.last}`
                : "N/A"}
            </Text>
          </View>
        </View>

        {/* Medical Certificate Section */}
        <View style={styles.medicalCertificate}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>MEDICAL CERTIFICATE</Text>
            <Text style={styles.subtitle}>
              (For ages 0 to 7 days, accomplish items 14-19a at the back)
            </Text>
          </View>

          {/* Causes of Death */}
          <View style={styles.causesOfDeath}>
            <Text style={styles.label}>
              19 b. CAUSES OF DEATH (If the deceased is aged 8 days and over)
            </Text>
            <View style={styles.causeRow}>
              <Text style={styles.causeLabel}>I. Immediate cause:</Text>
              <Text style={styles.causeValue}>
                a. {data.causesOfDeath?.immediate || "N/A"}
              </Text>
            </View>
            <View style={styles.causeRow}>
              <Text style={styles.causeLabel}>Antecedent cause:</Text>
              <Text style={styles.causeValue}>
                b. {data.causesOfDeath?.antecedent || "N/A"}
              </Text>
            </View>
            <View style={styles.causeRow}>
              <Text style={styles.causeLabel}>Underlying cause:</Text>
              <Text style={styles.causeValue}>
                c. {data.causesOfDeath?.underlying || "N/A"}
              </Text>
            </View>
            <View style={styles.causeRow}>
              <Text style={styles.causeLabel}>
                II. Other significant conditions contributing to death:
              </Text>
              <Text style={styles.causeValue}>
                {data.causesOfDeath?.contributingConditions || "N/A"}
              </Text>
            </View>
          </View>

          {/* Interval Between Onset and Death */}
          <View style={styles.intervalSection}>
            <Text style={styles.label}>Interval Between Onset and Death</Text>
            <View style={styles.intervalRow}>
              <Text style={styles.intervalValue}>
                {data.deathByExternalCauses?.mannerOfDeath || "N/A"}
              </Text>
            </View>
          </View>

          {/* Maternal Condition */}
          {data.sex === "Female" && (
            <View style={styles.maternalCondition}>
              <Text style={styles.label}>
                19c. MATERNAL CONDITION (If the deceased is female aged 15-49
                years old)
              </Text>
              <View style={styles.checkboxRow}>
                <Text style={styles.checkboxLabel}>
                  a. Pregnant, not in labour
                </Text>
                <Text style={styles.checkboxLabel}>b. Pregnant, in labour</Text>
                <Text style={styles.checkboxLabel}>
                  c. Less than 42 days after delivery
                </Text>
                <Text style={styles.checkboxLabel}>
                  d. 42 days to 1 year after delivery
                </Text>
                <Text style={styles.checkboxLabel}>e. None of the choices</Text>
              </View>
            </View>
          )}

          {/* Death by External Causes */}
          <View style={styles.externalCauses}>
            <Text style={styles.label}>19d. DEATH BY EXTERNAL CAUSES</Text>
            <View style={styles.externalCauseRow}>
              <Text style={styles.externalCauseLabel}>a. Manner of death:</Text>
              <Text style={styles.externalCauseValue}>
                {data.deathByExternalCauses?.mannerOfDeath || "N/A"}
              </Text>
            </View>
            <View style={styles.externalCauseRow}>
              <Text style={styles.externalCauseLabel}>
                b. Place of Occurrence of External Cause:
              </Text>
              <Text style={styles.externalCauseValue}>
                {data.deathByExternalCauses?.placeOfOccurrence || "N/A"}
              </Text>
            </View>
          </View>

          {/* Attendant Information */}
          <View style={styles.attendantSection}>
            <Text style={styles.label}>21a. ATTENDANT</Text>
            <View style={styles.attendantRow}>
              <Text style={styles.attendantLabel}>1. Private Physician</Text>
              <Text style={styles.attendantLabel}>
                2. Public Health Officer
              </Text>
              <Text style={styles.attendantLabel}>3. Hospital Authority</Text>
              <Text style={styles.attendantLabel}>4. None</Text>
              <Text style={styles.attendantLabel}>5. Others Specify:</Text>
            </View>
            <View style={styles.attendantDuration}>
              <Text style={styles.label}>
                21b. If attended, state duration (mm/dd/yy)
              </Text>
              <View style={styles.durationRow}>
                <Text style={styles.durationValue}>
                  {data.attendant?.duration?.from &&
                  data.attendant?.duration?.to
                    ? `From: ${new Date(
                        data.attendant.duration.from
                      ).toLocaleDateString()} To: ${new Date(
                        data.attendant.duration.to
                      ).toLocaleDateString()}`
                    : "N/A"}
                </Text>
              </View>
            </View>
          </View>

          {/* Certification of Death */}
          <View style={styles.certificationSection}>
            <Text style={styles.label}>22. CERTIFICATION OF DEATH</Text>
            <Text style={styles.certificationText}>
              I hereby certify that the foregoing particulars are correct as
              near as same can be ascertained and I further certify that I
              {data.certification?.hasAttended
                ? " have attended"
                : " have not attended"}{" "}
              the deceased and that death occurred at{" "}
              {data.certification?.deathDateTime || "N/A"} on the date of death
              specified above.
            </Text>
            <View style={styles.signatureSection}>
              <View style={styles.signatureRow}>
                <Text style={styles.signatureLabel}>Signature:</Text>
                <Text style={styles.signatureValue}>
                  {data.certification?.signature || "N/A"}
                </Text>
              </View>
              <View style={styles.signatureRow}>
                <Text style={styles.signatureLabel}>Name in Print:</Text>
                <Text style={styles.signatureValue}>
                  {data.certification?.nameInPrint || "N/A"}
                </Text>
              </View>
              <View style={styles.signatureRow}>
                <Text style={styles.signatureLabel}>Title of Position:</Text>
                <Text style={styles.signatureValue}>
                  {data.certification?.titleOfPosition || "N/A"}
                </Text>
              </View>
              <View style={styles.signatureRow}>
                <Text style={styles.signatureLabel}>Address:</Text>
                <Text style={styles.signatureValue}>
                  {data.certification?.address || "N/A"}
                </Text>
              </View>
              <View style={styles.signatureRow}>
                <Text style={styles.signatureLabel}>Date:</Text>
                <Text style={styles.signatureValue}>
                  {data.certification?.hasAttended || "N/A"}
                </Text>
              </View>
            </View>
          </View>

          {/* Reviewed By Section */}
          <View style={styles.reviewedBySection}>
            <Text style={styles.label}>REVIEWED BY:</Text>
            <View style={styles.reviewedByRow}>
              <Text style={styles.reviewedByLabel}>
                Signature Over Printed Name of Health Officer:
              </Text>
              <Text style={styles.reviewedByValue}>
                {data.remarks || "N/A"}
              </Text>
            </View>
            <View style={styles.reviewedByRow}>
              <Text style={styles.reviewedByLabel}>Date:</Text>
              <Text style={styles.reviewedByValue}>
                {data.remarks || "N/A"}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default DeathCertificatePDF;
