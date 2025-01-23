import { MarriageFormData, Place } from '@/types/marriage-certificate'
import { formatDateTime } from '@/utils/date'
import { Document, Page, Text, View } from '@react-pdf/renderer'
import { sty } from '../death-certificate/stylish'
import { styles } from './marriage'

// Define styles for the PDF

// Helper functions to format data
// const formatName = (name: PersonName | null | undefined): string => {
//   if (!name) return ''
//   return `${name.first}${name.middle ? ` ${name.middle}` : ''} ${name.last}`
// }

const formatPlace = (place: Place | null | undefined): string => {
  if (!place) return ''
  const { cityMunicipality, province, country } = place
  return [cityMunicipality, province, country].filter(Boolean).join(', ')
}

// PDF Component
interface MarriageCertificatePDFProps {
  data: Partial<MarriageFormData>
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
    )
  }

  // Split the sections into two groups
  const firstPageSections = [
    // Husband's Information
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
        <View style={[sty.gridContainer, { borderBottom: 'none' }]}>
          {/* Left Grid: Province and City/Municipality */}
          <View style={sty.leftGrid}>
            <View style={sty.fieldContainer}>
              <Text style={sty.label}>Province:</Text>
              <Text style={sty.value}>{data.province || ''}</Text>
            </View>
            <View style={[sty.fieldContainer, { borderBottom: 'none' }]}>
              <Text style={sty.label}>City/Municipality:</Text>
              <Text style={sty.value}>{data.cityMunicipality || ''}</Text>
            </View>
          </View>

          {/* Right Grid: Registry No. */}
          <View style={sty.rightGrid}>
            <View style={sty.registryNoContainer}>
              <Text style={sty.label}>Registry No.:</Text>
              <Text style={sty.value}>{data.registryNo || ''}</Text>
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
              <Text style={styles.value}>{data.husbandFirstName || ''}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Middle Name:</Text>
              <Text style={styles.value}>
                {data.husbandMiddleName || ''}
              </Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Last Name:</Text>
              <Text style={styles.value}>{data.husbandLastName || ''}</Text>
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
              <Text style={styles.value}>{data.wifeFirstName || ''}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Middle Name:</Text>
              <Text style={styles.value}>{data.wifeMiddleName || ''}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Last Name:</Text>
              <Text style={styles.value}>{data.wifeLastName || ''}</Text>
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
              {data.husbandDateOfBirth
                ? formatDateTime(data.husbandDateOfBirth, {
                  monthFormat: 'numeric',
                  dayFormat: 'numeric',
                  yearFormat: 'numeric',
                })
                : ''}
            </Text>
            <Text style={styles.value}>
              {data.husbandAge ? `${data.husbandAge} y.o` : ''}
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
              {data.wifeDateOfBirth
                ? formatDateTime(data.wifeDateOfBirth, {
                  monthFormat: 'numeric',
                  dayFormat: 'numeric',
                  yearFormat: 'numeric',
                })
                : ''}
            </Text>
            <Text style={styles.value}>
              {data.wifeAge ? `${data.wifeAge} y.o` : ''}
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
              {formatPlace(data.husbandPlaceOfBirth) || ''}
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
              {formatPlace(data.wifePlaceOfBirth) || ''}
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
                {data.husbandSex || ''}
              </Text>
            </View>
            <View
              style={[
                styles.gridColumn,
                { padding: 5, borderLeft: '1px solid #000' },
              ]}
            >
              <Text style={styles.gridHeader}>(Citizenship)</Text>
              <Text style={styles.value}>
                {data.husbandCitizenship || ''}
              </Text>
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
                {data.wifeSex || ''}
              </Text>
            </View>
            <View
              style={[
                styles.gridColumn,
                { padding: 5, borderLeft: '1px solid #000' },
              ]}
            >
              <Text style={styles.gridHeader}>(Citizenship)</Text>
              <Text style={styles.value}>{data.wifeCitizenship || ''}</Text>
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
            <Text style={[styles.gridHeader, { fontSize: 8 }]}>
              (House no., St., Brgy, City/Municipality, Province, Country)
            </Text>
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.value}>
              <Text style={styles.value}>{data.husbandResidence || ''}</Text>
            </Text>
          </View>
        </View>

        {/* Column 3: Wife's Information */}
        <View style={[styles.gridColumn, { flex: 1, gap: 5 }]}>
          <View style={styles.flexRow}>
            <Text style={[styles.gridHeader, { fontSize: 8 }]}>
              (House no., St., Brgy, City/Municipality, Province, Country)
            </Text>
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.value}>
              <Text style={styles.value}>{data.wifeResidence || ''}</Text>
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
          <Text style={styles.gridHeader}>6. Religion/Religion Sect.</Text>
        </View>

        {/* Column 2: Husband's Information */}
        <View
          style={[
            styles.gridColumn,
            { flex: 1, borderRight: '1px solid #000', gap: 5 },
          ]}
        >
          <View style={styles.flexRow}>
            <Text style={styles.value}>{data.husbandReligion || ''}</Text>
          </View>
        </View>

        {/* Column 3: Wife's Information */}
        <View style={[styles.gridColumn, { flex: 1, gap: 5 }]}>
          <View style={styles.flexRow}>
            <Text style={styles.value}>{data.wifeReligion || ''}</Text>
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
            <Text style={styles.value}>{data.husbandCivilStatus || ''}</Text>
          </View>
        </View>

        {/* Column 3: Wife's Information */}
        <View style={[styles.gridColumn, { flex: 1, gap: 5 }]}>
          <View style={[styles.flexRow, { textTransform: 'uppercase' }]}>
            <Text style={styles.value}>{data.wifeCivilStatus || ''}</Text>
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
              {data.husbandFatherName?.first || ''}
            </Text>
            <Text style={styles.value}>
              {data.husbandFatherName?.middle || ''}
            </Text>
            <Text style={styles.value}>
              {data.husbandFatherName?.last || ''}
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
              {data.wifeFatherName?.first || ''}
            </Text>
            <Text style={styles.value}>
              {data.wifeFatherName?.middle || ''}
            </Text>
            <Text style={styles.value}>
              {data.wifeFatherName?.last || ''}
            </Text>
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
              {data.husbandFatherCitizenship || ''}
            </Text>
          </View>
        </View>

        {/* Column 3: Wife's Information */}
        <View style={[styles.gridColumn, { flex: 1, gap: 5 }]}>
          <View style={[styles.flexRow, { textTransform: 'uppercase' }]}>
            <Text style={styles.value}>
              {data.wifeFatherCitizenship || ''}
            </Text>
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
              {data.husbandMotherMaidenName?.first || ''}
            </Text>
            <Text style={styles.value}>
              {data.husbandMotherMaidenName?.middle || ''}
            </Text>
            <Text style={styles.value}>
              {data.husbandMotherMaidenName?.last || ''}
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
              {data.wifeMotherMaidenName?.first || ''}
            </Text>
            <Text style={styles.value}>
              {data.wifeMotherMaidenName?.middle || ''}
            </Text>
            <Text style={styles.value}>
              {data.wifeMotherMaidenName?.last || ''}
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
              {data.husbandMotherCitizenship || ''}
            </Text>
          </View>
        </View>

        {/* Column 3: Wife's Information */}
        <View style={[styles.gridColumn, { flex: 1, gap: 5 }]}>
          <View style={[styles.flexRow, { textTransform: 'uppercase' }]}>
            <Text style={styles.value}>
              {data.wifeMotherCitizenship || ''}
            </Text>
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
              {data.husbandConsentPerson?.name.first || ''}
            </Text>
            <Text style={styles.value}>
              {data.husbandConsentPerson?.name.middle || ''}
            </Text>
            <Text style={styles.value}>
              {data.husbandConsentPerson?.name.last || ''}
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
              {data.wifeConsentPerson?.name.first || ''}
            </Text>
            <Text style={styles.value}>
              {data.wifeConsentPerson?.name.middle || ''}
            </Text>
            <Text style={styles.value}>
              {data.wifeConsentPerson?.name.last || ''}
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
              {data.husbandConsentPerson?.relationship || ''}
            </Text>
          </View>
        </View>

        {/* Column 3: Wife's Information */}
        <View style={[styles.gridColumn, { flex: 1, gap: 5 }]}>
          <View style={[styles.flexRow, { textTransform: 'uppercase' }]}>
            <Text style={styles.value}>
              {data.wifeConsentPerson?.relationship || ''}
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
            <Text style={[styles.gridHeader, { fontSize: 8 }]}>
              (House no., St., Brgy, City/Municipality, Province, Country)
            </Text>
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.value}>
              <Text style={styles.value}>
                {data.husbandConsentPerson?.residence || ''}
              </Text>
            </Text>
          </View>
        </View>

        {/* Column 3: Wife's Information */}
        <View style={[styles.gridColumn, { flex: 1, gap: 5 }]}>
          <View style={styles.flexRow}>
            <Text style={[styles.gridHeader, { fontSize: 8 }]}>
              (House no., St., Brgy, City/Municipality, Province, Country)
            </Text>
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.value}>
              <Text style={styles.value}>
                {data.wifeConsentPerson?.residence || ''}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </View>,

    // Wife's Information
    <View key={'wifeInfo'}>
      {/* Fifteenth Section */}
      <View style={styles.gridContainer}>
        <View style={styles.gridColumn}>
          <Text style={styles.gridHeader}>15. Place of Marriage: </Text>
        </View>
        <View style={styles.gridColumn}>
          <Text style={styles.value}>
            {formatPlace(data.placeOfMarriage) || ''}
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
                {data.dateOfMarriage
                  ? formatDateTime(data.dateOfMarriage, {
                    monthFormat: 'numeric',
                    dayFormat: 'numeric',
                    yearFormat: 'numeric',
                  })
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
              <Text style={styles.value}>{data.timeOfMarriage || ''}</Text>
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
                {data.contractingPartiesSignature?.husband}
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
                {data.contractingPartiesSignature?.wife}
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
          <Text style={[styles.gridHeader, { fontSize: 8 }]}>
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
                {data.witnesses?.husband?.[0]?.name || ''}
              </Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Signature:</Text>
              <Text style={styles.value}>
                {data.witnesses?.husband?.[0]?.signature || ''}
              </Text>
            </View>
          </View>
          <View style={[styles.flexColumn, { padding: 5 }]}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>
                {data.witnesses?.husband?.[1]?.name || ''}
              </Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Signature:</Text>
              <Text style={styles.value}>
                {data.witnesses?.husband?.[1]?.signature || ''}
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
                {data.witnesses?.wife?.[0]?.name || ''}
              </Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Signature:</Text>
              <Text style={styles.value}>
                {data.witnesses?.wife?.[0]?.signature || ''}
              </Text>
            </View>
          </View>
          <View style={[styles.flexColumn, { padding: 5 }]}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>
                {data.witnesses?.wife?.[1]?.name || ''}
              </Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Signature:</Text>
              <Text style={styles.value}>
                {data.witnesses?.wife?.[1]?.signature || ''}
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
                <Text style={styles.value}>
                  {data.receivedBy?.name || ''}
                </Text>
              </View>
            </View>
            <View style={[styles.flexColumn, { padding: 5 }]}>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Title or Position:</Text>
                <Text style={styles.value}>
                  {data.receivedBy?.title || ''}
                </Text>
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
                {data.registeredAtCivilRegistrar?.name || ''}
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
  ]

  return (
    <Document>
      <Page size='LEGAL' style={styles.page}>
        {firstPageSections}
      </Page>
    </Document>
  )
}

export default MarriageCertificatePDF
