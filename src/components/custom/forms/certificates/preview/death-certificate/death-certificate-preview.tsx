'use client';

import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import { formatDateTime } from '@/utils/date';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { styles } from './style';
import { sty } from './stylish';

interface DeathCertificatePDFProps {
  data: Partial<DeathCertificateFormValues>;
}

const formatDate = (date?: Date): string => {
  if (!date) return 'N/A';
  return date.toLocaleDateString();
};

const DeathCertificatePDF: React.FC<DeathCertificatePDFProps> = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <Document>
        <Page size='LEGAL' style={styles.page}>
          <View style={styles.section}>
            <Text>No data available for preview.</Text>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size='LEGAL' style={styles.page}>
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
        <View>
          <View style={sty.gridContainer}>
            {/* Left Grid: Province and City/Municipality */}
            <View style={sty.leftGrid}>
              <View style={sty.fieldContainer}>
                <Text style={sty.label}>Province:</Text>
                <Text style={sty.value}>{data.province || 'N/A'}</Text>
              </View>
              <View style={sty.fieldContainer}>
                <Text style={sty.label}>City/Municipality:</Text>
                <Text style={sty.value}>{data.cityMunicipality || 'N/A'}</Text>
              </View>
            </View>

            {/* Right Grid: Registry No. */}
            <View style={sty.rightGrid}>
              <View style={sty.registryNoContainer}>
                <Text style={sty.label}>Registry No.:</Text>
                <Text style={sty.value}>{data.registryNumber || 'N/A'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.personalInfo}>
          <View style={styles.fieldContainer3}>
            <Text style={styles.label}>1. NAME</Text>
          </View>
          <View style={styles.fieldContainer3}>
            <Text style={styles.label}>(First):</Text>
            <Text style={styles.data1}>{data.name?.first || 'N/A'}</Text>
          </View>
          <View style={styles.fieldContainer3}>
            <Text style={styles.label}>(Middle):</Text>
            <Text style={styles.data1}>{data.name?.middle || 'N/A'}</Text>
          </View>
          <View
            style={[styles.fieldContainer3, { borderRight: '1px solid #000' }]}
          >
            <Text style={styles.label}>(Last):</Text>
            <Text style={styles.data1}>{data.name?.last || 'N/A'}</Text>
          </View>

          <View style={styles.fieldContainer3}>
            <Text style={styles.label}>2. SEX:</Text>
            <Text style={styles.data1}>{data.sex || 'N/A'}</Text>
          </View>
        </View>

        {/* Date of Death, Birth, and Age */}
        <View style={styles.DateOfDeath}>
          <View style={styles.fieldContainer4}>
            <Text style={styles.label}>3. DATE OF DEATH:</Text>
            <Text style={styles.data1}>
              {data.dateOfDeath ? formatDate(data.dateOfDeath) : 'N/A'}
            </Text>
          </View>
          <View style={styles.fieldContainer4}>
            <Text style={styles.label}>4. DATE OF BIRTH:</Text>
            <Text style={styles.data1}>
              {data.dateOfBirth ? formatDate(data.dateOfBirth) : 'N/A'}
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
                : 'N/A'}
            </Text>
          </View>
        </View>

        {/* Place of Death and Civil Status */}
        <View style={styles.fieldContainer5}>
          <View style={styles.PlaceOfDeathParent}>
            <Text style={styles.label}>6. PLACE OF DEATH:</Text>
            <View style={styles.PlaceOfDeath}>
              <Text style={styles.hospital}>
                (Name of Hospital/Clinic/Institution/House No., St., Brgy,
                City/Municipality, Province)
              </Text>
              <Text style={styles.data1}>{data.placeOfDeath || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.CivilStatus}>
            <Text style={styles.label}>7. CIVIL STATUS:</Text>
            <Text style={styles.data1}>{data.civilStatus || 'N/A'}</Text>
          </View>
        </View>

        {/* Religion, Citizenship, and Residence */}
        <View style={styles.fieldContainer6}>
          <View style={styles.religion}>
            <Text style={styles.label}>8. RELIGION:</Text>
            <Text style={styles.data1}>{data.religion || 'N/A'}</Text>
          </View>
          <View style={styles.citizenship}>
            <Text style={styles.label}>9. CITIZENSHIP:</Text>
            <Text style={styles.data1}>{data.citizenship || 'N/A'}</Text>
          </View>
          <View style={styles.residence}>
            <Text style={styles.label}>10. RESIDENCE:</Text>
            <Text style={styles.data1}>{data.residence || 'N/A'}</Text>
          </View>
        </View>

        {/* Family Information */}
        <View style={styles.section2}>
          <View style={styles.occupation}>
            <Text style={styles.label}>11. OCCUPATION:</Text>
            <Text style={styles.data1}>{data.occupation || 'N/A'}</Text>
          </View>
          <View style={styles.fieldContainer7}>
            <View style={styles.fatherName}>
              <Text style={styles.label}>12. NAME OF FATHER</Text>
              <Text style={styles.label1}>(First, Middle, Last)</Text>
            </View>
            <Text style={styles.data1}>
              {data.fatherName
                ? `${data.fatherName.first} ${data.fatherName.middle || ''} ${
                    data.fatherName.last
                  }`
                : 'N/A'}
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
                    data.motherMaidenName.middle || ''
                  } ${data.motherMaidenName.last}`
                : 'N/A'}
            </Text>
          </View>
        </View>

        {/* Medical Certificate */}
        <View style={styles.medicalCertificate}>
          <View style={styles.medicalHeader}>
            <Text style={styles.sectionTitle}>MEDICAL CERTIFICATE</Text>
            <Text style={styles.sectionTitle2}>
              (For ages 0 to 7 days, accomplish items 14-19a at the back)
            </Text>
          </View>
          <View style={styles.fieldContainer9}>
            {/* Grid Container */}
            <View style={styles.gridContainer}>
              {/* First Row: Title and Interval Label */}
              <View style={styles.gridRow}>
                <View style={[styles.gridColumn, { flex: 2 }]}>
                  <Text style={styles.label}>
                    19b. CAUSES OF DEATH (If the deceased is aged 8 days over)
                  </Text>
                </View>
                <View style={[styles.gridColumn, { flex: 1 }]}>
                  <Text style={styles.label1}>
                    Interval between onset and death
                  </Text>
                </View>
              </View>

              {/* Second Row: Immediate, Antecedent, and Underlying Causes */}
              <View style={styles.Other}>
                <View style={styles.gridRow}>
                  {/* Labels Column */}
                  <View style={[styles.gridColumn, { flex: 1 }]}>
                    <Text style={styles.label3}>I. Immediate Cause:</Text>
                    <Text style={styles.label3}>Antecedent Cause:</Text>
                    <Text style={styles.label3}>Underlying Cause:</Text>
                  </View>

                  {/* Values Column */}
                  <View style={[styles.gridColumn, { flex: 1 }]}>
                    <Text style={styles.data2}>
                      {data.causesOfDeath?.immediate || 'N/A'}
                    </Text>
                    <Text style={styles.data2}>
                      {data.causesOfDeath?.antecedent || 'N/A'}
                    </Text>
                    <Text style={styles.data2}>
                      {data.causesOfDeath?.underlying || 'N/A'}
                    </Text>
                  </View>

                  {/* Interval Column */}
                  <View style={[styles.gridColumn, { flex: 1 }]}>
                    {/* <Text style={styles.data2}></Text>
                    <Text style={styles.data2}></Text>
                    <Text style={styles.data2}></Text> */}
                  </View>
                </View>
                <View style={[styles.rowSpan, { flex: 2 }]}>
                  <Text style={styles.label3}>
                    II. Other significant conditions contributing to death:
                  </Text>
                  <Text style={styles.data3}></Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Maternal Condition */}
        <View style={styles.maternalConditionContainer}>
          <Text style={styles.maternalConditionLabel}>
            19c. Maternal Condition:
          </Text>
          <Text style={styles.maternalConditionValue}>
            {data.maternalCondition || 'N/A'}
          </Text>
        </View>

        {/* Death by External Causes and Autopsy */}
        <View style={styles.deathExternalCausesContainer}>
          {/* Section 19: Death by External Causes */}
          <View style={styles.section19Container}>
            <View style={styles.deathExternalCausesTitleContainer}>
              <Text style={styles.deathExternalCausesTitle}>
                19d. DEATH BY EXTERNAL CAUSES
              </Text>
            </View>

            {/* Manner of Death */}
            <View style={styles.deathExternalCausesFieldContainer}>
              <Text style={styles.deathExternalCausesLabel}>
                Manner of Death:
              </Text>
              <Text style={styles.deathExternalCausesValue}>
                {data.deathByExternalCauses?.mannerOfDeath || 'N/A'}
              </Text>
            </View>

            {/* Place of Occurrence */}
            <View style={styles.deathExternalCausesFieldContainer}>
              <Text style={styles.deathExternalCausesLabel}>
                Place of Occurrence:
              </Text>
              <Text style={styles.deathExternalCausesValue}>
                {data.deathByExternalCauses?.placeOfOccurrence || 'N/A'}
              </Text>
            </View>
          </View>

          {/* Section 20: Autopsy */}
          <View style={styles.section20Container}>
            <Text style={styles.autopsyTitle}>20. Autopsy (yes/no)</Text>
            <Text style={styles.autopsyValue}>{'N/A'}</Text>
          </View>
        </View>

        {/* Attendant Information */}
        <View style={styles.attendantSection2}>
          {/* 21a. Attendant Information */}
          <View style={styles.attendantSection3}>
            <Text style={styles.attendantSectionTitle}>
              21a. ATTENDANT INFORMATION
            </Text>
            <View style={styles.attendantContainer}>
              <View style={styles.attendantFieldContainer}>
                <Text style={styles.attendantLabel2}>Type:</Text>
                <Text style={styles.attendantValue}>
                  {data.attendant?.type || 'N/A'}
                </Text>
              </View>
              <View style={styles.attendantFieldContainer}>
                <Text style={styles.attendantLabel2}>Duration:</Text>
                <Text style={styles.attendantValue}>
                  {data.attendant?.duration?.from &&
                  data.attendant?.duration?.to
                    ? `From: ${new Date(
                        data.attendant.duration.from
                      ).toLocaleDateString()} To: ${new Date(
                        data.attendant.duration.to
                      ).toLocaleDateString()}`
                    : 'N/A'}
                </Text>
              </View>
            </View>
          </View>

          {/* 21b. If attended, state duration */}
          <View style={styles.attendantSection4}>
            <Text style={styles.attendantSectionTitle}>
              21b. If attended, state duration
            </Text>
            <View style={styles.attendantFieldContainerColumn}>
              <Text style={styles.attendantValue}>
                From:{' '}
                {data.attendant?.duration?.from
                  ? new Date(data.attendant.duration.from).toLocaleDateString()
                  : 'N/A'}
              </Text>
              <Text style={styles.attendantValue}>
                To:{' '}
                {data.attendant?.duration?.to
                  ? new Date(data.attendant.duration.to).toLocaleDateString()
                  : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Certification of Death */}
        <View style={styles.certificationSection11}>
          <Text style={styles.certificationTitle}>
            22a. CERTIFICATION OF DEATH
          </Text>

          {/* Attended Deceased */}
          <View style={styles.fieldContainer11}>
            <Text style={styles.attendedLabel}>Attended Deceased:</Text>
            <Text style={styles.attendedValue}>
              {data.certification?.hasAttended ? 'Yes' : 'No'}
            </Text>
          </View>
          <View style={styles.fieldContainer11}>
            <Text style={styles.attendedLabel}>Death Date/Time:</Text>
            <Text style={styles.attendedValue}>
              {data.certification?.deathDateTime
                ? formatDateTime(data.certification.deathDateTime, {
                    monthFormat: 'numeric',
                    dayFormat: 'numeric',
                    yearFormat: 'numeric',
                    showTime: true,
                    hourFormat: 'numeric',
                    minuteFormat: '2-digit',
                  })
                : 'N/A'}
            </Text>
          </View>

          {/* Name */}
          <View style={styles.fieldContainer11}>
            <Text style={styles.nameLabel}>Name:</Text>
            <Text style={styles.nameValue}>
              {data.certification?.nameInPrint || 'N/A'}
            </Text>
          </View>

          {/* Title/Position */}
          <View style={styles.fieldContainer11}>
            <Text style={styles.titleLabel}>Title/Position:</Text>
            <Text style={styles.titleValue}>
              {data.certification?.titleOfPosition || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Disposal Information */}
        <View style={styles.gridContainer22}>
          {/* Cell 1: Corpse Disposal */}
          <View style={styles.corpseDisposalCell}>
            <Text style={styles.corpseDisposalLabel}>23. CORPSE DISPOSAL</Text>
            <Text style={styles.corpseDisposalValue}>
              {data.disposal?.method || 'N/A'}
            </Text>
          </View>

          {/* Cell 2: Burial/Cremation Permit */}
          <View style={styles.burialCremationCell}>
            <Text style={styles.burialCremationLabel}>
              24a. Burial/Cremation Permit
            </Text>
            <Text style={styles.burialCremationValue}>
              Number: {data.disposal?.burialPermit?.number || 'N/A'}
            </Text>
            <Text style={styles.burialCremationValue}>
              {[
                'Number: ',
                data.disposal?.burialPermit?.number || 'N/A',
                ', Date Issued: ',
                data.disposal?.burialPermit?.dateIssued || 'N/A',
              ].join('')}
            </Text>
          </View>

          {/* Cell 3: Transfer Permit */}
          <View style={styles.transferPermitCell}>
            <Text style={styles.transferPermitLabel}>24b. TRANSFER PERMIT</Text>
            <Text style={styles.transferPermitValue}>
              Number: {data.disposal?.transferPermit?.number || 'N/A'}
            </Text>
            <Text style={styles.transferPermitValue}>
              Date Issued:{' '}
              {formatDate(data.disposal?.transferPermit?.dateIssued) || 'N/A'}
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.fieldContainer222}>
            <Text style={styles.subtitle}>
              25. NAME AND ADDRESS OF CEMETERY:
            </Text>
            <Text style={styles.value12}>{data.cemeteryAddress || 'N/A'}</Text>
          </View>
        </View>

        <View>
          {/* First Row: Section 26 and 27 */}
          <View
            style={[
              styles.Last,
              { flexDirection: 'row', justifyContent: 'space-between' },
            ]}
          >
            {/* Section 26: Certification of Informant */}
            <View style={[styles.section12, { borderRight: '1px solid #000' }]}>
              <Text style={styles.certificationOfInformantTitle}>
                26. Certification of Informant
              </Text>
              <View style={styles.fieldContainer}>
                <Text style={styles.label12}>Signature:</Text>
                <Text style={styles.value12}>
                  {data.informant?.signature || 'N/A'}
                </Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label12}>Name:</Text>
                <Text style={styles.value12}>
                  {data.informant?.nameInPrint || 'N/A'}
                </Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label12}>Relationship to Deceased:</Text>
                <Text style={styles.value12}>
                  {data.informant?.relationshipToDeceased || 'N/A'}
                </Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label12}>Address:</Text>
                <Text style={styles.value12}>
                  {data.informant?.address || 'N/A'}
                </Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label12}>Date:</Text>
                <Text style={styles.value12}>
                  {data.informant?.date
                    ? formatDate(data.informant.date)
                    : 'N/A'}
                </Text>
              </View>
            </View>

            {/* Section 27: Prepared By */}
            <View style={[styles.section12]}>
              <Text style={styles.preparedByTitle}>27. Prepared By</Text>
              <View style={styles.fieldContainer12}>
                <Text style={styles.label12}>Signature:</Text>
                <Text style={styles.value12}>
                  {data?.preparedBy?.signature || 'N/A'}
                </Text>
              </View>
              <View style={styles.fieldContainer12}>
                <Text style={styles.label12}>Name:</Text>
                <Text style={styles.value12}>
                  {data?.preparedBy?.name || 'N/A'}
                </Text>
              </View>
              <View style={styles.fieldContainer12}>
                <Text style={styles.label12}>Title or Position:</Text>
                <Text style={styles.value12}>
                  {data?.preparedBy?.title || 'N/A'}
                </Text>
              </View>
              <View style={styles.fieldContainer12}>
                <Text style={styles.label12}>Date:</Text>
                <Text style={styles.value12}>
                  {data?.preparedBy?.date
                    ? formatDateTime(data.preparedBy.date, {
                        monthFormat: 'numeric',
                        dayFormat: 'numeric',
                        yearFormat: 'numeric',
                      })
                    : 'N/A'}
                </Text>
              </View>
            </View>
          </View>

          {/* Second Row: Section 28 and 29 */}
          <View
            style={[
              styles.Last,
              { flexDirection: 'row', justifyContent: 'space-between' },
            ]}
          >
            {/* Section 28: Received By */}
            <View style={[styles.section12, { borderRight: '1px solid #000' }]}>
              <Text style={styles.receivedByTitle}>28. RECIEVED BY</Text>
              <View style={styles.fieldContainer}>
                <Text style={styles.label12}>Signature:</Text>
                <Text style={styles.value12}>
                  {data.receivedBy?.signature || 'N/A'}
                </Text>
              </View>
              <View style={styles.fieldContainer12}>
                <Text style={styles.label12}>Name:</Text>
                <Text style={styles.value12}>
                  {data.receivedBy?.name || 'N/A'}
                </Text>
              </View>
              <View style={styles.fieldContainer12}>
                <Text style={styles.label12}>Title or Position:</Text>
                <Text style={styles.value12}>
                  {data.receivedBy?.title || 'N/A'}
                </Text>
              </View>
              <View style={styles.fieldContainer12}>
                <Text style={styles.label12}>Date:</Text>
                <Text style={styles.value12}>
                  {data.receivedBy?.date
                    ? formatDate(data.receivedBy.date)
                    : 'N/A'}
                </Text>
              </View>
            </View>

            {/* Section 29: Registered at Civil Registrar */}
            <View style={[styles.section12]}>
              <Text style={styles.registeredAtCivilRegistrarTitle}>
                29. REGISTERED AT CIVIL REGISTRAR
              </Text>
              <View style={styles.fieldContainer12}>
                <Text style={styles.label12}>Name:</Text>
                <Text style={styles.value12}>
                  {data.registeredAtCivilRegistrar?.name || 'N/A'}
                </Text>
              </View>
              <View style={styles.fieldContainer12}>
                <Text style={styles.label12}>Title or Position:</Text>
                <Text style={styles.value12}>
                  {data.registeredAtCivilRegistrar?.title || 'N/A'}
                </Text>
              </View>
              <View style={styles.fieldContainer12}>
                <Text style={styles.label12}>Date:</Text>
                <Text style={styles.value12}>
                  {data.registeredAtCivilRegistrar?.date
                    ? formatDate(data.registeredAtCivilRegistrar.date)
                    : 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'column',
            padding: 5,
            gap: 5,
            borderBottom: '1px solid #000',
            borderRight: '1px solid #000',
            borderLeft: '1px solid #000',
          }}
        >
          <Text
            style={{
              textTransform: 'uppercase',
              fontSize: '8px',
              fontWeight: 'bold',
            }}
          >
            REMARKS / ANNOTATIONS (FOR LCRO/OCRG USE ONLY)
          </Text>
          <Text style={styles.data1}>{data.remarks || 'N/A'}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default DeathCertificatePDF;
