import { MarriageCertificateFormValues } from '@/lib/types/zod-form-certificate/marriage-certificate-form-schema';
import { formatDateTime } from '@/utils/date';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles } from './marriage';
import { Place } from '@/types/marriage-certificate';
import { back } from './style-back';
import { format } from 'date-fns';
// Define styles for the PDF

// Helper functions to format data
// const formatName = (name: PersonName | null | undefined): string => {
//   if (!name) return ''
//   return `${name.first}${name.middle ? ` ${name.middle}` : ''} ${name.last}`
// }

const formatPlace = (place?: Place | null): string => {
  if (!place) return '';
  const { houseNo, st, barangay, cityMunicipality, province, country } = place;

  return [houseNo, st, barangay, cityMunicipality, province, country]
    .filter(Boolean) // Remove undefined or empty values
    .join(', ');
};


const formatBday = (date: string | Date) => {
  return format(new Date(date), "dd MMMM, yyyy"); // Outputs: "05 August 2001"
};

// PDF Component
interface MarriageCertificatePDFProps {
  data: Partial<MarriageCertificateFormValues>;
}

const MarriageCertificatePDF: React.FC<MarriageCertificatePDFProps> = ({
  data,
}) => {
  if (!Object.entries(data).length) {
    return (
      <Document>
        <Page size='LEGAL' style={styles.page}>
          <View>
            <Text>No data available for preview.</Text>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="LEGAL" style={styles.page}>
        <View>
          <View key={'husbandInfo'}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.municipal}>
                <Text>Municipal Form No. 97</Text>
                <Text style={styles.headerNote1}>Revised August 2016</Text>
              </View>
              <View style={styles.republic}>
                <Text style={styles.headerSubtitle}>Republic of the Philippines</Text>
                <Text style={styles.headerSubtitle}>
                  OFFICE OF THE CIVIL REGISTRAR GENERAL
                </Text>
                <Text style={styles.headerTitle}>CERTIFICATE OF MARRIAGE</Text>
              </View>
              <View>
                <Text style={styles.headerNote2}>
                  (To be accomplished in quadruplicate using black ink)
                </Text>
              </View>
            </View>

            {/* Grid Container */}
            <View>
              <View style={styles.gridContainer}>
                {/* Left Grid: Province and City/Municipality */}
                <View style={[styles.flexColumn, { flex: 2, padding: 0 }]}>
                  <View style={[styles.flexRow, styles.paddingGlobal, { borderBottom: '1px solid #000', }]}>
                    <Text style={styles.label}>Province:</Text>
                    <Text style={[styles.valueCenter, { width: '100%' }]}>{data.province || ''}</Text>
                  </View>
                  <View style={[styles.flexRow, styles.paddingGlobal]}>
                    <Text style={styles.label}>City/Municipality:</Text>
                    <Text style={[styles.valueCenter, { width: '100%' }]}>{data.cityMunicipality || ''}</Text>
                  </View>
                </View>

                {/* Right Grid: Registry No. */}
                <View style={[styles.flexColumn, styles.paddingGlobal, { borderLeft: '1px solid #000', flex: 1 }]}>
                  <View style={styles.flexColumn}>
                    <Text style={styles.label}>Registry No.:</Text>
                    <Text style={styles.valueCenter}>{data.registryNumber || ''}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* First Section */}
            <View style={styles.gridContainer}>
              {/* Column 1: Numbering */}
              <View
                style={[
                  styles.gridColumn,
                  { width: 100, borderRight: '1px solid #000' },
                ]}
              >
                <Text style={styles.gridHeader}>1. Name of Contracting Parties</Text>
              </View>

              {/* Column 2: Husband's Information */}
              <View
                style={[
                  styles.gridColumn,
                  { flex: 1, borderRight: '1px solid #000', padding: 0 },
                ]}
              >
                <Text style={styles.title}>Husband</Text>
                <View style={[styles.flexColumn, { padding: 5 }]}>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>First Name:</Text>
                    <Text style={styles.value}>{data.husbandInfo?.name?.first || ''}</Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Middle Name:</Text>
                    <Text style={styles.value}>{data.husbandInfo?.name?.middle || ''}</Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Last Name:</Text>
                    <Text style={styles.value}>{data.husbandInfo?.name?.last || ''}</Text>
                  </View>
                </View>
              </View>

              {/* Column 3: Wife's Information */}
              <View
                style={[
                  styles.gridColumn,
                  { flex: 1, borderRight: '1px solid #000', padding: 0 },
                ]}
              >
                <Text style={styles.title}>Wife</Text>
                <View style={[styles.flexColumn, { padding: 5 }]}>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>First Name:</Text>
                    <Text style={styles.value}>{data.wifeInfo?.name?.first || ''}</Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Middle Name:</Text>
                    <Text style={styles.value}>{data.wifeInfo?.name?.middle || ''}</Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Last Name:</Text>
                    <Text style={styles.value}>{data.wifeInfo?.name?.last || ''}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Second Section */}
            <View style={styles.gridContainer}>
              {/* Column 1: Numbering */}
              <View
                style={[
                  styles.gridColumn,
                  { width: 100, borderRight: '1px solid #000' },
                ]}
              >
                <Text style={styles.gridHeader}>2a. Date of birth</Text>
                <Text style={styles.gridHeader}>2b. Age</Text>
              </View>

              {/* Column 2: Husband's Information */}
              <View
                style={[
                  styles.gridColumn,
                  { flex: 1, borderRight: '1px solid #000', gap: 5 },
                ]}
              >
                <View style={styles.flexRow}>
                  <Text style={styles.gridHeader}>(Day)</Text>
                  <Text style={styles.gridHeader}>(Month)</Text>
                  <Text style={styles.gridHeader}>(Year)</Text>
                  <Text style={styles.gridHeader}>(Age)</Text>
                </View>
                <View style={styles.flexRow}>
                  <Text style={styles.value}>
                    {data.husbandInfo?.birth
                      ? formatBday(data.husbandInfo.birth)
                      : ''}
                  </Text>


                  <Text style={styles.value}>
                    {data.husbandInfo?.age ? `${data.husbandInfo.age} y.o` : ''}
                  </Text>
                </View>
              </View>

              {/* Column 3: Wife's Information */}
              <View style={[styles.gridColumn, { flex: 1, gap: 5 }]}>
                <View style={styles.flexRow}>
                  <Text style={styles.gridHeader}>(Day)</Text>
                  <Text style={styles.gridHeader}>(Month)</Text>
                  <Text style={styles.gridHeader}>(Year)</Text>
                  <Text style={styles.gridHeader}>(Age)</Text>
                </View>
                <View style={styles.flexRow}>
                  <Text style={styles.value}>
                    {data.wifeInfo?.birth
                      ? formatBday(data.wifeInfo.birth)
                      : ''}
                  </Text>

                  <Text style={styles.value}>
                    {data.wifeInfo?.age ? `${data.wifeInfo.age} y.o` : ''}
                  </Text>
                </View>
              </View>
            </View>

            {/* Third Section */}
            <View style={styles.gridContainer}>
              {/* Column 1: Numbering */}
              <View
                style={[
                  styles.gridColumn,
                  { width: 100, borderRight: '1px solid #000' },
                ]}
              >
                <Text style={styles.gridHeader}>3. Place of birth</Text>
              </View>

              {/* Column 2: Husband's Information */}
              <View
                style={[
                  styles.gridColumn,
                  { flex: 1, borderRight: '1px solid #000', gap: 5 },
                ]}
              >
                <View style={styles.flexRow}>
                  <Text style={styles.gridHeader}>(City/Municipality)</Text>
                  <Text style={styles.gridHeader}>(Province)</Text>
                  <Text style={styles.gridHeader}>(Country)</Text>
                </View>
                <View style={styles.flexRow}>
                  <Text style={styles.value}>
                    {formatPlace(data.husbandInfo?.placeOfBirth) || ''}
                  </Text>
                </View>
              </View>

              {/* Column 3: Wife's Information */}
              <View style={[styles.gridColumn, { flex: 1, gap: 5 }]}>
                <View style={styles.flexRow}>
                  <Text style={styles.gridHeader}>(City/Municipality)</Text>
                  <Text style={styles.gridHeader}>(Province)</Text>
                  <Text style={styles.gridHeader}>(Country)</Text>
                </View>
                <View style={styles.flexRow}>
                  <Text style={styles.value}>
                    {formatPlace(data.wifeInfo?.placeOfBirth) || ''}
                  </Text>
                </View>
              </View>
            </View>

            {/* Fourth Section */}
            <View style={[styles.gridContainer, { padding: 0 }]}>
              {/* Column 1: Numbering */}
              <View
                style={[
                  styles.gridColumn,
                  { width: 100, borderRight: '1px solid #000', padding: 5 },
                ]}
              >
                <Text style={styles.gridHeader}>4a. Sex</Text>
                <Text style={styles.gridHeader}>4b. Citizenship</Text>
              </View>

              {/* Column 2: Husband's Information */}
              <View
                style={[
                  styles.gridColumn,
                  { flex: 1, borderRight: '1px solid #000', padding: 0 },
                ]}
              >
                <View style={[styles.flexRow, { padding: 0 }]}>
                  <View style={[styles.gridColumn, { padding: 5 }]}>
                    <Text
                      style={[
                        styles.value,
                        { textAlign: 'left', textTransform: 'uppercase' },
                      ]}
                    >
                      {data.husbandInfo?.sex || ''}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.gridColumn,
                      { padding: 5, borderLeft: '1px solid #000' },
                    ]}
                  >
                    <Text style={styles.gridHeader}>(Citizenship)</Text>
                    <Text style={styles.value}>{data.husbandInfo?.citizenship || ''}</Text>
                  </View>
                </View>
              </View>

              {/* Column 3: Wife's Information */}
              <View style={[styles.gridColumn, { flex: 1, padding: 0 }]}>
                <View style={[styles.flexRow, { padding: 0 }]}>
                  <View style={[styles.gridColumn, { padding: 5 }]}>
                    <Text
                      style={[
                        styles.value,
                        { textAlign: 'left', textTransform: 'uppercase' },
                      ]}
                    >
                      {data.wifeInfo?.sex || ''}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.gridColumn,
                      { padding: 5, borderLeft: '1px solid #000' },
                    ]}
                  >
                    <Text style={styles.gridHeader}>(Citizenship)</Text>
                    <Text style={styles.value}>{data.wifeInfo?.citizenship || ''}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Fifth Section */}
            <View style={styles.gridContainer}>
              {/* Column 1: Numbering */}
              <View
                style={[
                  styles.gridColumn,
                  { width: 100, borderRight: '1px solid #000' },
                ]}
              >
                <Text style={styles.gridHeader}>5. Residence</Text>
              </View>

              {/* Column 2: Husband's Information */}
              <View
                style={[
                  styles.gridColumn,
                  { flex: 1, borderRight: '1px solid #000', gap: 5 },
                ]}
              >
                <View style={styles.flexRow}>
                  <Text style={[styles.gridHeader, { fontSize: 9 }]}>
                    (House no., St., Brgy, City/Municipality, Province, Country)
                  </Text>
                </View>
                <View style={styles.flexRow}>
                  <Text style={styles.value}>
                    <Text style={styles.value}>{data.husbandInfo?.residence || ''}</Text>
                  </Text>
                </View>
              </View>

              {/* Column 3: Wife's Information */}
              <View style={[styles.gridColumn, { flex: 1, gap: 5 }]}>
                <View style={styles.flexRow}>
                  <Text style={[styles.gridHeader, { fontSize: 9 }]}>
                    (House no., St., Brgy, City/Municipality, Province, Country)
                  </Text>
                </View>
                <View style={styles.flexRow}>
                  <Text style={styles.value}>
                    <Text style={styles.value}>{data.wifeInfo?.residence || ''}</Text>
                  </Text>
                </View>
              </View>
            </View>

            {/* Sixth Section */}
            <View style={styles.gridContainer}>
              {/* Column 1: Numbering */}
              <View
                style={[
                  styles.gridColumn,
                  { width: 100, borderRight: '1px solid #000' },
                ]}
              >
                <Text style={styles.gridHeader}>6. Religion Sect.</Text>
              </View>

              {/* Column 2: Husband's Information */}
              <View
                style={[
                  styles.gridColumn,
                  { flex: 1, borderRight: '1px solid #000', gap: 5 },
                ]}
              >
                <View style={styles.flexRow}>
                  <Text style={styles.value}>{data.husbandInfo?.religion || ''}</Text>
                </View>
              </View>

              {/* Column 3: Wife's Information */}
              <View style={[styles.gridColumn, { flex: 1, gap: 5 }]}>
                <View style={styles.flexRow}>
                  <Text style={styles.value}>{data.wifeInfo?.religion || ''}</Text>
                </View>
              </View>
            </View>

            {/* Seventh Section */}
            <View style={styles.gridContainer}>
              {/* Column 1: Numbering */}
              <View
                style={[
                  styles.gridColumn,
                  { width: 100, borderRight: '1px solid #000' },
                ]}
              >
                <Text style={styles.gridHeader}>7. Civil Status</Text>
              </View>

              {/* Column 2: Husband's Information */}
              <View
                style={[
                  styles.gridColumn,
                  { flex: 1, borderRight: '1px solid #000', gap: 5 },
                ]}
              >
                <View style={[styles.flexRow, { textTransform: 'uppercase' }]}>
                  <Text style={styles.value}>{data.husbandInfo?.civilStatus || ''}</Text>
                </View>
              </View>

              {/* Column 3: Wife's Information */}
              <View style={[styles.gridColumn, { flex: 1, gap: 5 }]}>
                <View style={[styles.flexRow, { textTransform: 'uppercase' }]}>
                  <Text style={styles.value}>{data.wifeInfo?.civilStatus || ''}</Text>
                </View>
              </View>
            </View>

            {/* Eighth Section */}
            <View style={styles.gridContainer}>
              {/* Column 1: Numbering */}
              <View
                style={[
                  styles.gridColumn,
                  { width: 100, borderRight: '1px solid #000' },
                ]}
              >
                <Text style={styles.gridHeader}>8. Name of Father</Text>
              </View>

              {/* Column 2: Husband's Information */}
              <View
                style={[
                  styles.gridColumn,
                  { flex: 1, borderRight: '1px solid #000', gap: 5 },
                ]}
              >
                <View style={styles.flexRow}>
                  <Text style={styles.gridHeader}>(First)</Text>
                  <Text style={styles.gridHeader}>(Middle)</Text>
                  <Text style={styles.gridHeader}>(Last)</Text>
                </View>
                <View style={styles.flexRow}>
                  <Text style={styles.value}>
                    {data.husbandInfo?.husbandParents?.father?.first || ''}
                  </Text>
                  <Text style={styles.value}>
                    {data.husbandInfo?.husbandParents?.father?.middle || ''}
                  </Text>
                  <Text style={styles.value}>
                    {data.husbandInfo?.husbandParents?.father?.last || ''}
                  </Text>
                </View>
              </View>

              {/* Column 3: Wife's Information */}
              <View style={[styles.gridColumn, { flex: 1, gap: 5 }]}>
                <View style={styles.flexRow}>
                  <Text style={styles.gridHeader}>(First)</Text>
                  <Text style={styles.gridHeader}>(Middle)</Text>
                  <Text style={styles.gridHeader}>(Last)</Text>
                </View>
                <View style={styles.flexRow}>
                  <Text style={styles.value}>{data.wifeInfo?.wifeParents?.father?.first || ''}</Text>
                  <Text style={styles.value}>{data.wifeInfo?.wifeParents?.father?.middle || ''}</Text>
                  <Text style={styles.value}>{data.wifeInfo?.wifeParents?.father?.last || ''}</Text>
                </View>
              </View>
            </View>

            {/* Ninth Section */}
            <View style={styles.gridContainer}>
              {/* Column 1: Numbering */}
              <View
                style={[
                  styles.gridColumn,
                  { width: 100, borderRight: '1px solid #000' },
                ]}
              >
                <Text style={styles.gridHeader}>9. Citizenship</Text>
              </View>

              {/* Column 2: Husband's Information */}
              <View
                style={[
                  styles.gridColumn,
                  { flex: 1, borderRight: '1px solid #000', gap: 5 },
                ]}
              >
                <View style={[styles.flexRow, { textTransform: 'uppercase' }]}>
                  <Text style={styles.value}>
                    {data.husbandInfo?.husbandParents?.fatherCitizenship || ''}
                  </Text>
                </View>
              </View>

              {/* Column 3: Wife's Information */}
              <View style={[styles.gridColumn, { flex: 1, gap: 5 }]}>
                <View style={[styles.flexRow, { textTransform: 'uppercase' }]}>
                  <Text style={styles.value}>{data.wifeInfo?.wifeParents?.fatherCitizenship || ''}</Text>
                </View>
              </View>
            </View>

            {/* Tenth Section */}
            <View style={styles.gridContainer}>
              {/* Column 1: Numbering */}
              <View
                style={[
                  styles.gridColumn,
                  { width: 100, borderRight: '1px solid #000' },
                ]}
              >
                <Text style={styles.gridHeader}>10. Maiden Name of Mother</Text>
              </View>

              {/* Column 2: Husband's Information */}
              <View
                style={[
                  styles.gridColumn,
                  { flex: 1, borderRight: '1px solid #000', gap: 5 },
                ]}
              >
                <View style={styles.flexRow}>
                  <Text style={styles.gridHeader}>(First)</Text>
                  <Text style={styles.gridHeader}>(Middle)</Text>
                  <Text style={styles.gridHeader}>(Last)</Text>
                </View>
                <View style={styles.flexRow}>
                  <Text style={styles.value}>
                    {data.husbandInfo?.husbandParents?.mother.first || ''}
                  </Text>
                  <Text style={styles.value}>
                    {data.husbandInfo?.husbandParents?.mother.middle || ''}
                  </Text>
                  <Text style={styles.value}>
                    {data.husbandInfo?.husbandParents?.mother.last || ''}
                  </Text>
                </View>
              </View>

              {/* Column 3: Wife's Information */}
              <View style={[styles.gridColumn, { flex: 1, gap: 5 }]}>
                <View style={styles.flexRow}>
                  <Text style={styles.gridHeader}>(First)</Text>
                  <Text style={styles.gridHeader}>(Middle)</Text>
                  <Text style={styles.gridHeader}>(Last)</Text>
                </View>
                <View style={styles.flexRow}>
                  <Text style={styles.value}>
                    {data.wifeInfo?.wifeParents?.mother.first || ''}
                  </Text>
                  <Text style={styles.value}>
                    {data.wifeInfo?.wifeParents?.mother.middle || ''}
                  </Text>
                  <Text style={styles.value}>
                    {data.wifeInfo?.wifeParents?.mother.last || ''}
                  </Text>
                </View>
              </View>
            </View>

            {/* Eleventh Section */}
            <View style={styles.gridContainer}>
              {/* Column 1: Numbering */}
              <View
                style={[
                  styles.gridColumn,
                  { width: 100, borderRight: '1px solid #000' },
                ]}
              >
                <Text style={styles.gridHeader}>11. Citizenship</Text>
              </View>

              {/* Column 2: Husband's Information */}
              <View
                style={[
                  styles.gridColumn,
                  { flex: 1, borderRight: '1px solid #000', gap: 5 },
                ]}
              >
                <View style={[styles.flexRow, { textTransform: 'uppercase' }]}>
                  <Text style={styles.value}>
                    {data.husbandInfo?.husbandParents?.motherCitizenship || ''}
                  </Text>
                </View>
              </View>

              {/* Column 3: Wife's Information */}
              <View style={[styles.gridColumn, { flex: 1, gap: 5 }]}>
                <View style={[styles.flexRow, { textTransform: 'uppercase' }]}>
                  <Text style={styles.value}>{data.wifeInfo?.wifeParents?.motherCitizenship || ''}</Text>
                </View>
              </View>
            </View>

            {/* Twelfth Section */}
            <View style={styles.gridContainer}>
              {/* Column 1: Numbering */}
              <View
                style={[
                  styles.gridColumn,
                  { width: 100, borderRight: '1px solid #000' },
                ]}
              >
                <Text style={[styles.gridHeader, { fontSize: 10 }]}>
                  12. Wali Who Gave Consent/Advise
                </Text>
              </View>

              {/* Column 2: Husband's Information */}
              <View
                style={[
                  styles.gridColumn,
                  { flex: 1, borderRight: '1px solid #000', gap: 5 },
                ]}
              >
                <View style={styles.flexRow}>
                  <Text style={styles.gridHeader}>(First)</Text>
                  <Text style={styles.gridHeader}>(Middle)</Text>
                  <Text style={styles.gridHeader}>(Last)</Text>
                </View>
                <View style={[styles.flexRow]}>
                  <Text style={styles.value}>
                    {data.husbandInfo?.husbandConsentPerson?.first || ''}
                  </Text>
                  <Text style={styles.value}>
                    {data.husbandInfo?.husbandConsentPerson?.middle || ''}
                  </Text>
                  <Text style={styles.value}>
                    {data.husbandInfo?.husbandConsentPerson?.last || ''}
                  </Text>
                </View>
              </View>

              {/* Column 3: Wife's Information */}
              <View style={[styles.gridColumn, { flex: 1, gap: 5 }]}>
                <View style={styles.flexRow}>
                  <Text style={styles.gridHeader}>(First)</Text>
                  <Text style={styles.gridHeader}>(Middle)</Text>
                  <Text style={styles.gridHeader}>(Last)</Text>
                </View>
                <View style={[styles.flexRow]}>
                  <Text style={styles.value}>
                    {data.wifeInfo?.wifeConsentPerson?.first || ''}
                  </Text>
                  <Text style={styles.value}>
                    {data.wifeInfo?.wifeConsentPerson?.middle || ''}
                  </Text>
                  <Text style={styles.value}>
                    {data.wifeInfo?.wifeConsentPerson?.last || ''}
                  </Text>
                </View>
              </View>
            </View>

            {/* Thirteenth Section */}
            <View style={styles.gridContainer}>
              {/* Column 1: Numbering */}
              <View
                style={[
                  styles.gridColumn,
                  { width: 100, borderRight: '1px solid #000' },
                ]}
              >
                <Text style={styles.gridHeader}>13. Relationship</Text>
              </View>

              {/* Column 2: Husband's Information */}
              <View
                style={[
                  styles.gridColumn,
                  { flex: 1, borderRight: '1px solid #000', gap: 5 },
                ]}
              >
                <View style={[styles.flexRow, { textTransform: 'uppercase' }]}>
                  <Text style={styles.value}>
                    {data.husbandInfo?.husbandConsentPerson?.relationship || ''}
                  </Text>
                </View>
              </View>

              {/* Column 3: Wife's Information */}
              <View
                style={[
                  styles.gridColumn,
                  { flex: 1, borderRight: '1px solid #000', gap: 5 },
                ]}
              >
                <View style={[styles.flexRow, { textTransform: 'uppercase' }]}>
                  <Text style={styles.value}>
                    {data.wifeInfo?.wifeConsentPerson?.relationship || ''}
                  </Text>
                </View>
              </View>
            </View>

            {/* Fourteenth Section */}
            <View style={styles.gridContainer}>
              {/* Column 1: Numbering */}
              <View
                style={[
                  styles.gridColumn,
                  { width: 100, borderRight: '1px solid #000' },
                ]}
              >
                <Text style={styles.gridHeader}>14. Residence</Text>
              </View>

              {/* Column 2: Husband's Information */}
              <View
                style={[
                  styles.gridColumn,
                  { flex: 1, borderRight: '1px solid #000', gap: 5 },
                ]}
              >
                <View style={styles.flexRow}>
                  <Text style={[styles.gridHeader, { fontSize: 9 }]}>
                    (House no., St., Brgy, City/Municipality, Province, Country)
                  </Text>
                </View>
                <View style={styles.flexRow}>
                  <Text style={styles.value}>
                    <Text style={styles.value}>
                      {data.husbandInfo?.husbandConsentPerson?.residence || ''}
                    </Text>
                  </Text>
                </View>
              </View>

              {/* Column 3: Wife's Information */}
              <View style={[styles.gridColumn, { flex: 1, gap: 5 }]}>
                <View style={styles.flexRow}>
                  <Text style={[styles.gridHeader, { fontSize: 9 }]}>
                    (House no., St., Brgy, City/Municipality, Province, Country)
                  </Text>
                </View>
                <View style={styles.flexRow}>
                  <Text style={styles.value}>
                    <Text style={styles.value}>
                      {data.wifeInfo?.wifeConsentPerson?.residence || ''}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>,

          <View key={'wifeInfo'}>
            {/* Fifteenth Section */}
            <View style={styles.gridContainer}>
              <View style={styles.gridColumn}>
                <Text style={styles.gridHeader}>15. Place of Marriage: </Text>
              </View>
              <View style={styles.gridColumn}>
                <Text style={styles.value}>
                  {formatPlace(data.marriageDetails?.placeOfMarriage) || ''}
                </Text>
              </View>
            </View>

            {/* Sixteenth and Seventeenth Section */}
            <View style={[styles.gridContainer, { padding: 0 }]}>
              {/* First Cell (colspan-2) */}
              <View
                style={[
                  styles.gridColumn,
                  { flex: 2, borderRight: '1px solid #000', padding: 0 },
                ]}
              >
                <View
                  style={[
                    styles.flexRow,
                    {
                      textAlign: 'left',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                    },
                  ]}
                >
                  <View style={styles.gridColumn}>
                    <Text style={styles.gridHeader}>16. Date of Marriage: </Text>
                  </View>
                  <View style={styles.gridColumn}>
                    <Text style={styles.value}>
                      {data.marriageDetails?.dateOfMarriage
                        ? formatBday(data.marriageDetails?.dateOfMarriage)
                        : ''}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Second Cell (colspan-1) */}
              <View style={[styles.gridColumn, { flex: 1.4, padding: 0 }]}>
                <View
                  style={[
                    styles.flexRow,
                    {
                      textAlign: 'left',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                    },
                  ]}
                >
                  <View style={styles.gridColumn}>
                    <Text style={styles.gridHeader}>17. Time of Marriage: </Text>
                  </View>
                  <View style={styles.gridColumn}>
                    <Text style={styles.value}>{data.marriageDetails?.timeOfMarriage?.toString() || ''}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Eighteenth Section */}
            {/* Contracting Parties Signature Section */}
            <View style={styles.gridContainer}>
              {/* First Column: Title (Certification) */}
              <View
                style={[
                  styles.gridColumn,
                  { width: 200, padding: 0, borderRight: '1px solid #000' },
                ]}
              >
                <View
                  style={[
                    styles.flexRow,
                    {
                      textAlign: 'left',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                    },
                  ]}
                >
                  <View style={styles.gridColumn}>
                    <Text style={styles.gridHeader}>
                      18. CERTIFICATION OF THE CONTRACTING PARTIES:{' '}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Second Column: Husband's Signature */}
              <View
                style={[
                  styles.gridColumn,
                  { flex: 1, padding: 0, borderRight: '1px solid #000' },
                ]}
              >
                <View
                  style={[
                    styles.flexRow,
                    {
                      textAlign: 'left',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                    },
                  ]}
                >
                  <View style={styles.gridColumn}>
                    <Text style={styles.gridHeader}>(Husband) </Text>
                  </View>
                  <View style={styles.gridColumn}>
                    <Text style={styles.value}>
                      {data.husbandContractParty?.contractingParties?.signature}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Third Column: Wife's Signature */}
              <View style={[styles.gridColumn, { flex: 1, padding: 0 }]}>
                <View
                  style={[
                    styles.flexRow,
                    {
                      textAlign: 'left',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                    },
                  ]}
                >
                  <View style={styles.gridColumn}>
                    <Text style={styles.gridHeader}>(Wife) </Text>
                  </View>
                  <View style={styles.gridColumn}>
                    <Text style={styles.value}>
                      {data.wifeContractParty?.contractingParties?.signature}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Nineteenth Section */}
            <View style={[styles.gridContainer, { padding: 0 }]}>
              {/* First Cell (fixed width: 200) */}
              <View style={[styles.gridColumn, { width: 200, padding: 0 }]}>
                <View
                  style={[
                    styles.flexRow,
                    {
                      textAlign: 'left',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                    },
                  ]}
                >
                  <View style={styles.gridColumn}>
                    <Text style={styles.gridHeader}>
                      19. CERTIFICATION OF THE SOLEMNIZING OFFICER:{' '}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Second Cell (flex: 1) */}
              <View
                style={[
                  styles.gridColumn,
                  {
                    flex: 1,
                    borderLeft: '1px solid #000',
                    gap: 3,
                    marginLeft: '-1px',
                  },
                ]}
              >
                <View style={styles.flexRow}>
                  <Text style={styles.gridHeader}>(Name) </Text>
                  <Text style={styles.gridHeader}>(Position) </Text>
                  <Text style={styles.gridHeader}>(Religion) </Text>
                  <Text style={styles.gridHeader}>(Signature) </Text>
                </View>

                <View style={[styles.flexRow, { fontSize: 9 }]}>
                  <Text style={styles.value}>
                    {data.solemnizingOfficer?.name + ', ' || ''}
                  </Text>
                  <Text style={styles.value}>
                    {data.solemnizingOfficer?.position + ', ' || ''}
                  </Text>
                  <Text style={styles.value}>
                    {data.solemnizingOfficer?.religion + ', ' || ''}
                  </Text>
                  <Text style={styles.value}>{''}</Text>
                </View>
              </View>
            </View>

            {/* Twentieth Section */}
            <View style={styles.gridContainer}>
              {/* Column 1: Numbering */}
              <View
                style={[
                  styles.gridColumn,
                  { width: 100, borderRight: '1px solid #000' },
                ]}
              >
                <Text style={[styles.gridHeader, { fontSize: 9 }]}>
                  20a. WITNESSES (Print name and Signature Additional at the back)
                </Text>
              </View>

              {/* Column 2: Husband's Information */}
              <View
                style={[
                  styles.gridColumn,
                  { flex: 1, borderRight: '1px solid #000', padding: 0 },
                ]}
              >
                <Text style={styles.title}>Husband</Text>
                <View style={[styles.flexColumn, { padding: 5 }]}>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>
                      {data.husbandWitnesses?.name || ''}
                    </Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Signature:</Text>
                    <Text style={styles.value}>
                      {data.husbandWitnesses?.signature || ''}
                    </Text>
                  </View>
                </View>
                <View style={[styles.flexColumn, { padding: 5 }]}>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>
                      {data.husbandWitnesses?.name2 || ''}
                    </Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Signature:</Text>
                    <Text style={styles.value}>
                      {data.husbandWitnesses?.signature2 || ''}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Column 3: Wife's Information */}
              <View
                style={[
                  styles.gridColumn,
                  { flex: 1, borderRight: '1px solid #000', padding: 0 },
                ]}
              >
                <Text style={styles.title}>Wife</Text>
                <View style={[styles.flexColumn, { padding: 5 }]}>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>
                      {data.wifeWitnesses?.name || ''}
                    </Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Signature:</Text>
                    <Text style={styles.value}>
                      {data.wifeWitnesses?.signature || ''}
                    </Text>
                  </View>
                </View>
                <View style={[styles.flexColumn, { padding: 5 }]}>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>
                      {data.wifeWitnesses?.name2 || ''}
                    </Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Signature:</Text>
                    <Text style={styles.value}>
                      {data.wifeWitnesses?.signature2 || ''}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Twenty-First Section */}
            <View style={styles.gridContainer}>
              {/* Column 1: Received By */}
              <View
                style={[
                  styles.gridColumn,
                  { flex: 1, borderRight: '1px solid #000', padding: 0 },
                ]}
              >
                <Text
                  style={[
                    styles.title,
                    { textAlign: 'left', fontSize: 9, padding: 5 },
                  ]}
                >
                  21. RECEIVED BY
                </Text>
                <View style={[styles.flexColumn, { padding: 5 }]}>
                  <View style={[styles.flexColumn, { padding: 5 }]}>
                    <View style={styles.fieldContainer}>
                      <Text style={styles.label}>Signature:</Text>
                      <Text style={styles.value}>
                        {data.receivedBy?.signature || ''}
                      </Text>
                    </View>
                    <View style={styles.fieldContainer}>
                      <Text style={styles.label}>Name in Print:</Text>
                      <Text style={styles.value}>{data.receivedBy?.nameInPrint || ''}</Text>
                    </View>
                  </View>
                  <View style={[styles.flexColumn, { padding: 5 }]}>
                    <View style={styles.fieldContainer}>
                      <Text style={styles.label}>Title or Position:</Text>
                      <Text style={styles.value}>{data.receivedBy?.title || ''}</Text>
                    </View>
                    <View style={styles.fieldContainer}>
                      <Text style={styles.label}>Date:</Text>
                      <Text style={styles.value}>
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
              </View>

              {/* Column 2: Registered at Civil Registrar */}
              <View
                style={[
                  styles.gridColumn,
                  { flex: 1, borderRight: '1px solid #000', padding: 0 },
                ]}
              >
                <Text
                  style={[
                    styles.title,
                    { textAlign: 'left', fontSize: 9, padding: 5 },
                  ]}
                >
                  22. REGISTERED AT THE OFFICE OF THE CIVIL REGISTRAR
                </Text>
                <View style={[styles.flexColumn, { padding: 5 }]}>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Signature:</Text>
                    <Text style={styles.value}>
                      {data.registeredAtCivilRegistrar?.signature || ''}
                    </Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>
                      {data.registeredAtCivilRegistrar?.nameInPrint || ''}
                    </Text>
                  </View>
                </View>
                <View style={[styles.flexColumn, { padding: 5 }]}>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Title or Position:</Text>
                    <Text style={styles.value}>
                      {data.registeredAtCivilRegistrar?.title || ''}
                    </Text>
                  </View>
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Date:</Text>
                    <Text style={styles.value}>
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

            {/* Footer */}
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
              <Text style={styles.value}>{data.remarks || ''}</Text>
            </View>
          </View>,
        </View>
      </Page>
      <Page style={back.page} size="LEGAL">
        <View key={'secondPage'} style={[back.parentBorder, { padding: 0 }]}>
          <View style={[back.gridColumnParent, back.parentBorder]}>
            <Text style={back.title}>20b. WITNESSES (Print name and signature)</Text>
            <View style={back.gridRowParent}>
              <Text style={back.value2}>{" "}</Text>
              <Text style={back.value2}>{" "}</Text>
              <Text style={back.value2}>{" "}</Text>
              <Text style={back.value2}>{" "}</Text>
            </View>
            <View style={back.gridRowParent}>
              <Text style={back.value2}>{" "}</Text>
              <Text style={back.value2}>{" "}</Text>
              <Text style={back.value2}>{" "}</Text>
              <Text style={back.value2}>{" "}</Text>
            </View>
          </View>
          <View style={[back.parentBorder]}>
            <View style={back.centeredText}>
              <Text style={back.headerTitle}>Affidavit of solemnizing officer</Text>
            </View>
            <View style={[back.gridRowParent, back.paddingLeft]}>
              <Text style={[back.normalTitle, { flex: .5 }]}>I,  </Text>
              <Text style={back.value}>{" "}</Text>
              <Text style={back.title}>of legal age, Solemnizing Officer of</Text>
            </View>
            <View style={[back.gridRowParent]}>
              <Text style={[back.value]}>{" "}</Text>
              <Text style={[back.normalTitle, { width: 200 }]}>with address at</Text>
              <Text style={back.value}>{" "}</Text>
            </View>
            <View style={[back.gridRowParent]}>
              <Text style={back.title}>after having sworn to in accordane with law, do hereby depose and say:</Text>
            </View>
            <View style={[back.gridRowParent]}>
              <Text style={[back.normalTitle, back.longTitle]}>1. That I have solemnized the marriage between: </Text>
            </View>
            <View style={[back.gridRowParent]}>
              <Text style={back.value}>{" "}</Text>
              <Text style={back.normalTitle}>and  </Text>
              <Text style={back.value}>{" "}</Text>
            </View>
            <View style={[back.gridRowParent]}>
              <Text style={back.title}>after having sworn to in accordane with law, do hereby depose and say:</Text>
            </View>
            <View style={[back.gridRowParent]}>
              <Text style={back.normalTitle}>2.</Text>
              <View style={[back.gridColumnParent, { width: '3%', gap: 15 }]}>
                <Text style={back.radioBox}>{" "}</Text>
                <Text style={back.radioBox}>{" "}</Text>
                <Text style={back.radioBox}>{" "}</Text>
                <Text style={back.radioBox}>{" "}</Text>
                <Text style={back.radioBox}>{" "}</Text>
              </View>
              <View style={[back.gridColumnParent, { alignItems: 'flex-start' }]}>
                <Text style={back.title}>
                  a. That I have ascertained the qualifications of the contracting parties and have found
                  no legal impediment for them to marry as required by the Article 34 of the Family Code
                </Text>
                <Text style={[back.title, { marginTop: 5 }]}>b. That this marriage was performed in articulo mortis or at the point of death</Text>
                <View style={back.gridColumnChild}>
                  <View style={[back.gridRowChild, { paddingBottom: 0, marginTop: 5 }]}>
                    <Text style={[back.normalTitle, { width: 450, }]}>c. That the contracting party/ies</Text>
                    <Text style={back.value}>{"asd "}</Text>
                    <View style={back.gridRowChild}>
                      <Text style={back.normalTitle}>and</Text>
                      <Text style={back.value}>{"asd "}</Text>
                    </View>
                  </View>
                  <Text style={[back.normalTitle, { marginTop: -5 }]}>
                    being at the point of death and physically unable to sign
                    the foregoing certificate or marriage by signature or mark, one of the witnesses to the marriage; sign for
                    him or her by writing the dying party's name and beneath it, the witness' own signature preceded by
                    the preposition "By";
                  </Text>
                </View>
                <Text style={back.title}>
                  d. That the residence of either party is so located that there is no means of transportation to enable
                  concerned party/parties to appear personallay before the civil registrar
                </Text>
                <Text style={back.title}>
                  e. That the marriage was among Muslims or among members of Ethnic Cultural Communities and thath the
                  marriage was solemnized in accordance with tehir custom and practices
                </Text>
              </View>
            </View>
            <View style={[back.gridRowParent]}>
              <Text style={back.normalTitle}>
                3. That I took the necessary steps tp ascertain the ages and relationship of
                the contracting parties and that neither of them are under any legal impediment to marry each other.
              </Text>
            </View>
            <View style={[back.gridRowParent]}>
              <Text style={back.normalTitle}>
                4. That I am executing this affidavit to attest to the truthfulness of the foregoing statements for all legal intents and purposes.
              </Text>
            </View>
            <View style={[back.gridRowParent, back.marginLeft, { width: 'auto', marginTop: 10 }]}>
              <Text style={[back.title, { width: 'auto' }]}>
                In the truth whereof, I have affixed my signature below this
              </Text>
              <Text style={[back.value, back.marginLeft, { width: '50%' }]}>{" "}</Text>
            </View>
            <View style={[back.gridRowParent]}>
              <Text style={[back.normalTitle, { width: 100 }]}>
                day of
              </Text>
              <Text style={back.value}>{" "}</Text>
              <Text style={[back.normalTitle, { width: 20 }]}>at  </Text>
              <Text style={back.value}>{" "}</Text>
              <Text style={[back.normalTitle, { width: 200 }]}>
                Philippines.
              </Text>
            </View>
            <View style={[back.gridRowParent, { justifyContent: "space-between", marginTop: 20 }]}>
              <View style={{ alignItems: "center", width: "45%", }}>

              </View>
              <View style={{ alignItems: "center", width: "45%" }}>
                <Text style={[back.value, { width: "100%", textAlign: "center" }]}>
                  {""}
                </Text>
                <Text style={[styles.label, { fontSize: 9, textAlign: "center" }]}>
                  Signature of the Administering Officer
                </Text>
              </View>
            </View>
            <View style={[back.gridRowParent, { marginTop: 15 }]}>
              <View style={[back.gridRowChild, back.paddingLeft, { gap: 15 }]}>
                <Text style={[back.normalTitle, back.titleBold, {}]}>
                  SUBSCRIBE AND SWORN
                </Text>
                <Text style={back.normalTitle}>
                  to before me this
                </Text>
              </View>
              <Text style={[back.value, { width: '45%' }]}>{" "}</Text>
              <Text style={[back.normalTitle, { width: 100 }]}>day of</Text>
              <Text style={[back.value, { width: '60%' }]}>{" "}</Text>
            </View>
            <View style={back.gridRowParent}>
              <Text style={back.normalTitle}>at  </Text>
              <Text style={[back.value, { width: '80%' }]}>{" "}</Text>
              <Text style={back.title}>Philippines, affiant who exhibited to me his/her CTC/ valid ID</Text>
            </View>
            <View style={back.gridRowParent}>
              <Text style={back.value}>{" "}</Text>
              <Text style={[back.normalTitle, { width: 200 }]}>issued on  </Text>
              <Text style={back.value}>{" "}</Text>
              <Text style={back.normalTitle}>at</Text>
              <Text style={back.value}>{" "}</Text>
            </View>
            <View style={[back.gridRowParent, { justifyContent: "space-between", marginTop: 20 }]}>
              <View style={{ alignItems: "center", width: "45%", }}>
                <Text style={[back.value, { width: "100%", textAlign: "center" }]}>
                  {""}
                </Text>
                <Text style={[styles.label, { fontSize: 9, textAlign: "center" }]}>
                  Signature of the Administering Officer
                </Text>
              </View>
              <View style={{ alignItems: "center", width: "45%" }}>
                <Text style={[back.value, { width: "100%", textAlign: "center" }]}>
                  {""}
                </Text>
                <Text style={[styles.label, { fontSize: 9, textAlign: "center" }]}>
                  Position/Title/Designation
                </Text>
              </View>
            </View>
            <View style={[back.gridRowParent, { justifyContent: "space-between", marginTop: 20 }]}>
              <View style={{ alignItems: "center", width: "45%", }}>
                <Text style={[back.value, { width: "100%", textAlign: "center" }]}>
                  {""}
                </Text>
                <Text style={[styles.label, { fontSize: 9, textAlign: "center" }]}>
                  Name in Print
                </Text>
              </View>
              <View style={{ alignItems: "center", width: "45%" }}>
                <Text style={[back.value, { width: "100%", textAlign: "center" }]}>
                  {""}
                </Text>
                <Text style={[styles.label, { fontSize: 9, textAlign: "center" }]}>
                  Address
                </Text>
              </View>

            </View>
          </View>
          <View style={back.parentBorder}>
            <View style={back.centeredText}>
              <Text style={back.headerTitle}>Affidavit for delayed registration of marriage </Text>
            </View>

            {/* Opening paragraph */}
            <View style={[back.gridRowParent, back.paddingLeft]}>
              <Text style={[back.normalTitle, { flex: .5 }]}>I,  </Text>
              <Text style={[back.value, { minWidth: '20%' }]}>{" "}</Text>
              <Text style={back.title}>of legal age, single/married/divorced/widow/widower, </Text>
            </View>
            <View style={[back.gridRowParent]}>
              <Text style={[back.normalTitle, { flex: 1 }]}>with redsidence and postal address</Text>
              <Text style={[back.value, { flex: 1 }]}>{" "}</Text>
            </View>
            <View style={[back.gridRowParent]}>
              <Text style={[back.normalTitle, { width: 200, flex: 1 }]}>Philippines. affiant wgi exhibited to me his/her CTC/valid ID</Text>
              <Text style={[back.value, { flex: 1 }]}>{" "}</Text>
            </View>
            <View style={[back.gridRowParent]}>
              <Text style={[back.normalTitle, { width: 150 }]}>issued on</Text>
              <Text style={back.value}>{" "}</Text>
              <Text style={[back.normalTitle, { width: 70 }]}>at</Text>
              <Text style={back.value}>{" "}</Text>
            </View>

            {/* Section 1 */}
            <View style={back.gridColumnParent}>
              <View style={back.gridRowParent}>
                <Text style={back.title}>1. That I am the applicant for the delayed registration of</Text>
              </View>

              <View style={[back.gridRowParent, back.paddingLeft, { alignItems: 'flex-end' }]}>
                <View style={{ width: 50 }}>
                  <View style={back.radioBox}></View>
                </View>
                <Text style={[back.normalTitle, { width: 200 }]}>my marriage with</Text>
                <View style={[back.value, { width: 250 }]}></View>
                <Text style={[back.normalTitle, { width: 50 }]}>in</Text>
                <View style={[back.value, { width: 250 }]}></View>
                <Text style={[back.normalTitle, { width: 50 }]}>on</Text>
                <View style={[back.value, { width: 250 }]}></View>
              </View>

              <View style={[back.gridRowParent, back.paddingLeft, { alignItems: 'flex-end' }]}>
                <View style={{ width: 20, }}>
                  <View style={back.radioBox}></View>
                </View>
                <Text style={[back.normalTitle,]}>the marriage between</Text>
                <View style={[back.value, { flex: 1 }]}></View>
                <Text style={back.normalTitle}>and</Text>
                <View style={[back.value, { flex: 1 }]}></View>
              </View>

              <View style={[back.gridRowParent, back.marginLeft]}>
                <Text style={[back.normalTitle, { width: 20 }]}>in</Text>
                <View style={[back.value]}></View>
                <Text style={[back.normalTitle, { width: 20 }]}>on</Text>
                <View style={[back.value]}></View>
              </View>
            </View>

            {/* Section 2 */}
            <View style={back.gridColumnParent}>
              <View style={back.gridRowParent}>
                <Text style={back.normalTitle}>2. That said marriage was solemnized by</Text>
                <View style={[back.value, { width: 150 }]}>{"Juan De la Cruz"}</View>
                <Text style={back.normalTitle}>(Solemnizing Officer's name) under</Text>
              </View>

              <View style={[back.gridRowParent, back.paddingLeft]}>
                <View style={back.radioBox}></View>
                <Text style={back.normalTitle}>religious ceremony</Text>
                <View style={back.radioBox}></View>
                <Text style={back.normalTitle}>civil ceremony</Text>
                <View style={back.radioBox}></View>
                <Text style={back.normalTitle}>Muslim rites</Text>
                <View style={back.radioBox}></View>
                <Text style={back.normalTitle}>tribal rites</Text>
              </View>
            </View>

            {/* Section 3 */}
            <View style={back.gridColumnParent}>
              <Text style={back.normalTitle}>3. That the marriage was solemnized:</Text>
              <View style={[back.gridRowParent, back.paddingLeft, { alignItems: 'flex-end' }]}>
                <View style={{ width: 30, }}>
                  <View style={back.radioBox}></View>
                </View>
                <Text style={[back.normalTitle, { width: 225 }]}>a. with marriage license no.</Text>
                <View style={[back.value, { width: 125 }]}>{" "}</View>
                <Text style={[back.normalTitle, { width: 80 }]}>issued on </Text>
                <View style={[back.value, { width: 125 }]}>{" "}</View>
                <Text style={back.normalTitle}>at </Text>
                <View style={[back.value, { width: 125 }]}>{" "}</View>
              </View>
              <View style={[back.gridRowParent, back.paddingLeft, { alignItems: 'flex-end' }]}>
                <View style={{ width: 20, }}>
                  <View style={back.radioBox}></View>
                </View>
                <Text style={[back.normalTitle, { width: 80 }]}>b. under Article</Text>
                <View style={[back.value, { width: 250 }]}>{" "}</View>
                <Text style={back.normalTitle}>(marriages of exceptional character);</Text>
              </View>
            </View>

            {/* Section 4 */}
            <View style={back.gridColumnParent}>
              <View style={back.gridRowParent}>
                <Text style={back.normalTitle}>4. (If the applicant is either the wife or husband) That I am a citizen of </Text>
                <View style={[back.value, { width: 200 }]}>{" "}</View>
              </View>
              <View style={back.gridRowParent}>
                <Text style={back.normalTitle}>and my spouse is a citizen of  </Text>
                <View style={[back.value, { width: '80%' }]}>{" "}</View>
              </View>
            </View>
            <View style={back.gridColumnParent}>
              <View style={back.gridRowParent}>
                <Text style={back.normalTitle}>4. (If the applicant is other than the wife or husband) That the wife is a citizen of </Text>
                <View style={[back.value, { width: 150 }]}>{" "}</View>
              </View>
              <View style={back.gridRowParent}>
                <Text style={back.normalTitle}>and the husband is a citizen of</Text>
                <View style={[back.value, { width: '75%' }]}>{" "}</View>
              </View>
            </View>

            {/* Section 5 */}
            <View style={back.gridColumnParent}>
              <View style={back.gridRowParent}>
                <Text style={back.normalTitle}>5. That the reason for the delay in registering our/their marriage is</Text>
              </View>
              <View style={back.value}>{" "}</View>
            </View>

            {/* Section 6 */}
            <View style={back.gridColumnParent}>
              <Text style={back.normalTitle}>6. That I am executing this affidavit to attest to the truthfulness of the foregoing statements for all legal intents and purposes.</Text>
            </View>

            {/* Footer */}
            <View style={[back.gridRowParent, back.marginLeft, { width: 'auto', marginTop: 10 }]}>
              <Text style={[back.title, { width: 'auto' }]}>
                In the truth whereof, I have affixed my signature below this
              </Text>
              <Text style={[back.value, back.marginLeft, { width: '50%' }]}>{" "}</Text>
            </View>
            <View style={[back.gridRowParent]}>
              <Text style={[back.normalTitle, { width: 70 }]}>
                day of
              </Text>
              <Text style={back.value}>{" "}</Text>
              <Text style={[back.normalTitle, { width: 30 }]}>at</Text>
              <Text style={back.value}>{" "}</Text>
              <Text style={[back.normalTitle, { width: 150 }]}>
                Philippines.
              </Text>
            </View>

            <View style={[back.gridRowParent, { justifyContent: "space-between", marginTop: 20 }]}>
              <View style={{ alignItems: "center", width: "45%", }}>

              </View>
              <View style={{ alignItems: "center", width: "45%" }}>
                <Text style={[back.value, { width: "100%", textAlign: "center" }]}>
                  {""}
                </Text>
                <Text style={[styles.label, { fontSize: 9, textAlign: "center" }]}>
                  Signature of the Administering Officer
                </Text>
              </View>
            </View>
            <View style={[back.gridRowParent, { marginTop: 15 }]}>
              <View style={[back.gridRowChild, back.paddingLeft, { gap: 15 }]}>
                <Text style={[back.normalTitle, back.titleBold, {}]}>
                  SUBSCRIBE AND SWORN
                </Text>
                <Text style={back.normalTitle}>
                  to before me this
                </Text>
              </View>
              <Text style={[back.value, { width: '45%' }]}>{" "}</Text>
              <Text style={[back.normalTitle, { width: 100 }]}>day of</Text>
              <Text style={[back.value, { width: '60%' }]}>{" "}</Text>
            </View>
            <View style={back.gridRowParent}>
              <Text style={back.normalTitle}>at  </Text>
              <Text style={[back.value, { width: '80%' }]}>{" "}</Text>
              <Text style={back.title}>Philippines, affiant who exhibited to me his/her CTC/ valid ID</Text>
            </View>
            <View style={back.gridRowParent}>
              <Text style={back.value}>{" "}</Text>
              <Text style={[back.normalTitle, { width: 200 }]}>issued on  </Text>
              <Text style={back.value}>{" "}</Text>
              <Text style={back.normalTitle}>at</Text>
              <Text style={back.value}>{" "}</Text>
            </View>
            <View style={[back.gridRowParent, { justifyContent: "space-between", marginTop: 20 }]}>
              <View style={{ alignItems: "center", width: "45%", }}>
                <Text style={[back.value, { width: "100%", textAlign: "center" }]}>
                  {""}
                </Text>
                <Text style={[styles.label, { fontSize: 9, textAlign: "center" }]}>
                  Signature of the Administering Officer
                </Text>
              </View>
              <View style={{ alignItems: "center", width: "45%" }}>
                <Text style={[back.value, { width: "100%", textAlign: "center" }]}>
                  {""}
                </Text>
                <Text style={[styles.label, { fontSize: 9, textAlign: "center" }]}>
                  Position/Title/Designation
                </Text>
              </View>
            </View>

          </View>
        </View>
      </Page>
    </Document>
  );
};

export default MarriageCertificatePDF;
