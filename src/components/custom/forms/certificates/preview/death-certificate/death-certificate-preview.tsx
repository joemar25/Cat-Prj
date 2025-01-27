'use client';

import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import { formatDateTime } from '@/utils/date';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import React from 'react';
import { styles } from './style';
import { sty } from './stylish';

interface DeathCertificatePDFProps {
  data: Partial<DeathCertificateFormValues>;
}

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
                <Text style={sty.value}>{data.province || ''}</Text>
              </View>
              <View style={sty.fieldContainer}>
                <Text style={sty.label}>City/Municipality:</Text>
                <Text style={sty.value}>{data.cityMunicipality || ''}</Text>
              </View>
            </View>

            {/* Right Grid: Registry No. */}
            <View style={sty.rightGrid}>
              <View style={sty.registryNoContainer}>
                <Text style={sty.label}>Registry No.:</Text>
                <Text style={sty.value}>{data.registryNumber || ''}</Text>
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
            <Text style={styles.data1}>
              {data.personalInfo?.firstName || ''}
            </Text>
          </View>
          <View style={styles.fieldContainer3}>
            <Text style={styles.label}>(Middle):</Text>
            <Text style={styles.data1}>
              {data.personalInfo?.middleName || ''}
            </Text>
          </View>
          <View
            style={[styles.fieldContainer3, { borderRight: '1px solid #000' }]}
          >
            <Text style={styles.label}>(Last):</Text>
            <Text style={styles.data1}>
              {data.personalInfo?.lastName || ''}
            </Text>
          </View>

          <View style={styles.fieldContainer3}>
            <Text style={styles.label}>2. SEX:</Text>
            <Text style={styles.data1}>{data.personalInfo?.sex || ''}</Text>
          </View>
        </View>

        {/* Date of Death, Birth, and Age */}
        <View style={styles.DateOfDeath}>
          <View style={styles.fieldContainer4}>
            <Text style={styles.label}>3. DATE OF DEATH:</Text>
            <Text style={styles.data1}>
              {data.personalInfo?.dateOfDeath
                ? formatDateTime(data.personalInfo.dateOfDeath, {
                    monthFormat: 'numeric',
                    dayFormat: 'numeric',
                    yearFormat: 'numeric',
                    showTime: false, // No time needed for dates
                  })
                : ''}
            </Text>
          </View>
          <View style={styles.fieldContainer4}>
            <Text style={styles.label}>4. DATE OF BIRTH:</Text>
            <Text style={styles.data1}>
              {data.personalInfo?.dateOfBirth
                ? formatDateTime(data.personalInfo.dateOfBirth, {
                    monthFormat: 'numeric',
                    dayFormat: 'numeric',
                    yearFormat: 'numeric',
                    showTime: false, // No time needed for dates
                  })
                : ''}
            </Text>
          </View>
          <View style={styles.fieldContainer4}>
            <Text style={styles.label}>5. AGE AT THE TIME OF DEATH:</Text>
            <Text style={styles.data1}>
              {data.personalInfo?.ageAtDeath
                ? `${data.personalInfo.ageAtDeath.years || 0} yrs, ${
                    data.personalInfo.ageAtDeath.months || 0
                  } mos, ${data.personalInfo.ageAtDeath.days || 0} d, ${
                    data.personalInfo.ageAtDeath.hours || 0
                  } hrs`
                : ''}
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
              <Text style={styles.data1}>
                {data.personalInfo?.placeOfDeath
                  ? `${data.personalInfo.placeOfDeath.specificAddress || ''}, ${
                      data.personalInfo.placeOfDeath.cityMunicipality || ''
                    }, ${data.personalInfo.placeOfDeath.province || ''}`
                  : ''}
              </Text>
            </View>
          </View>
          <View style={styles.CivilStatus}>
            <Text style={styles.label}>7. CIVIL STATUS:</Text>
            <Text style={styles.data1}>
              {data.personalInfo?.civilStatus || ''}
            </Text>
          </View>
        </View>

        {/* Religion, Citizenship, and Residence */}
        <View style={styles.fieldContainer6}>
          <View style={styles.religion}>
            <Text style={styles.label}>8. RELIGION:</Text>
            <Text style={styles.data1}>
              {data.personalInfo?.religion || ''}
            </Text>
          </View>
          <View style={styles.citizenship}>
            <Text style={styles.label}>9. CITIZENSHIP:</Text>
            <Text style={styles.data1}>
              {data.personalInfo?.citizenship || ''}
            </Text>
          </View>
          <View style={styles.residence}>
            <Text style={styles.label}>10. RESIDENCE:</Text>
            <Text style={styles.data1}>
              {data.personalInfo?.residence?.address || ''}
            </Text>
          </View>
        </View>

        {/* Family Information */}
        <View style={styles.section2}>
          <View style={styles.occupation}>
            <Text style={styles.label}>11. OCCUPATION:</Text>
            <Text style={styles.data1}>
              {data.personalInfo?.occupation || ''}
            </Text>
          </View>
          <View style={styles.fieldContainer7}>
            <View style={styles.fatherName}>
              <Text style={styles.label}>12. NAME OF FATHER</Text>
              <Text style={styles.label1}>(First, Middle, Last)</Text>
            </View>
            <Text style={styles.data1}>
              {data.familyInfo?.father
                ? `${data.familyInfo.father.firstName} ${
                    data.familyInfo.father.middleName || ''
                  } ${data.familyInfo.father.lastName}`
                : ''}
            </Text>
          </View>
          <View style={styles.fieldContainer8}>
            <View style={styles.motherMaidenName}>
              <Text style={styles.label}>13. MOTHER MAIDEN NAME</Text>
              <Text style={styles.label1}>(First, Middle, Last)</Text>
            </View>
            <Text style={styles.data1}>
              {data.familyInfo?.mother
                ? `${data.familyInfo.mother.firstName} ${
                    data.familyInfo.mother.middleName || ''
                  } ${data.familyInfo.mother.lastName}`
                : ''}
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
                      {data.medicalCertificate?.causesOfDeath?.immediate || ''}
                    </Text>
                    <Text style={styles.data2}>
                      {data.medicalCertificate?.causesOfDeath?.antecedent || ''}
                    </Text>
                    <Text style={styles.data2}>
                      {data.medicalCertificate?.causesOfDeath?.underlying || ''}
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
                  <Text style={styles.data3}>
                    {data.medicalCertificate?.causesOfDeath
                      ?.contributingConditions || ''}
                  </Text>
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
            {data.medicalCertificate?.maternalCondition || ''}
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
                {data.medicalCertificate?.externalCauses?.mannerOfDeath || ''}
              </Text>
            </View>

            {/* Place of Occurrence */}
            <View style={styles.deathExternalCausesFieldContainer}>
              <Text style={styles.deathExternalCausesLabel}>
                Place of Occurrence:
              </Text>
              <Text style={styles.deathExternalCausesValue}>
                {data.medicalCertificate?.externalCauses?.placeOfOccurrence ||
                  ''}
              </Text>
            </View>
          </View>

          {/* Section 20: Autopsy */}
          <View style={styles.section20Container}>
            <Text style={styles.autopsyTitle}>20. Autopsy (yes/no)</Text>
            <Text style={styles.autopsyValue}>{''}</Text>
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
                  {data.attendant?.type || ''}
                </Text>
              </View>
              <View style={styles.attendantFieldContainer}>
                <Text style={styles.attendantLabel2}>Duration:</Text>
                <Text style={styles.attendantValue}>
                  {data.attendant?.attendance?.from &&
                  data.attendant?.attendance?.to
                    ? `From: ${formatDateTime(
                        data.attendant.attendance.from
                      )} To: ${formatDateTime(data.attendant.attendance.to)}`
                    : ''}
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
                {data.attendant?.attendance?.from
                  ? formatDateTime(data.attendant.attendance.from)
                  : ''}
              </Text>
              <Text style={styles.attendantValue}>
                To:{' '}
                {data.attendant?.attendance?.to
                  ? formatDateTime(data.attendant.attendance.to)
                  : ''}
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
            <Text style={styles.attendedLabel}>Certification Date:</Text>
            <Text style={styles.attendedValue}>
              {data.certification?.date
                ? formatDateTime(data.certification.date, {
                    monthFormat: 'numeric',
                    dayFormat: 'numeric',
                    yearFormat: 'numeric',
                    showTime: true,
                    hourFormat: 'numeric',
                    minuteFormat: '2-digit',
                  })
                : ''}
            </Text>
          </View>

          {/* Name */}
          <View style={styles.fieldContainer11}>
            <Text style={styles.nameLabel}>Name:</Text>
            <Text style={styles.nameValue}>
              {data.certification?.name || ''}
            </Text>
          </View>

          {/* Title/Position */}
          <View style={styles.fieldContainer11}>
            <Text style={styles.titleLabel}>Title/Position:</Text>
            <Text style={styles.titleValue}>
              {data.certification?.title || ''}
            </Text>
          </View>
        </View>

        {/* Disposal Information */}
        <View style={styles.gridContainer22}>
          {/* Cell 1: Corpse Disposal */}
          <View style={styles.corpseDisposalCell}>
            <Text style={styles.corpseDisposalLabel}>23. CORPSE DISPOSAL</Text>
            <Text style={styles.corpseDisposalValue}>
              {data.disposal?.method || ''}
            </Text>
          </View>

          {/* Cell 2: Burial/Cremation Permit */}
          <View style={styles.burialCremationCell}>
            <Text style={styles.burialCremationLabel}>
              24a. Burial/Cremation Permit
            </Text>
            <Text style={styles.burialCremationValue}>
              Number: {data.disposal?.burialPermit?.number || ''}
            </Text>
            <Text style={styles.burialCremationValue}>
              Date Issued:{' '}
              {data.disposal?.burialPermit?.dateIssued
                ? formatDateTime(data.disposal.burialPermit.dateIssued, {
                    monthFormat: 'numeric',
                    dayFormat: 'numeric',
                    yearFormat: 'numeric',
                  })
                : ''}
            </Text>
          </View>

          {/* Cell 3: Transfer Permit */}
          <View style={styles.transferPermitCell}>
            <Text style={styles.transferPermitLabel}>24b. TRANSFER PERMIT</Text>
            <Text style={styles.transferPermitValue}>
              Number: {data.disposal?.transferPermit?.number || ''}
            </Text>
            <Text style={styles.transferPermitValue}>
              Date Issued:{' '}
              {data.disposal?.transferPermit?.dateIssued
                ? formatDateTime(data.disposal.transferPermit.dateIssued, {
                    monthFormat: 'numeric',
                    dayFormat: 'numeric',
                    yearFormat: 'numeric',
                  })
                : ''}
            </Text>
          </View>
        </View>

        {/* Cemetery name and address */}
        <View style={styles.section}>
          <View style={styles.fieldContainer222}>
            <Text style={styles.subtitle}>
              25. NAME AND ADDRESS OF CEMETERY:
            </Text>
            <Text style={styles.value12}>
              {data.disposal?.cemeteryAddress || ''}
            </Text>
          </View>
        </View>

        <View>
          {/* First Row: Sections 26 (Informant) and 27 (Prepared By) */}
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
                  {data.informant?.signature || ''}
                </Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label12}>Name:</Text>
                <Text style={styles.value12}>{data.informant?.name || ''}</Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label12}>Relationship to Deceased:</Text>
                <Text style={styles.value12}>
                  {data.informant?.relationship || ''}
                </Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label12}>Address:</Text>
                <Text style={styles.value12}>
                  {data.informant?.address?.address || ''}
                </Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label12}>City/Municipality:</Text>
                <Text style={styles.value12}>
                  {data.informant?.address?.cityMunicipality || ''}
                </Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label12}>Province:</Text>
                <Text style={styles.value12}>
                  {data.informant?.address?.province || ''}
                </Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label12}>Country:</Text>
                <Text style={styles.value12}>
                  {data.informant?.address?.country || ''}
                </Text>
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label12}>Date:</Text>
                <Text style={styles.value12}>
                  {data.informant?.date
                    ? formatDateTime(data.informant.date, {
                        monthFormat: 'numeric',
                        dayFormat: 'numeric',
                        yearFormat: 'numeric',
                      })
                    : ''}
                </Text>
              </View>
            </View>

            {/* Section 27: Prepared By */}
            <View style={styles.section12}>
              <Text style={styles.preparedByTitle}>27. Prepared By</Text>
              <View style={styles.fieldContainer12}>
                <Text style={styles.label12}>Signature:</Text>
                <Text style={styles.value12}>
                  {data.preparedBy?.signature || ''}
                </Text>
              </View>
              <View style={styles.fieldContainer12}>
                <Text style={styles.label12}>Name:</Text>
                <Text style={styles.value12}>
                  {data.preparedBy?.name || ''}
                </Text>
              </View>
              <View style={styles.fieldContainer12}>
                <Text style={styles.label12}>Title or Position:</Text>
                <Text style={styles.value12}>
                  {data.preparedBy?.title || ''}
                </Text>
              </View>
              <View style={styles.fieldContainer12}>
                <Text style={styles.label12}>Date:</Text>
                <Text style={styles.value12}>
                  {data.preparedBy?.date
                    ? formatDateTime(data.preparedBy.date, {
                        monthFormat: 'numeric',
                        dayFormat: 'numeric',
                        yearFormat: 'numeric',
                      })
                    : ''}
                </Text>
              </View>
            </View>
          </View>

          {/* Second Row: Sections 28 (Received By) and 29 (Registered at Civil Registrar) */}
          <View
            style={[
              styles.Last,
              { flexDirection: 'row', justifyContent: 'space-between' },
            ]}
          >
            {/* Section 28: Received By */}
            <View style={[styles.section12, { borderRight: '1px solid #000' }]}>
              <Text style={styles.receivedByTitle}>28. RECEIVED BY</Text>
              <View style={styles.fieldContainer}>
                <Text style={styles.label12}>Signature:</Text>
                <Text style={styles.value12}>
                  {data.receivedBy?.signature || ''}
                </Text>
              </View>
              <View style={styles.fieldContainer12}>
                <Text style={styles.label12}>Name:</Text>
                <Text style={styles.value12}>
                  {data.receivedBy?.name || ''}
                </Text>
              </View>
              <View style={styles.fieldContainer12}>
                <Text style={styles.label12}>Title or Position:</Text>
                <Text style={styles.value12}>
                  {data.receivedBy?.title || ''}
                </Text>
              </View>
              <View style={styles.fieldContainer12}>
                <Text style={styles.label12}>Date:</Text>
                <Text style={styles.value12}>
                  {data.receivedBy?.date
                    ? formatDateTime(data.receivedBy.date, {
                        monthFormat: 'numeric',
                        dayFormat: 'numeric',
                        yearFormat: 'numeric',
                      })
                    : ''}
                </Text>
              </View>
            </View>

            {/* Section 29: Registered at Civil Registrar */}
            <View style={styles.section12}>
              <Text style={styles.registeredAtCivilRegistrarTitle}>
                29. REGISTERED AT CIVIL REGISTRAR
              </Text>
              <View style={styles.fieldContainer12}>
                <Text style={styles.label12}>Name:</Text>
                <Text style={styles.value12}>
                  {data.registeredAtCivilRegistrar?.name || ''}
                </Text>
              </View>
              <View style={styles.fieldContainer12}>
                <Text style={styles.label12}>Title or Position:</Text>
                <Text style={styles.value12}>
                  {data.registeredAtCivilRegistrar?.title || ''}
                </Text>
              </View>
              <View style={styles.fieldContainer12}>
                <Text style={styles.label12}>Date:</Text>
                <Text style={styles.value12}>
                  {data.registeredAtCivilRegistrar?.date
                    ? formatDateTime(data.registeredAtCivilRegistrar.date, {
                        monthFormat: 'numeric',
                        dayFormat: 'numeric',
                        yearFormat: 'numeric',
                      })
                    : ''}
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
          {/* Remarks Section */}
          <Text style={styles.data1}>{data.remarks || ''}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default DeathCertificatePDF;
