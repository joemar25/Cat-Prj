'use client';

import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/death-certificate-form-schema';
import { formatDateTime } from '@/utils/date';
import { Document, Page, Text, View } from '@react-pdf/renderer';
;
import { style } from './styles';

interface DeathCertificatePDFProps {
  data: Partial<DeathCertificateFormValues>;
}

const DeathCertificatePDF: React.FC<DeathCertificatePDFProps> = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <Document>
        <Page size='LEGAL' style={style.page}>
          <View >
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
          <View style={[style.gridColumn,]}>
            <Text style={[style.headerTitle, style.paddingGlobal, { textAlign: 'center' }]}>For children aged 0 to 7 days</Text>
          </View>
          <View style={style.flexRow}>
            <View style={[style.gridColumn, style.paddingGlobal, style.flex1, { gap: 5 }]}>
              <Text style={style.label}>14. AGE OF MOTHER</Text>
              <Text style={style.value}>{"56 years old"}</Text>
            </View>
            <View style={[style.gridColumn, style.paddingGlobal, { flex: 2, gap: 5 }]}>
              <Text style={style.label}>15. METHOD OF DELIVERY </Text>
              <Text style={style.label2}>(Normal spontaneous vertex, if others, specify)</Text>
              <Text style={style.value}>{"NORMAL"}</Text>
            </View>
            <View style={[style.gridColumn, style.paddingGlobal, { flex: 2, gap: 5 }]}>
              <Text style={style.label}>16. LENGTH OF PREGRANCY</Text>
              <Text style={style.label2}>(in completed weeks)</Text>
              <Text style={style.value}>{"1 WEEK"}</Text>
            </View>
          </View>
          <View style={style.flexRow}>
            <View style={[style.gridColumn, style.paddingGlobal, style.flex1, { gap: 5 }]}>
              <Text style={style.label}>17. TYPE OF BIRTH</Text>
              <Text style={style.value}>{"NORMAL"}</Text>
            </View>
            <View style={[style.gridColumn, style.paddingGlobal, style.flex1, { gap: 5 }]}>
              <Text style={style.label}>18. IF MULTIPLE BIRTH, CHILD WAS</Text>
              <Text style={style.label2}>(1st, 2nd, 3rd, etc.)</Text>
              <Text style={style.value}>{"N/A"}</Text>
            </View>
          </View>
          <View style={[style.gridColumn]}>
            <Text style={[style.headerTitle, style.paddingGlobal, { textAlign: 'center' }]}>MEDICAL CERTIFICATE</Text>
          </View>
          <View style={[style.gridColumn, style.paddingGlobal, { gap: 5, }]}>
            <Text style={style.label}>19a. CAUSES OF DEATH</Text>
            <View style={[style.flexColumn, style.paddingLeft,]}>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { marginRight: 15 }]}>a. Main disease/condition of infant</Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>N/A</Text>
                </View>
              </View>

              <View style={[style.flexRow, { alignItems: 'center', }]}>
                <Text style={[style.label, { marginRight: 15 }]}>b. Other diseases/conditions of infant</Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>N/A</Text>
                </View>
              </View>

              <View style={[style.flexRow, { alignItems: 'center', }]}>
                <Text style={[style.label, { marginRight: 15 }]}>c. Main maternal disease/condition affecting infant</Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>N/A</Text>
                </View>
              </View>

              <View style={[style.flexRow, { alignItems: 'center', }]}>
                <Text style={[style.label, { marginRight: 15 }]}>d. Other maternal diseases/conditions affecting infant</Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>N/A</Text>
                </View>
              </View>

              <View style={[style.flexRow, { alignItems: 'center', }]}>
                <Text style={[style.label, { marginRight: 15 }]}>e. Other relevant circumstances</Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>N/A</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={[style.gridColumn, style.paddingGlobal, { border: '2px solid #000', }]}>
          <Text style={[style.headerTitle, { textAlign: 'center' }]}>postmortem certificate of death</Text>
          <Text style={style.valueCenter}>I HEREBY CERTIFY that I have performed an autopsy upon the body of the deceased and that the cause of death was</Text>
          <Text style={style.valueLine}>{" "}</Text>
          <Text style={style.valueLine}>{" "}</Text>
          <View style={[style.flexRow, { paddingTop: 20, gap: 20 }]}>
            {/* Left Column */}
            <View style={[style.flexColumn, style.flex1]}>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { width: 80 }]}>Signature</Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>{" "}</Text>
                </View>
              </View>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { width: 80 }]}>Name in Print</Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>{" "}</Text>
                </View>
              </View>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { width: 80 }]}>Date</Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>{" "}</Text>
                </View>
              </View>
            </View>

            {/* Right Column */}
            <View style={[style.flexColumn, style.flex1]}>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { width: 100 }]}>Title/Designation</Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>{" "}</Text>
                </View>
              </View>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { width: 100 }]}>Address</Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>{" "}</Text>
                </View>
              </View>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>{" "}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={[style.gridColumn, style.paddingGlobal, { border: '2px solid #000', }]}>
          <Text style={[style.headerTitle, { textAlign: 'center' }]}>certification of embalmer</Text>
          <View style={style.flexColumn}>
            <View style={[style.flexRow, { paddingLeft: 20, gap: 5 }]}>
              <Text style={style.valueCenter}>I HEREBY CERTIFY that I have embalmed </Text>
              <View style={style.flex1}>
                <Text style={style.valueLine}>{"Name of deceased"}</Text>
              </View>
              <Text style={style.valueCenter}> following</Text>
            </View>
            <View style={style.flexRow}>
              <Text style={style.valueCenter}>all the regulation prescribed by the Department Health.</Text>
            </View>
          </View>

          <View style={[style.flexRow, { paddingTop: 10, gap: 20 }]}>
            {/* Left Column */}
            <View style={[style.flexColumn, style.flex1]}>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { width: 80 }]}>Signature</Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>{" "}</Text>
                </View>
              </View>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { width: 80 }]}>Name in Print</Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>{" "}</Text>
                </View>
              </View>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { width: 80 }]}>Address</Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>{" "}</Text>
                </View>
              </View>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>{" "}</Text>
                </View>
              </View>
            </View>

            {/* Right Column */}
            <View style={[style.flexColumn, style.flex1]}>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { width: 100 }]}>Title/Designation</Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>{" "}</Text>
                </View>
              </View>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { width: 100 }]}>License No.</Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>{" "}</Text>
                </View>
              </View>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { width: 100 }]}>Issued on</Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>{" "}</Text>
                </View>
              </View>
              <View style={[style.flexRow, { alignItems: 'center' }]}>
                <Text style={[style.label, { width: 100 }]}>Expiry Date</Text>
                <View style={style.flex1}>
                  <Text style={style.valueLine}>{" "}</Text>
                </View>
              </View>
            </View>
          </View>

        </View>
        <View style={[style.gridColumn, style.paddingGlobal, { border: '2px solid #000', }]}>
          <Text style={[style.headerTitle, { textAlign: 'center' }]}>
            affidavit for delayed registration of death
          </Text>

          <View style={[style.flexColumn, { gap: 2 }]}>
            <View style={[style.flexRow, { paddingLeft: 20, gap: 5, alignItems: 'flex-end' }]}>
              <Text style={style.valueCenter}>I </Text>
              <View style={style.flex1}>
                <Text style={style.valueLine}>{""}</Text>
              </View>
              <Text style={style.valueCenter}>of Legal age, single/married/divorced/widow/widower,</Text>
            </View>
            <View style={[style.flexRow, { gap: 5, alignItems: 'flex-end' }]}>
              <Text style={style.valueCenter}>with residence and postal address</Text>
              <View style={style.flex1}>
                <Text style={style.valueLine}>{""}</Text>
              </View>
            </View>
            <View style={[style.flexRow]}>
              <Text style={style.valueCenter}>after being duly sworn in accordance with law, do hereby depose and say:  </Text>
            </View>
          </View>

          <View style={[style.flexColumn, { gap: 2, paddingTop: 10 }]}>
            <View style={[style.flexRow, { paddingLeft: 20, gap: 5, alignItems: 'flex-end' }]}>
              <Text style={style.valueCenter}>1. That </Text>
              <View style={style.flex1}>
                <Text style={style.valueLine}>{""}</Text>
              </View>
              <Text style={style.valueCenter}>died on,</Text>
              <View style={style.flex1}>
                <Text style={style.valueLine}>{""}</Text>
              </View>
            </View>
            <View style={[style.flexRow, { paddingLeft: 40, gap: 5, alignItems: 'flex-end' }]}>
              <Text style={style.valueCenter}>in</Text>
              <View style={style.flex1}>
                <Text style={style.valueLine}>{""}</Text>
              </View>
              <Text style={style.valueCenter}>and was buried/cremated im</Text>
            </View>
            <View style={[style.flexRow, { paddingLeft: 40, gap: 5, alignItems: 'flex-end' }]}>
              <View style={style.flex1}>
                <Text style={style.valueLine}>{""}</Text>
              </View>
              <Text style={style.valueCenter}>on</Text>
              <View style={style.flex1}>
                <Text style={style.valueLine}>{""}</Text>
              </View>
              <Text style={style.valueCenter}>{"."}</Text>
            </View>
          </View>

          <View style={[style.flexColumn, { gap: 2, paddingTop: 10 }]}>
            <View style={[style.flexRow, { paddingLeft: 20, gap: 5, alignItems: 'flex-end' }]}>
              <Text style={style.valueCenter}>2. That the deceased at the time of his/her death: </Text>
            </View>
            <View style={[style.flexRow, { paddingLeft: 40, gap: 5, alignItems: 'flex-end' }]}>
              <Text style={style.radio}>{" "}</Text>
              <Text style={style.valueCenter}>was attendaned by</Text>
              <View style={style.flex1}>
                <Text style={style.valueLine}>{" "}</Text>
              </View>
            </View>
            <View style={[style.flexRow, { paddingLeft: 40, gap: 5, alignItems: 'flex-end' }]}>
              <Text style={style.radio}>{" "}</Text>
              <Text style={style.valueCenter}>was not attended</Text>
            </View>
          </View>

          <View style={[style.flexColumn, { gap: 2, paddingTop: 10 }]}>
            <View style={[style.flexRow, { paddingLeft: 20, gap: 5, alignItems: 'flex-end' }]}>
              <Text style={style.valueCenter}>3. That the cause of death of the deceased was </Text>
              <View style={style.flex1}>
                <Text style={style.valueLine}>{" "}</Text>
              </View>
            </View>
          </View>

          <View style={[style.flexColumn, { gap: 2, paddingTop: 10 }]}>
            <View style={[style.flexRow, { paddingLeft: 20, gap: 5, alignItems: 'flex-end' }]}>
              <Text style={style.valueCenter}>4. That the reason for the delay registering this death was due to </Text>
              <View style={style.flex1}>
                <Text style={style.valueLine}>{"main reason"}</Text>
              </View>
            </View>
            <View style={[style.flexRow, { paddingLeft: 20, gap: 5, alignItems: 'flex-end' }]}>
              <Text style={style.valueLine}>{"other reason if there is"}</Text>
            </View>
          </View>

          <View style={[style.flexColumn, { gap: 2, paddingTop: 10 }]}>
            <View style={[style.flexRow, { paddingLeft: 20, gap: 5, alignItems: 'flex-end' }]}>
              <Text style={style.valueCenter}>5. That I amexecuting this affidavit to attest to the truthfulness of the foregoing statements for all legal intents and purposes </Text>
            </View>
            <View style={[style.flexRow, { paddingLeft: 20, gap: 5, alignItems: 'flex-end' }]}>
              <Text style={style.valueCenter}>In truth whereof, I have affixed my signature below this </Text>
              <View style={style.flex1}>
                <Text style={style.valueLine}>{"main reason"}</Text>
              </View>
              <Text style={style.valueCenter}>day of</Text>
            </View>
            <View style={[style.flexRow, { paddingLeft: 20, gap: 5, alignItems: 'flex-end' }]}>
              <Text style={style.valueCenter}>at</Text>
              <View style={style.flex1}>
                <Text style={style.valueLine}>{"main reason"}</Text>
              </View>
              <Text style={style.valueCenter}>{', '}</Text>
              <Text style={style.valueCenter}>Philippines.</Text>
            </View>
          </View>

          <View style={[style.flexColumn, { gap: 2, paddingTop: 15, alignItems: 'flex-end' }]}>
            <View style={[style.flexColumn, { gap: 5, alignItems: 'center' }]}>
              <View style={{ width: 250 }}>
                <Text style={{ fontSize: 10, textAlign: 'center' }}>{" "}</Text>
                <View style={{ borderBottom: '1px solid black', marginTop: 2 }} />
              </View>
              <Text style={style.label2}>(Signature Over Printed Name of Affiant)</Text>
            </View>
          </View>

          <View style={[style.flexColumn, { gap: 2, paddingTop: 15 }]}>
            <View style={[style.flexRow, { paddingLeft: 20, gap: 5, alignItems: 'flex-end' }]}>
              <Text style={[style.valueCenter, style.headerTitle, { fontSize: 10 }]}>Subscribe and sworn</Text>
              <Text style={style.valueCenter}>to me before this</Text>
              <View style={style.flex1}>
                <Text style={style.valueLine}>{" "}</Text>
              </View>
              <Text style={style.valueCenter}>day of</Text>
              <View style={style.flex1}>
                <Text style={style.valueLine}>{" "}</Text>
              </View>
              <Text style={style.valueCenter}>at</Text>
            </View>
            <View style={[style.flexRow, { paddingLeft: 20, gap: 5, alignItems: 'flex-end' }]}>
              <View style={style.flex1}>
                <Text style={style.valueLine}>{" "}</Text>
              </View>
              <Text style={style.valueCenter}>, </Text>
              <Text style={style.valueCenter}>Philippines, affiant who exhibited to me his CTC/valid ID</Text>
            </View>
            <View style={[style.flexRow, { paddingLeft: 20, gap: 5, alignItems: 'flex-end' }]}>
              <View style={style.flex1}>
                <Text style={style.valueLine}>{" "}</Text>
              </View>
              <Text style={style.valueCenter}>issued on </Text>
              <View style={style.flex1}>
                <Text style={style.valueLine}>{" "}</Text>
              </View>
              <Text style={style.valueCenter}>at</Text>
              <View style={style.flex1}>
                <Text style={style.valueLine}>{" "}</Text>
              </View>
            </View>
          </View>

          <View style={[style.flexColumn, { gap: 5, paddingTop: 15, alignItems: 'center', justifyContent: 'space-between' }]}>
            <View style={[style.flexRow, { gap: 10 }]}>
              <View style={[style.flexColumn, { gap: 5, alignItems: 'center' }]}>
                <View style={{ width: 250 }}>
                  <Text style={{ fontSize: 10, textAlign: 'center' }}>{" "}</Text>
                  <View style={{ borderBottom: '1px solid black', marginTop: 2 }} />
                </View>
                <Text style={style.label2}>(Signature Over Printed Name of Affiant)</Text>
              </View>
              <View style={[style.flexColumn, { gap: 5, alignItems: 'center' }]}>
                <View style={{ width: 250 }}>
                  <Text style={{ fontSize: 10, textAlign: 'center' }}>{" "}</Text>
                  <View style={{ borderBottom: '1px solid black', marginTop: 2 }} />
                </View>
                <Text style={style.label2}>(Signature Over Printed Name of Affiant)</Text>
              </View>
            </View>
            <View style={[style.flexRow, { gap: 10 }]}>
              <View style={[style.flexColumn, { gap: 5, alignItems: 'center' }]}>
                <View style={{ width: 250 }}>
                  <Text style={{ fontSize: 10, textAlign: 'center' }}>{" "}</Text>
                  <View style={{ borderBottom: '1px solid black', marginTop: 2 }} />
                </View>
                <Text style={style.label2}>(Signature Over Printed Name of Affiant)</Text>
              </View>
              <View style={[style.flexColumn, { gap: 5, alignItems: 'center' }]}>
                <View style={{ width: 250 }}>
                  <Text style={{ fontSize: 10, textAlign: 'center' }}>{" "}</Text>
                  <View style={{ borderBottom: '1px solid black', marginTop: 2 }} />
                </View>
                <Text style={style.label2}>(Signature Over Printed Name of Affiant)</Text>
              </View>
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
              <View style={[style.flexRow, style.paddingGlobal, { borderBottom: '1px solid #000', }]}>
                <Text style={style.label}>Province:</Text>
                <Text style={style.valueCenter}>{data.province || ''}</Text>
              </View>
              <View style={[style.flexRow, style.paddingGlobal]}>
                <Text style={style.label}>City/Municipality:</Text>
                <Text style={[style.valueCenter, { width: '100%' }]}>{data.cityMunicipality || ''}</Text>
              </View>
            </View>

            {/* Right Grid: Registry No. */}
            <View style={[style.flexColumn, style.flex1, style.paddingGlobal, { borderLeft: '1px solid #000' }]}>
              <View style={style.flexColumn}>
                <Text style={style.label}>Registry No.:</Text>
                <Text style={style.valueCenter}>{data.registryNumber || ''}</Text>
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
            <Text style={style.value}>
              {data.personalInfo?.firstName || ''}
            </Text>
          </View>
          <View style={style.fieldContainer}>
            <Text style={style.label}>(Middle):</Text>
            <Text style={style.value}>
              {data.personalInfo?.middleName || ''}
            </Text>
          </View>
          <View
            style={[style.fieldContainer, { borderRight: '1px solid #000' }]}
          >
            <Text style={style.label}>(Last):</Text>
            <Text style={style.value}>
              {data.personalInfo?.lastName || ''}
            </Text>
          </View>

          <View style={style.fieldContainer}>
            <Text style={style.label}>2. SEX:</Text>
            <Text style={style.value}>{data.personalInfo?.sex || ''}</Text>
          </View>
        </View>

        {/* Date of Death, Birth, and Age */}
        <View style={style.gridContainer}>
          <View style={style.fieldContainer2}>
            <Text style={style.label}>3. DATE OF DEATH:</Text>
            <Text style={style.value}>
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
          <View style={style.fieldContainer2}>
            <Text style={style.label}>4. DATE OF BIRTH:</Text>
            <Text style={style.value}>
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
          <View style={style.fieldContainer2}>
            <Text style={style.label}>5. AGE AT THE TIME OF DEATH:</Text>
            <Text style={style.value}>
              {data.personalInfo?.ageAtDeath
                ? `${data.personalInfo.ageAtDeath.years || 0} yrs, ${data.personalInfo.ageAtDeath.months || 0
                } mos, ${data.personalInfo.ageAtDeath.days || 0} d, ${data.personalInfo.ageAtDeath.hours || 0
                } hrs`
                : ''}
            </Text>
          </View>
        </View>

        {/* Place of Death and Civil Status */}
        <View style={style.gridContainer}>
          <View style={[style.fieldContainer2, { flex: .2 }]}>
            <Text style={style.label}>6. PLACE OF DEATH:</Text>
          </View>
          <View style={[style.fieldContainer2, style.flex1]}>
            <Text style={style.label}>
              (Name of Hospital/Clinic/Institution/House No., St., Brgy, City/Municipality, Province)
            </Text>
            <Text style={style.value}>
              {data.personalInfo?.placeOfDeath
                ? `${data.personalInfo.placeOfDeath.specificAddress || ''}, ${data.personalInfo.placeOfDeath.cityMunicipality || ''
                }, ${data.personalInfo.placeOfDeath.province || ''}`
                : ''}
            </Text>
          </View>
          <View style={[style.fieldContainer2, { flex: .2 }]}>
            <Text style={style.label}>7. CIVIL STATUS:</Text>
            <Text style={style.value}>
              {data.personalInfo?.civilStatus || ''}
            </Text>
          </View>
        </View>

        {/* Religion, Citizenship, and Residence */}
        <View style={style.gridContainer}>
          <View style={style.fieldContainer2}>
            <Text style={style.label}>8. RELIGION:</Text>
            <Text style={style.value}>
              {data.personalInfo?.religion || ''}
            </Text>
          </View>
          <View style={style.fieldContainer2}>
            <Text style={style.label}>9. CITIZENSHIP:</Text>
            <Text style={style.value}>
              {data.personalInfo?.citizenship || ''}
            </Text>
          </View>
          <View style={style.fieldContainer2}>
            <Text style={style.label}>10. RESIDENCE:</Text>
            <Text style={style.value}>
              {data.personalInfo?.residence?.country || ''}
            </Text>
          </View>
        </View>

        {/* Family Information */}
        <View style={style.gridContainer}>
          <View style={[style.fieldContainer2, { flex: .7 }]}>
            <Text style={style.label}>11. OCCUPATION:</Text>
            <Text style={style.value}>
              {data.personalInfo?.occupation || ''}
            </Text>
          </View>
          <View style={[style.fieldContainer2, { flex: 1.5 }]}>
            <View style={style.flexRow}>
              <Text style={style.label}>12. NAME OF FATHER </Text>
              <Text style={style.label}>(First, Middle, Last)</Text>
            </View>
            <Text style={style.value}>
              {data.familyInfo?.father
                ? `${data.familyInfo.father.firstName} ${data.familyInfo.father.middleName || ''
                } ${data.familyInfo.father.lastName}`
                : ''}
            </Text>
          </View>
          <View style={[style.fieldContainer2, { flex: 1.5 }]}>
            <View style={style.flexRow}>
              <Text style={style.label}>13. MOTHER MAIDEN NAME </Text>
              <Text style={style.label}>(First, Middle, Last)</Text>
            </View>
            <Text style={style.value}>
              {data.familyInfo?.mother
                ? `${data.familyInfo.mother.firstName} ${data.familyInfo.mother.middleName || ''
                } ${data.familyInfo.mother.lastName}`
                : ''}
            </Text>
          </View>
        </View>

        {/* Medical Certificate */}
        <View style={[{ width: '100%', }]}>
          <View style={[style.gridColumn, style.paddingGlobal, { textAlign: 'center' }]}>
            <Text style={style.value}>MEDICAL CERTIFICATE</Text>
            <Text style={style.label}>
              (For ages 0 to 7 days, accomplish items 14-19a at the back)
            </Text>
          </View>
          <View style={[style.gridColumn]}>
            {/* Grid Container */}
            <View style={[style.flexRow]}>
              <View style={[style.fieldContainer, { flex: 2 }]}>
                <Text style={style.label}>
                  19b. CAUSES OF DEATH (If the deceased is aged 8 days over)
                </Text>
              </View>
              <View style={[style.fieldContainer, { flex: 1 }]}>
                <Text style={style.label}>
                  Interval between onset and death
                </Text>
              </View>
            </View>

            <View style={[style.flexRow, { width: '100%', gap: 10, padding: 5 }]}>
              {/* Second Row: Immediate, Antecedent, and Underlying Causes */}

              {/* Labels Column */}
              <View style={[style.flex1]}>
                <Text style={style.label}>I. Immediate Cause:</Text>
                <Text style={style.label}>Antecedent Cause:</Text>
                <Text style={style.label}>Underlying Cause:</Text>
              </View>

              {/* Values Column */}
              <View style={[style.flex1]}>
                <Text style={style.valueLine}>
                  {data.medicalCertificate?.causesOfDeath?.immediate || ''}
                </Text>
                <Text style={style.valueLine}>
                  {data.medicalCertificate?.causesOfDeath?.antecedent || ''}
                </Text>
                <Text style={style.valueLine}>
                  {data.medicalCertificate?.causesOfDeath?.underlying || ''}
                </Text>
              </View>

              {/* Interval Column */}
              <View style={[style.flex1]}>
                <Text style={style.valueLine}>
                  {data.medicalCertificate?.externalCauses?.placeOfOccurrence || ''}
                </Text>
                <Text style={style.valueLine}>
                  {data.medicalCertificate?.causesOfDeath?.antecedent || ''}
                </Text>
                <Text style={style.valueLine}>
                  {data.medicalCertificate?.causesOfDeath?.underlying || ''}
                </Text>
              </View>
            </View>

            <View style={[style.flexRow, { padding: 5, gap: 10 }]}>
              <Text style={style.label}>
                II. Other significant conditions contributing to death:
              </Text>
              <Text style={style.valueCenter}>
                {data.medicalCertificate?.causesOfDeath?.contributingConditions || ''}
              </Text>
            </View>
          </View>
        </View>


        {/* Maternal Condition */}
        <View style={[style.gridContainer, style.fieldContainer, { width: '100%' }]}>
          <Text style={style.label}>
            19c. Maternal Condition:
          </Text>
          <Text style={style.value}>
            {data.medicalCertificate?.maternalCondition || ''}
          </Text>
        </View>

        {/* Death by External Causes and Autopsy */}
        <View style={style.gridContainer}>
          {/* Section 19: Death by External Causes */}
          <View style={[style.gridColumn, { width: '100%', flex: 3, borderBottom: 'none' }]}>
            <View style={[style.flexRow, style.paddingGlobal]}>
              <Text style={style.label}>
                19d. DEATH BY EXTERNAL CAUSES
              </Text>
            </View>

            {/* Manner of Death */}
            <View style={[style.flexRow, style.paddingGlobal, { borderBottom: '1px solid black', borderTop: '1px solid black' }]}>
              <Text style={style.label}>
                Manner of Death:
              </Text>
              <Text style={[style.valueCenter, { width: '100%' }]}>
                {data.medicalCertificate?.externalCauses?.mannerOfDeath || ''}
              </Text>
            </View>

            {/* Place of Occurrence */}
            <View style={[style.flexRow, style.paddingGlobal]}>
              <Text style={style.label}>
                Place of Occurrence:
              </Text>
              <Text style={[style.valueCenter, { width: '100%' }]}>
                {data.medicalCertificate?.externalCauses?.placeOfOccurrence ||
                  ''}
              </Text>
            </View>
          </View>

          {/* Section 20: Autopsy */}
          <View style={[style.paddingGlobal, { flex: 1 }]}>
            <Text style={style.label}>20. Autopsy (yes/no)</Text>
            <Text style={style.valueCenter}>{'yes'}</Text>
          </View>
        </View>

        {/* Attendant Information */}
        <View style={style.flexRow}>
          {/* 21a. Attendant Information */}
          <View style={[style.gridColumn, { flex: 1.2 }]}>
            <Text style={[style.label, style.fieldContainer]}>
              21a. ATTENDANT INFORMATION
            </Text>
            <View style={[style.flexRow, style.paddingGlobal]}>
              <View style={[]}>
                <Text style={style.label}>TYPE:  </Text>
                <Text style={style.label}>FROM:  </Text>
                <Text style={style.label}>DURATION:  </Text>
              </View>
              <View style={[]}>
                <Text style={style.valueCenter}>
                  {data.attendant?.type || ''}
                </Text>
                <Text style={style.valueCenter}>
                  {data.attendant?.attendance?.from ? formatDateTime(data.attendant.attendance.from) : ''}
                </Text>
                <Text style={style.valueCenter}>
                  {data.attendant?.attendance?.to ? formatDateTime(data.attendant.attendance.to) : ''}
                </Text>
              </View>
            </View>
          </View>

          {/* 21b. If attended, state duration */}
          <View style={[style.gridColumn, { flex: 1 }]}>
            <Text style={[style.label, style.paddingGlobal]}>
              21b. If attended, state duration
            </Text>
            <View style={[style.flexRow, style.paddingGlobal]}>
              <View style={[]}>
                <Text style={style.label}>FROM:  </Text>
                <Text style={style.label}>DURATION:  </Text>
              </View>
              <View style={[]}>
                <Text style={style.valueCenter}>
                  {data.attendant?.attendance?.from
                    ? formatDateTime(data.attendant.attendance.from)
                    : ''}
                </Text>
                <Text style={style.valueCenter}>
                  {data.attendant?.attendance?.to
                    ? formatDateTime(data.attendant.attendance.to)
                    : ''}
                </Text>
              </View>
            </View>
          </View>

          {/* 22a. Certification of Death */}
          <View style={[style.gridColumn, { flex: 2 }]}>
            <Text style={[style.label, style.paddingGlobal]}>
              22a. CERTIFICATION OF DEATH
            </Text>
            <View style={[style.flexRow, style.paddingGlobal]}>
              <View style={[]}>
                <Text style={style.label}>ATTENDED DECEASED:  </Text>
                <Text style={style.label}>CERTIFICATION DEATH:  </Text>
                <Text style={style.label}>FULL NAME:  </Text>
                <Text style={style.label}>TITLE/POSITION:  </Text>
              </View>
              <View style={[]}>
                <Text style={style.valueCenter}>
                  {data.certification?.hasAttended ? 'Yes' : 'No'}
                </Text>
                <Text style={style.valueCenter}>
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
                <Text style={style.valueCenter}>
                  {data.certification?.name || ''}
                </Text>
                <Text style={style.valueCenter}>
                  {data.certification?.title || ''}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Disposal Information */}
        <View style={style.flexRow}>
          {/* 21a. Attendant Information */}
          <View style={[style.gridColumn, { flex: 1.2 }]}>
            <Text style={[style.label, style.fieldContainer]}>
              23. CORPSE DISPOSAL
            </Text>
            <View style={[style.flexRow, style.paddingGlobal]}>
              <View style={[]}>
                <Text style={style.label}>TYPE:  </Text>

              </View>
              <View style={[]}>
                <Text style={style.valueCenter}>
                  {data.disposal?.method || ''}
                </Text>
              </View>
            </View>
          </View>

          {/* 21b. If attended, state duration */}
          <View style={[style.gridColumn, { flex: 1 }]}>
            <Text style={[style.label, style.paddingGlobal]}>
              24a. BURIAL/CREMATION PERMIT
            </Text>
            <View style={[style.flexRow, style.paddingGlobal]}>
              <View style={[]}>
                <Text style={style.label}>NUMBER:  </Text>
                <Text style={style.label}>DATE ISSUED:  </Text>
              </View>
              <View style={[]}>
                <Text style={style.valueCenter}>
                  {data.disposal?.burialPermit?.number || ''}
                </Text>
                <Text style={style.valueCenter}>
                  {data.disposal?.burialPermit?.dateIssued
                    ? formatDateTime(data.disposal.burialPermit.dateIssued, {
                      monthFormat: 'numeric',
                      dayFormat: 'numeric',
                      yearFormat: 'numeric',
                    })
                    : ''}
                </Text>
              </View>
            </View>
          </View>

          {/* 22a. Certification of Death */}
          <View style={[style.gridColumn, { flex: 2 }]}>
            <Text style={[style.label, style.paddingGlobal]}>
              24b. TRANSFER PERMIT
            </Text>
            <View style={[style.flexRow, style.paddingGlobal]}>
              <View style={[]}>
                <Text style={style.label}>NUMBER:  </Text>
                <Text style={style.label}>DATE ISSUED:  </Text>
              </View>
              <View style={[]}>
                <Text style={style.valueCenter}>
                  {data.disposal?.transferPermit?.number || ''}
                </Text>
                <Text style={style.valueCenter}>
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
          </View>
        </View>

        {/* Cemetery name and address */}
        <View style={style.gridContainer}>
          <View style={[style.paddingGlobal, style.flexRow, { gap: 15 }]}>
            <Text style={style.label}>
              25. NAME AND ADDRESS OF CEMETERY:
            </Text>
            <Text style={style.valueCenter}>
              {data.disposal?.cemeteryAddress || ''}
            </Text>
          </View>
        </View>

        <View>
          {/* First Row: Sections 26 (Informant) and 27 (Prepared By) */}
          <View
            style={[style.gridContainer, {}]}
          >
            {/* Section 26: Certification of Informant */}
            <View style={[style.flexColumn, style.flex1, { borderRight: '1px solid #000', }]}>
              <Text style={[style.label, style.paddingGlobal]}>
                26. CERTIFICATION OF INFORMANT
              </Text>
              <View style={[style.flexColumn, style.paddingGlobal, { gap: 2 }]}>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>SIGNATURE:</Text>
                  <Text style={style.valueCenter}>{data.informant?.signature || ''}</Text>
                </View>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>NAME:</Text>
                  <Text style={style.valueCenter}>{data.informant?.name || ''}</Text>
                </View>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>RELATIONSHIP:</Text>
                  <Text style={style.valueCenter}>{data.informant?.relationship || ''}</Text>
                </View>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>ADDRESS:</Text>
                  <Text style={style.valueCenter}>{data.informant?.address?.country || ''}</Text>
                </View>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>CITY:</Text>
                  <Text style={style.valueCenter}>{data.informant?.address?.cityMunicipality || ''}</Text>
                </View>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>PROVINCE:</Text>
                  <Text style={style.valueCenter}>{data.informant?.address?.province || ''}</Text>
                </View>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>COUNTRY:</Text>
                  <Text style={style.valueCenter}>{data.informant?.address?.country || ''}</Text>
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
            <View style={[style.flexColumn, style.flex1, { borderRight: '1px solid #000', }]}>
              <Text style={[style.label, style.paddingGlobal]}>27. PREPARED BY</Text>
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
                    {data.preparedBy?.name || ''}
                  </Text>
                </View>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>TITLE/POSITION:</Text>
                  <Text style={style.valueCenter}>
                    {data.preparedBy?.title || ''}
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
          </View>

          {/* Second Row: Sections 28 (Received By) and 29 (Registered at Civil Registrar) */}
          <View style={[style.gridContainer]}>
            {/* Section 28: Received By */}
            <View style={[style.flexColumn, style.flex1, { borderRight: '1px solid #000', }]}>
              <Text style={[style.label, style.paddingGlobal]}>28. RECEIVED BY</Text>
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
                    {data.receivedBy?.name || ''}
                  </Text>
                </View>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>TITLE/POSITION:</Text>
                  <Text style={style.valueCenter}>
                    {data.receivedBy?.title || ''}
                  </Text>
                </View>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>Date:</Text>
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
            <View style={[style.flexColumn, style.flex1, { borderRight: '1px solid #000', }]}>
              <Text style={[style.label, style.paddingGlobal]}>
                29. REGISTERED AT CIVIL REGISTRAR
              </Text>
              <View style={[style.flexColumn, style.paddingGlobal, { gap: 2 }]}>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>NAME:</Text>
                  <Text style={style.valueCenter}>
                    {data.registeredAtCivilRegistrar?.name || ''}
                  </Text>
                </View>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>TITLE/POSITION:</Text>
                  <Text style={style.valueCenter}>
                    {data.registeredAtCivilRegistrar?.title || ''}
                  </Text>
                </View>
                <View style={[style.flexRow, { gap: 5 }]}>
                  <Text style={style.label}>DATE:</Text>
                  <Text style={style.valueCenter}>
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
        </View>

        <View style={[style.gridColumn, style.paddingGlobal, { gap: 5 }]}>
          <Text style={style.label}>
            REMARKS / ANNOTATIONS (FOR LCRO/OCRG USE ONLY)
          </Text>
          {/* Remarks Section */}
          <Text style={style.value}>{data.remarks || ''}</Text>
        </View>
      </Page>

    </Document>
  );
};

export default DeathCertificatePDF;
