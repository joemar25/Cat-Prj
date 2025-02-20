'use client';

import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import { formatDateTime } from '@/utils/date';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { style } from './styles';

interface DeathCertificatePDFProps {
  data: Partial<DeathCertificateFormValues>;
}

const DeathCertificatePDF: React.FC<DeathCertificatePDFProps> = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <Document>
        <Page size='LEGAL' style={style.page}>
          <View>
            <Text>No data available for preview.</Text>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      {/* Back Page */}
      <Page size='LEGAL' style={[style.page, style.flexColumn, { gap: 10 }]}>
        <View style={style.gridColumn}>
          <View style={style.gridColumn}>
            <Text
              style={[
                style.headerTitle,
                style.paddingGlobal,
                { textAlign: 'center' },
              ]}
            >
              For children aged 0 to 7 days
            </Text>
          </View>
          <View style={style.flexRow}>
            <View
              style={[
                style.gridColumn,
                style.paddingGlobal,
                style.flex1,
                { gap: 5 },
              ]}
            >
              <Text style={style.label}>14. AGE OF MOTHER</Text>
              <Text style={style.value}>
                {data.birthInformation?.ageOfMother || ''}
              </Text>
            </View>
            <View
              style={[
                style.gridColumn,
                style.paddingGlobal,
                { flex: 2, gap: 5 },
              ]}
            >
              <Text style={style.label}>15. METHOD OF DELIVERY</Text>
              <Text style={style.label2}>(If others, specify)</Text>
              <Text style={style.value}>
                {data.birthInformation?.methodOfDelivery || ''}
              </Text>
            </View>
            <View
              style={[
                style.gridColumn,
                style.paddingGlobal,
                { flex: 2, gap: 5 },
              ]}
            >
              <Text style={style.label}>16. LENGTH OF PREGNANCY</Text>
              <Text style={style.label2}>(in completed weeks)</Text>
              <Text style={style.value}>
                {data.birthInformation?.lengthOfPregnancy !== undefined
                  ? `${data.birthInformation.lengthOfPregnancy} weeks`
                  : ''}
              </Text>
            </View>
          </View>
          <View style={style.flexRow}>
            <View
              style={[
                style.gridColumn,
                style.paddingGlobal,
                style.flex1,
                { gap: 5 },
              ]}
            >
              <Text style={style.label}>17. TYPE OF BIRTH</Text>
              <Text style={style.value}>
                {data.birthInformation?.typeOfBirth || ''}
              </Text>
            </View>
            <View
              style={[
                style.gridColumn,
                style.paddingGlobal,
                style.flex1,
                { gap: 5 },
              ]}
            >
              <Text style={style.label}>18. IF MULTIPLE BIRTH, CHILD WAS</Text>
              <Text style={style.label2}>(1st, 2nd, 3rd, etc.)</Text>
              <Text style={style.value}>
                {data.birthInformation?.birthOrder || 'N/A'}
              </Text>
            </View>
          </View>
          <View style={style.gridColumn}>
            <Text
              style={[
                style.headerTitle,
                style.paddingGlobal,
                { textAlign: 'center' },
              ]}
            >
              MEDICAL CERTIFICATE
            </Text>
          </View>
          <View style={[style.gridColumn, style.paddingGlobal, { gap: 5 }]}>
            <Text style={style.label}>19a. CAUSES OF DEATH</Text>
            <View style={[style.flexColumn, style.paddingLeft]}>
              {/* For infant deaths, these fields should be set accordingly */}
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { marginRight: 15 }]}>
                  a. Main disease/condition of infant
                </Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>
                    {data.medicalCertificate?.causesOfDeath &&
                    'mainDiseaseOfInfant' in
                      data.medicalCertificate.causesOfDeath
                      ? data.medicalCertificate.causesOfDeath
                          .mainDiseaseOfInfant
                      : 'N/A'}
                  </Text>
                </View>
              </View>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { marginRight: 15 }]}>
                  b. Other diseases/conditions of infant
                </Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>
                    {data.medicalCertificate?.causesOfDeath &&
                    'mainDiseaseOfInfant' in
                      data.medicalCertificate.causesOfDeath
                      ? data.medicalCertificate.causesOfDeath
                          .otherDiseasesOfInfant || 'N/A'
                      : 'N/A'}
                  </Text>
                </View>
              </View>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { marginRight: 15 }]}>
                  c. Main maternal disease/condition affecting infant
                </Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>
                    {data.medicalCertificate?.causesOfDeath &&
                    'mainDiseaseOfInfant' in
                      data.medicalCertificate.causesOfDeath
                      ? data.medicalCertificate.causesOfDeath
                          .mainMaternalDisease || 'N/A'
                      : 'N/A'}
                  </Text>
                </View>
              </View>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { marginRight: 15 }]}>
                  d. Other maternal diseases/conditions affecting infant
                </Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>
                    {data.medicalCertificate?.causesOfDeath &&
                    'mainDiseaseOfInfant' in
                      data.medicalCertificate.causesOfDeath
                      ? data.medicalCertificate.causesOfDeath
                          .otherMaternalDisease || 'N/A'
                      : 'N/A'}
                  </Text>
                </View>
              </View>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { marginRight: 15 }]}>
                  e. Other relevant circumstances
                </Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>
                    {data.medicalCertificate?.causesOfDeath &&
                    'mainDiseaseOfInfant' in
                      data.medicalCertificate.causesOfDeath
                      ? data.medicalCertificate.causesOfDeath
                          .otherRelevantCircumstances || 'N/A'
                      : 'N/A'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View
          style={[
            style.gridColumn,
            style.paddingGlobal,
            { border: '2px solid #000' },
          ]}
        >
          <Text style={[style.headerTitle, { textAlign: 'center' }]}>
            Postmortem Certificate of Death
          </Text>
          <Text style={style.valueCenter}>
            I HEREBY CERTIFY that I have performed an autopsy upon the body of
            the deceased and that the cause of death was
          </Text>
          <Text style={style.valueLine}>
            {data.postmortemCertificate?.causeOfDeath || ''}
          </Text>
          <View style={[style.flexRow, { paddingTop: 20, gap: 20 }]}>
            {/* Left Column */}
            <View style={[style.flexColumn, style.flex1]}>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { width: 80 }]}>Signature</Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>
                    {data.postmortemCertificate?.signature || ''}
                  </Text>
                </View>
              </View>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { width: 80 }]}>Name in Print</Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>
                    {data.postmortemCertificate?.nameInPrint || ''}
                  </Text>
                </View>
              </View>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { width: 80 }]}>Date</Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>
                    {data.postmortemCertificate?.date
                      ? formatDateTime(data.postmortemCertificate.date, {
                          monthFormat: 'numeric',
                          dayFormat: 'numeric',
                          yearFormat: 'numeric',
                        })
                      : ''}
                  </Text>
                </View>
              </View>
            </View>
            {/* Right Column */}
            <View style={[style.flexColumn, style.flex1]}>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { width: 100 }]}>
                  Title/Designation
                </Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>
                    {data.postmortemCertificate?.titleDesignation || ''}
                  </Text>
                </View>
              </View>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { width: 100 }]}>Address</Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>
                    {data.postmortemCertificate?.address || ''}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View
          style={[
            style.gridColumn,
            style.paddingGlobal,
            { border: '2px solid #000' },
          ]}
        >
          <Text style={[style.headerTitle, { textAlign: 'center' }]}>
            Certification of Embalmer
          </Text>
          <View style={style.flexColumn}>
            <View style={[style.flexRow, { paddingLeft: 20, gap: 5 }]}>
              <Text style={style.valueCenter}>
                I HEREBY CERTIFY that I have embalmed{' '}
              </Text>
              <View style={style.flex1}>
                <Text style={style.valueLine}>
                  {data.embalmerCertification?.nameOfDeceased || ''}
                </Text>
              </View>
              <Text style={style.valueCenter}>
                {' '}
                in accordance with regulations.
              </Text>
            </View>
          </View>
          <View style={[style.flexRow, { paddingTop: 10, gap: 20 }]}>
            {/* Left Column */}
            <View style={[style.flexColumn, { flex: 1 }]}>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { width: 80 }]}>Signature</Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>
                    {data.embalmerCertification?.signature || ''}
                  </Text>
                </View>
              </View>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { width: 80 }]}>Name in Print</Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>
                    {data.embalmerCertification?.nameInPrint || ''}
                  </Text>
                </View>
              </View>
            </View>
            {/* Right Column */}
            <View style={[style.flexColumn, { flex: 1 }]}>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { width: 100 }]}>License No.</Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>
                    {data.embalmerCertification?.licenseNo || ''}
                  </Text>
                </View>
              </View>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { width: 100 }]}>Issued on</Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>
                    {data.embalmerCertification?.issuedOn || ''}
                  </Text>
                </View>
              </View>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { width: 100 }]}>Expiry Date</Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>
                    {data.embalmerCertification?.expiryDate || ''}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View
          style={[
            style.gridColumn,
            style.paddingGlobal,
            { border: '2px solid #000' },
          ]}
        >
          <Text style={[style.headerTitle, { textAlign: 'center' }]}>
            Affidavit for Delayed Registration of Death
          </Text>
          {/* Affidavit Content */}
          <View style={[style.flexColumn, { gap: 2 }]}>
            <View
              style={[
                style.flexRow,
                { paddingLeft: 20, gap: 5, alignItems: 'flex-end' },
              ]}
            >
              <Text style={style.valueCenter}>I, </Text>
              <View style={style.flex1}>
                <Text style={style.valueLine}>
                  {data.delayedRegistration?.affiant?.name || ''}
                </Text>
              </View>
              <Text style={style.valueCenter}>
                , of legal age,{' '}
                {data.delayedRegistration?.affiant?.civilStatus || ''}, with
                residence at{' '}
              </Text>
            </View>
            <View style={[style.flexRow, { gap: 5, alignItems: 'flex-end' }]}>
              <Text style={style.valueCenter}>address: </Text>
              <View style={style.flex1}>
                <Text style={style.valueLine}>
                  {data.delayedRegistration?.affiant?.residenceAddress || ''}
                </Text>
              </View>
            </View>
            <View
              style={[
                style.flexRow,
                { paddingLeft: 20, gap: 5, alignItems: 'flex-end' },
              ]}
            >
              <Text style={style.valueCenter}>
                I hereby declare that the delay in registering the death was due
                to:{' '}
              </Text>
              <View style={style.flex1}>
                <Text style={style.valueLine}>
                  {data.delayedRegistration?.reasonForDelay || ''}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={[
              style.flexColumn,
              { gap: 2, paddingTop: 15, alignItems: 'flex-end' },
            ]}
          >
            <View style={[style.flexColumn, { gap: 5, alignItems: 'center' }]}>
              <View style={{ width: 250 }}>
                <Text style={{ fontSize: 10, textAlign: 'center' }}> </Text>
                <View
                  style={{ borderBottom: '1px solid black', marginTop: 2 }}
                />
              </View>
              <Text style={style.label2}>
                (Signature Over Printed Name of Affiant)
              </Text>
            </View>
          </View>
        </View>
      </Page>

      {/* Front Page */}
      <Page size='LEGAL' style={style.page}>
        {/* Header */}
        <View style={style.header}>
          <View style={style.municipal}>
            <Text>Municipal Form No. 103</Text>
            <Text style={style.headerNote1}>Revised August 2016</Text>
          </View>
          <View style={style.republic}>
            <Text style={style.headerSubtitle}>
              Republic of the Philippines
            </Text>
            <Text style={style.headerSubtitle}>
              OFFICE OF THE CIVIL REGISTRAR GENERAL
            </Text>
            <Text style={style.headerTitle}>CERTIFICATE OF DEATH</Text>
          </View>
          <View>
            <Text style={style.headerNote2}>
              (To be accomplished in quadruplicate using black ink)
            </Text>
          </View>
        </View>

        {/* Registry Information */}
        <View>
          <View style={style.gridContainer}>
            {/* Left Grid: Province and City/Municipality */}
            <View style={[style.flexColumn, { flex: 2 }]}>
              <View
                style={[
                  style.flexRow,
                  style.paddingGlobal,
                  { borderBottom: '1px solid #000' },
                ]}
              >
                <Text style={style.label}>Province:</Text>
                <Text style={style.valueCenter}>{data.province || ''}</Text>
              </View>
              <View style={[style.flexRow, style.paddingGlobal]}>
                <Text style={style.label}>City/Municipality:</Text>
                <Text style={[style.valueCenter, { width: '100%' }]}>
                  {data.cityMunicipality || ''}
                </Text>
              </View>
            </View>
            {/* Right Grid: Registry No. */}
            <View
              style={[
                style.flexColumn,
                { flex: 1, padding: 10, borderLeft: '1px solid #000' },
              ]}
            >
              <View style={style.flexColumn}>
                <Text style={style.label}>Registry No.:</Text>
                <Text style={style.valueCenter}>
                  {data.registryNumber || ''}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Personal Information */}
        <View style={style.gridContainer}>
          <View style={style.fieldContainer}>
            <Text style={style.label}>1. NAME</Text>
          </View>
          <View style={style.fieldContainer}>
            <Text style={style.label}>(First):</Text>
            <Text style={style.value}>{data.name?.first || ''}</Text>
          </View>
          <View style={style.fieldContainer}>
            <Text style={style.label}>(Middle):</Text>
            <Text style={style.value}>{data.name?.middle || ''}</Text>
          </View>
          <View
            style={[style.fieldContainer, { borderRight: '1px solid #000' }]}
          >
            <Text style={style.label}>(Last):</Text>
            <Text style={style.value}>{data.name?.last || ''}</Text>
          </View>
          <View style={style.fieldContainer}>
            <Text style={style.label}>2. SEX:</Text>
            <Text style={style.value}>{data.sex || ''}</Text>
          </View>
        </View>

        {/* Dates and Age */}
        <View style={style.gridContainer}>
          <View style={style.fieldContainer2}>
            <Text style={style.label}>3. DATE OF DEATH:</Text>
            <Text style={style.value}>
              {data.dateOfDeath
                ? formatDateTime(data.dateOfDeath, {
                    monthFormat: 'numeric',
                    dayFormat: 'numeric',
                    yearFormat: 'numeric',
                    showTime: false,
                  })
                : ''}
            </Text>
          </View>
          <View style={style.fieldContainer2}>
            <Text style={style.label}>4. DATE OF BIRTH:</Text>
            <Text style={style.value}>
              {data.dateOfBirth
                ? formatDateTime(data.dateOfBirth, {
                    monthFormat: 'numeric',
                    dayFormat: 'numeric',
                    yearFormat: 'numeric',
                    showTime: false,
                  })
                : ''}
            </Text>
          </View>
          <View style={style.fieldContainer2}>
            <Text style={style.label}>5. AGE AT THE TIME OF DEATH:</Text>
            <Text style={style.value}>
              {data.ageAtDeath
                ? `${data.ageAtDeath.years || 0} yrs, ${
                    data.ageAtDeath.months || 0
                  } mos, ${data.ageAtDeath.days || 0} d, ${
                    data.ageAtDeath.hours || 0
                  } hrs`
                : ''}
            </Text>
          </View>
        </View>

        {/* Place of Death and Civil Status */}
        <View style={style.gridContainer}>
          <View style={[style.fieldContainer2, { flex: 0.2 }]}>
            <Text style={style.label}>6. PLACE OF DEATH:</Text>
          </View>
          <View style={[style.fieldContainer2, style.flex1]}>
            <Text style={style.label}>(Complete address)</Text>
            <Text style={style.value}>
              {data.placeOfDeath
                ? `${data.placeOfDeath.houseNo}, ${data.placeOfDeath.st}, ${data.placeOfDeath.barangay}, ${data.placeOfDeath.cityMunicipality}, ${data.placeOfDeath.province}`
                : ''}
            </Text>
          </View>
          <View style={[style.fieldContainer2, { flex: 0.2 }]}>
            <Text style={style.label}>7. CIVIL STATUS:</Text>
            <Text style={style.value}>{data.civilStatus || ''}</Text>
          </View>
        </View>

        {/* Religion, Citizenship, Residence */}
        <View style={style.gridContainer}>
          <View style={style.fieldContainer2}>
            <Text style={style.label}>8. RELIGION:</Text>
            <Text style={style.value}>{data.religion || ''}</Text>
          </View>
          <View style={style.fieldContainer2}>
            <Text style={style.label}>9. CITIZENSHIP:</Text>
            <Text style={style.value}>{data.citizenship || ''}</Text>
          </View>
          <View style={style.fieldContainer2}>
            <Text style={style.label}>10. RESIDENCE:</Text>
            <Text style={style.value}>
              {data.residence ? data.residence.country : ''}
            </Text>
          </View>
        </View>

        {/* Occupation and Parent Information */}
        <View style={style.gridContainer}>
          <View style={[style.fieldContainer2, { flex: 0.7 }]}>
            <Text style={style.label}>11. OCCUPATION:</Text>
            <Text style={style.value}>{data.occupation || ''}</Text>
          </View>
          <View style={[style.fieldContainer2, { flex: 1.5 }]}>
            <View style={style.flexRow}>
              <Text style={style.label}>
                12. NAME OF FATHER (First, Middle, Last):
              </Text>
            </View>
            <Text style={style.value}>
              {data.parents?.fatherName
                ? `${data.parents.fatherName.first} ${
                    data.parents.fatherName.middle || ''
                  } ${data.parents.fatherName.last}`
                : ''}
            </Text>
          </View>
          <View style={[style.fieldContainer2, { flex: 1.5 }]}>
            <View style={style.flexRow}>
              <Text style={style.label}>
                13. MOTHER MAIDEN NAME (First, Middle, Last):
              </Text>
            </View>
            <Text style={style.value}>
              {data.parents?.motherName
                ? `${data.parents.motherName.first} ${
                    data.parents.motherName.middle || ''
                  } ${data.parents.motherName.last}`
                : ''}
            </Text>
          </View>
        </View>

        {/* Medical Certificate Section */}
        <View style={{ width: '100%' }}>
          <View
            style={[
              style.gridColumn,
              style.paddingGlobal,
              { textAlign: 'center' },
            ]}
          >
            <Text style={style.value}>MEDICAL CERTIFICATE</Text>
            <Text style={style.label}>(For deaths aged 8 days and over)</Text>
          </View>
          <View style={style.gridColumn}>
            <View style={[style.flexRow]}>
              <View style={[style.fieldContainer, { flex: 2 }]}>
                <Text style={style.label}>19b. CAUSES OF DEATH:</Text>
              </View>
              <View style={[style.fieldContainer, { flex: 1 }]}>
                <Text style={style.label}>Interval:</Text>
              </View>
            </View>
            <View
              style={[style.flexRow, { width: '100%', gap: 10, padding: 5 }]}
            >
              <View style={[style.flex1]}>
                <Text style={style.label}>I. Immediate Cause:</Text>
                <Text style={style.label}>Antecedent Cause:</Text>
                <Text style={style.label}>Underlying Cause:</Text>
              </View>
              <View style={[style.flex1]}>
                <Text style={style.valueLine}>
                  {data.medicalCertificate?.causesOfDeath &&
                  'immediate' in data.medicalCertificate.causesOfDeath
                    ? data.medicalCertificate.causesOfDeath.immediate.cause
                    : ''}
                </Text>
                <Text style={style.valueLine}>
                  {data.medicalCertificate?.causesOfDeath &&
                  'antecedent' in data.medicalCertificate.causesOfDeath
                    ? data.medicalCertificate.causesOfDeath.antecedent.cause
                    : ''}
                </Text>
                <Text style={style.valueLine}>
                  {data.medicalCertificate?.causesOfDeath &&
                  'underlying' in data.medicalCertificate.causesOfDeath
                    ? data.medicalCertificate.causesOfDeath.underlying.cause
                    : ''}
                </Text>
              </View>
              <View style={[style.flex1]}>
                <Text style={style.valueLine}>
                  {data.medicalCertificate?.causesOfDeath &&
                  'immediate' in data.medicalCertificate.causesOfDeath
                    ? data.medicalCertificate.causesOfDeath.immediate.interval
                    : ''}
                </Text>
                <Text style={style.valueLine}>
                  {data.medicalCertificate?.causesOfDeath &&
                  'antecedent' in data.medicalCertificate.causesOfDeath
                    ? data.medicalCertificate.causesOfDeath.antecedent.interval
                    : ''}
                </Text>
                <Text style={style.valueLine}>
                  {data.medicalCertificate?.causesOfDeath &&
                  'underlying' in data.medicalCertificate.causesOfDeath
                    ? data.medicalCertificate.causesOfDeath.underlying.interval
                    : ''}
                </Text>
              </View>
            </View>
            <View style={[style.flexRow, { padding: 5, gap: 10 }]}>
              <Text style={style.label}>
                II. Other significant conditions contributing to death:
              </Text>
              <Text style={style.valueCenter}>
                {data.medicalCertificate?.causesOfDeath &&
                'otherSignificantConditions' in
                  data.medicalCertificate.causesOfDeath
                  ? data.medicalCertificate.causesOfDeath
                      .otherSignificantConditions
                  : ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Maternal Condition */}
        <View
          style={[style.gridContainer, style.fieldContainer, { width: '100%' }]}
        >
          <Text style={style.label}>19c. Maternal Condition:</Text>
          <Text style={style.value}>
            {data.medicalCertificate?.maternalCondition
              ? JSON.stringify(data.medicalCertificate.maternalCondition)
              : ''}
          </Text>
        </View>

        {/* External Causes and Autopsy */}
        <View style={style.gridContainer}>
          <View
            style={[
              style.gridColumn,
              { width: '100%', flex: 3, borderBottom: 'none' },
            ]}
          >
            <View style={[style.flexRow, style.paddingGlobal]}>
              <Text style={style.label}>19d. DEATH BY EXTERNAL CAUSES</Text>
            </View>
            <View
              style={[
                style.flexRow,
                style.paddingGlobal,
                {
                  borderBottom: '1px solid black',
                  borderTop: '1px solid black',
                },
              ]}
            >
              <Text style={style.label}>Manner of Death:</Text>
              <Text style={[style.valueCenter, { width: '100%' }]}>
                {data.medicalCertificate?.externalCauses?.mannerOfDeath || ''}
              </Text>
            </View>
            <View style={[style.flexRow, style.paddingGlobal]}>
              <Text style={style.label}>Place of Occurrence:</Text>
              <Text style={[style.valueCenter, { width: '100%' }]}>
                {data.medicalCertificate?.externalCauses?.placeOfOccurrence ||
                  ''}
              </Text>
            </View>
          </View>
          <View style={[style.paddingGlobal, { flex: 1 }]}>
            <Text style={style.label}>20. Autopsy (yes/no)</Text>
            <Text style={style.valueCenter}>
              {data.medicalCertificate?.autopsy ? 'Yes' : 'No'}
            </Text>
          </View>
        </View>

        {/* Attendant Information */}
        <View style={style.flexRow}>
          <View style={[style.gridColumn, { flex: 1.2 }]}>
            <Text style={[style.label, style.fieldContainer]}>
              21a. ATTENDANT INFORMATION
            </Text>
            <View style={[style.flexRow, style.paddingGlobal]}>
              <View>
                <Text style={style.label}>TYPE:</Text>
                <Text style={style.label}>FROM:</Text>
                <Text style={style.label}>TO:</Text>
              </View>
              <View>
                <Text style={style.valueCenter}>
                  {data.medicalCertificate?.attendant?.type || ''}
                </Text>
                <Text style={style.valueCenter}>
                  {data.medicalCertificate?.attendant?.duration?.from
                    ? formatDateTime(
                        data.medicalCertificate.attendant.duration.from
                      )
                    : ''}
                </Text>
                <Text style={style.valueCenter}>
                  {data.medicalCertificate?.attendant?.duration?.to
                    ? formatDateTime(
                        data.medicalCertificate.attendant.duration.to
                      )
                    : ''}
                </Text>
              </View>
            </View>
          </View>
          <View style={[style.gridColumn, { flex: 1 }]}>
            <Text style={[style.label, style.paddingGlobal]}>
              21b. If attended, state duration
            </Text>
            <View style={[style.flexRow, style.paddingGlobal]}>
              <View>
                <Text style={style.label}>FROM:</Text>
                <Text style={style.label}>TO:</Text>
              </View>
              <View>
                <Text style={style.valueCenter}>
                  {data.medicalCertificate?.attendant?.duration?.from
                    ? formatDateTime(
                        data.medicalCertificate.attendant.duration.from
                      )
                    : ''}
                </Text>
                <Text style={style.valueCenter}>
                  {data.medicalCertificate?.attendant?.duration?.to
                    ? formatDateTime(
                        data.medicalCertificate.attendant.duration.to
                      )
                    : ''}
                </Text>
              </View>
            </View>
          </View>
          <View style={[style.gridColumn, { flex: 2 }]}>
            <Text style={[style.label, style.paddingGlobal]}>
              22a. CERTIFICATION OF DEATH
            </Text>
            <View style={[style.flexRow, style.paddingGlobal]}>
              <View>
                <Text style={style.label}>ATTENDED DECEASED:</Text>
                <Text style={style.label}>CERTIFICATION DATE:</Text>
                <Text style={style.label}>FULL NAME:</Text>
                <Text style={style.label}>TITLE/POSITION:</Text>
              </View>
              <View>
                <Text style={style.valueCenter}>
                  {data.certificationOfDeath?.hasAttended ? 'Yes' : 'No'}
                </Text>
                <Text style={style.valueCenter}>
                  {data.certificationOfDeath?.date
                    ? formatDateTime(data.certificationOfDeath.date, {
                        monthFormat: 'numeric',
                        dayFormat: 'numeric',
                        yearFormat: 'numeric',
                        showTime: true,
                        hourFormat: 'numeric',
                        minuteFormat: '2-digit',
                      })
                    : ''}
                </Text>
                <Text style={style.valueCenter}>
                  {data.certificationOfDeath?.nameInPrint || ''}
                </Text>
                <Text style={style.valueCenter}>
                  {data.certificationOfDeath?.titleOfPosition || ''}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Disposal Information */}
        <View style={style.flexRow}>
          <View style={[style.gridColumn, { flex: 1.2 }]}>
            <Text style={[style.label, style.fieldContainer]}>
              23. CORPSE DISPOSAL
            </Text>
            <View style={[style.flexRow, style.paddingGlobal]}>
              <Text style={style.label}>TYPE:</Text>
              <Text style={style.valueCenter}>{data.corpseDisposal || ''}</Text>
            </View>
          </View>
          <View style={[style.gridColumn, { flex: 1 }]}>
            <Text style={[style.label, style.paddingGlobal]}>
              24a. BURIAL/CREMATION PERMIT
            </Text>
            <View style={[style.flexRow, style.paddingGlobal]}>
              <View>
                <Text style={style.label}>NUMBER:</Text>
                <Text style={style.label}>DATE ISSUED:</Text>
              </View>
              <View>
                <Text style={style.valueCenter}>
                  {data.burialPermit?.number || ''}
                </Text>
                <Text style={style.valueCenter}>
                  {data.burialPermit?.dateIssued
                    ? formatDateTime(data.burialPermit.dateIssued, {
                        monthFormat: 'numeric',
                        dayFormat: 'numeric',
                        yearFormat: 'numeric',
                      })
                    : ''}
                </Text>
              </View>
            </View>
          </View>
          <View style={[style.gridColumn, { flex: 2 }]}>
            <Text style={[style.label, style.paddingGlobal]}>
              24b. TRANSFER PERMIT
            </Text>
            <View style={[style.flexRow, style.paddingGlobal]}>
              <View>
                <Text style={style.label}>NUMBER:</Text>
                <Text style={style.label}>DATE ISSUED:</Text>
              </View>
              <View>
                <Text style={style.valueCenter}>
                  {data.transferPermit?.number || ''}
                </Text>
                <Text style={style.valueCenter}>
                  {data.transferPermit?.dateIssued
                    ? formatDateTime(data.transferPermit.dateIssued, {
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

        {/* Cemetery Address */}
        <View style={style.gridContainer}>
          <View style={[style.paddingGlobal, style.flexRow, { gap: 15 }]}>
            <Text style={style.label}>25. NAME AND ADDRESS OF CEMETERY:</Text>
            <Text style={style.valueCenter}>
              {data.cemeteryOrCrematory
                ? `${data.cemeteryOrCrematory.name}, ${data.cemeteryOrCrematory.address?.houseNo} ${data.cemeteryOrCrematory.address?.st}, ${data.cemeteryOrCrematory.address?.barangay}, ${data.cemeteryOrCrematory.address?.cityMunicipality}, ${data.cemeteryOrCrematory.address?.province}, ${data.cemeteryOrCrematory.address?.country}`
                : ''}
            </Text>
          </View>
        </View>

        {/* Processing Information */}
        <View>
          <View style={style.gridContainer}>
            {/* Section 26: Certification of Informant */}
            <View
              style={[
                style.flexColumn,
                style.flex1,
                { borderRight: '1px solid #000' },
              ]}
            >
              <Text style={[style.label, style.paddingGlobal]}>
                26. CERTIFICATION OF INFORMANT
              </Text>
              <View style={[style.flexColumn, style.paddingGlobal, { gap: 2 }]}>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>SIGNATURE:</Text>
                  <Text style={style.valueCenter}>
                    {data.informant?.signature || ''}
                  </Text>
                </View>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>NAME:</Text>
                  <Text style={style.valueCenter}>
                    {data.informant?.nameInPrint || ''}
                  </Text>
                </View>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>RELATIONSHIP:</Text>
                  <Text style={style.valueCenter}>
                    {data.informant?.relationshipToDeceased || ''}
                  </Text>
                </View>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>ADDRESS:</Text>
                  <Text style={style.valueCenter}>
                    {data.informant?.address?.country || ''}
                  </Text>
                </View>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>CITY:</Text>
                  <Text style={style.valueCenter}>
                    {data.informant?.address?.cityMunicipality || ''}
                  </Text>
                </View>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>PROVINCE:</Text>
                  <Text style={style.valueCenter}>
                    {data.informant?.address?.province || ''}
                  </Text>
                </View>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>COUNTRY:</Text>
                  <Text style={style.valueCenter}>
                    {data.informant?.address?.country || ''}
                  </Text>
                </View>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>DATE:</Text>
                  <Text style={style.valueCenter}>
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
            </View>

            {/* Section 27: Prepared By */}
            <View
              style={[
                style.flexColumn,
                style.flex1,
                { borderRight: '1px solid #000' },
              ]}
            >
              <Text style={[style.label, style.paddingGlobal]}>
                27. PREPARED BY
              </Text>
              <View style={[style.flexColumn, style.paddingGlobal, { gap: 2 }]}>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>SIGNATURE:</Text>
                  <Text style={style.valueCenter}>
                    {data.preparedBy?.signature || ''}
                  </Text>
                </View>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>NAME:</Text>
                  <Text style={style.valueCenter}>
                    {data.preparedBy?.nameInPrint || ''}
                  </Text>
                </View>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>TITLE/POSITION:</Text>
                  <Text style={style.valueCenter}>
                    {data.preparedBy?.titleOrPosition || ''}
                  </Text>
                </View>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>DATE:</Text>
                  <Text style={style.valueCenter}>
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

            {/* Section 28: Received By */}
            <View
              style={[
                style.flexColumn,
                style.flex1,
                { borderRight: '1px solid #000' },
              ]}
            >
              <Text style={[style.label, style.paddingGlobal]}>
                28. RECEIVED BY
              </Text>
              <View style={[style.flexColumn, style.paddingGlobal, { gap: 2 }]}>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>SIGNATURE:</Text>
                  <Text style={style.valueCenter}>
                    {data.receivedBy?.signature || ''}
                  </Text>
                </View>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>NAME:</Text>
                  <Text style={style.valueCenter}>
                    {data.receivedBy?.nameInPrint || ''}
                  </Text>
                </View>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>TITLE/POSITION:</Text>
                  <Text style={style.valueCenter}>
                    {data.receivedBy?.titleOrPosition || ''}
                  </Text>
                </View>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>DATE:</Text>
                  <Text style={style.valueCenter}>
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
            </View>

            {/* Section 29: Registered at Civil Registrar */}
            <View style={[style.flexColumn, style.flex1]}>
              <Text style={[style.label, style.paddingGlobal]}>
                29. REGISTERED AT CIVIL REGISTRAR
              </Text>
              <View style={[style.flexColumn, style.paddingGlobal, { gap: 2 }]}>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>NAME:</Text>
                  <Text style={style.valueCenter}>
                    {data.registeredByOffice?.nameInPrint || ''}
                  </Text>
                </View>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>TITLE/POSITION:</Text>
                  <Text style={style.valueCenter}>
                    {data.registeredByOffice?.titleOrPosition || ''}
                  </Text>
                </View>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>DATE:</Text>
                  <Text style={style.valueCenter}>
                    {data.registeredByOffice?.date
                      ? formatDateTime(data.registeredByOffice.date, {
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
        </View>

        <View style={[style.gridColumn, style.paddingGlobal, { gap: 5 }]}>
          <Text style={style.label}>
            REMARKS / ANNOTATIONS (FOR LCRO/OCRG USE ONLY)
          </Text>
          <Text style={style.value}>{data.remarks || ''}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default DeathCertificatePDF;
