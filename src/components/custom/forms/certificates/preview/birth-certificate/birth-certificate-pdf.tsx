import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/birth-certificate-form-schema';
import { formatDateTime } from '@/utils/date';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { back } from './back';
import { styles } from './styles';

interface BirthCertificatePDFProps {
  data: Partial<BirthCertificateFormValues>;
}

const BirthCertificatePDF: React.FC<BirthCertificatePDFProps> = ({ data }) => {
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

  // Destructure nested objects for convenience
  const {
    registryNumber,
    province,
    cityMunicipality,
    childInfo,
    motherInfo,
    fatherInfo,
    parentMarriage,
    attendant,
    informant,
    preparedBy,
    receivedBy,
    registeredByOffice,
    hasAffidavitOfPaternity,
    affidavitOfPaternityDetails,
    isDelayedRegistration,
    affidavitOfDelayedRegistration,
    remarks,
  } = data;

  // For date fields that require splitting into month/day/year (child date of birth, parent marriage date)
  const childDOB = childInfo?.dateOfBirth
    ? new Date(childInfo.dateOfBirth)
    : null;
  const parentMarriageDate = parentMarriage?.date
    ? new Date(parentMarriage.date)
    : null;

  return (
    <Document>
      {/* Front Page */}
      <Page size='LEGAL' style={styles.page}>
        {/* Parent Grid Container */}
        <View style={{ border: '1px solid #000' }}>
          <View style={[styles.header, { padding: 5 }]}>
            <View style={styles.municipal}>
              <Text>Municipal Form No. 102</Text>
              <Text style={styles.headerNote1}>Revised August 2016</Text>
            </View>
            <View style={styles.republic}>
              <Text style={styles.headerSubtitle}>
                Republic of the Philippines
              </Text>
              <Text style={styles.headerSubtitle}>
                OFFICE OF THE CIVIL REGISTRAR GENERAL
              </Text>
              <Text style={styles.headerTitle}>CERTIFICATE OF LIVE BIRTH</Text>
            </View>
            <View>
              <Text style={styles.headerNote2}>
                (To be accomplished in quadruplicate using black ink)
              </Text>
            </View>
          </View>
          {/* Registry Information */}
          <View>
            <View style={styles.gridContainer}>
              {/* Left Grid: Province and City/Municipality */}
              <View style={styles.leftGrid}>
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Province:</Text>
                  <Text style={styles.value}>
                    {province === 'Metro Manila' ? '' : province || ''}
                  </Text>
                </View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>City/Municipality:</Text>
                  <Text style={styles.value}>{cityMunicipality || ''}</Text>
                </View>
              </View>

              {/* Right Grid: Registry No. */}
              <View style={styles.rightGrid}>
                <View style={styles.registryNoContainer}>
                  <Text style={styles.label}>Registry No.:</Text>
                  <Text style={styles.value}>{registryNumber || ''}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Child Information */}
          <View>
            <View style={styles.gridContainer}>
              <View style={styles.childLabelGrid}>
                <Text style={styles.verticalText}>
                  C{'\n'}H{'\n'}I{'\n'}L{'\n'}D
                </Text>
              </View>
              <View style={styles.leftGrid}>
                {/* Name Field */}
                <View style={[styles.nameFieldContainer, { padding: 3 }]}>
                  <Text style={styles.nameLabel}>Name:</Text>
                  <View style={styles.nameInputContainer}>
                    <Text style={styles.nameInput}>(First Name)</Text>
                    <Text style={styles.nameInput}>(Middle Name)</Text>
                    <Text style={styles.nameInput}>(Last Name)</Text>
                  </View>
                  <View style={styles.nameInputContainer}>
                    <Text style={styles.nameInput}>
                      {childInfo?.firstName || ''}
                    </Text>
                    <Text style={styles.nameInput}>
                      {childInfo?.middleName || ''}
                    </Text>
                    <Text style={styles.nameInput}>
                      {childInfo?.lastName || ''}
                    </Text>
                  </View>
                </View>

                {/* Sex and Date of Birth Field */}
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottom: '1px solid #000',
                  }}
                >
                  <View style={styles.sexGrid}>
                    <Text style={styles.sexLabel}>Sex:</Text>
                    <Text style={styles.sexValue}>{childInfo?.sex || ''}</Text>
                  </View>
                  <View style={{ width: '85%' }}>
                    <View style={styles.dateFieldContainer}>
                      <Text style={styles.dateLabel}>Date of Birth:</Text>
                      <View style={styles.dateInputContainer}>
                        <Text style={styles.dateInput}>(Month)</Text>
                        <Text style={styles.dateInput}>(Day)</Text>
                        <Text style={styles.dateInput}>(Year)</Text>
                      </View>
                      <View style={styles.dateInputContainer}>
                        <Text style={styles.dateInput}>
                          {childInfo?.dateOfBirth
                            ? new Date(childInfo.dateOfBirth).getMonth() + 1
                            : ''}
                        </Text>
                        <Text style={styles.dateInput}>
                          {childInfo?.dateOfBirth
                            ? new Date(childInfo.dateOfBirth).getDate()
                            : ''}
                        </Text>
                        <Text style={styles.dateInput}>
                          {childInfo?.dateOfBirth
                            ? new Date(childInfo.dateOfBirth).getFullYear()
                            : ''}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Place of Birth Field */}
                <View style={styles.placeOfBirthContainer}>
                  <View style={styles.placeOfBirthColumn}>
                    <Text style={styles.placeOfBirthLabel}>Hospital:</Text>
                    <Text style={styles.placeOfBirthValue}>
                      {childInfo?.placeOfBirth?.hospital || ''}
                    </Text>
                  </View>
                  <View style={styles.placeOfBirthColumn}>
                    <Text style={styles.placeOfBirthLabel}>
                      City/Municipality:
                    </Text>
                    <Text style={styles.placeOfBirthValue}>
                      {childInfo?.placeOfBirth?.cityMunicipality || ''}
                    </Text>
                  </View>
                  <View style={styles.placeOfBirthColumn}>
                    <Text style={styles.placeOfBirthLabel}>Province:</Text>
                    <Text style={styles.placeOfBirthValue}>
                      {childInfo?.placeOfBirth?.province === 'Metro Manila'
                        ? ''
                        : childInfo?.placeOfBirth?.province || ''}
                    </Text>
                  </View>
                </View>

                {/* Bottom Grid: Type of Birth, Multiple Birth, Birth Order, Weight at Birth */}
                <View style={styles.bottomGridContainer}>
                  <View style={styles.bottomGridColumn}>
                    <Text style={styles.bottomGridLabel}>Type of Birth:</Text>
                    <Text style={styles.bottomGridValue}>
                      {childInfo?.typeOfBirth || ''}
                    </Text>
                  </View>
                  <View style={styles.bottomGridColumn}>
                    <Text style={styles.bottomGridLabel}>
                      Multiple Birth Order:
                    </Text>
                    <Text style={styles.bottomGridValue}>
                      {childInfo?.multipleBirthOrder || ''}
                    </Text>
                  </View>
                  <View style={styles.bottomGridColumn}>
                    <Text style={styles.bottomGridLabel}>Birth Order:</Text>
                    <Text style={styles.bottomGridValue}>
                      {childInfo?.birthOrder || ''}
                    </Text>
                  </View>
                  <View style={styles.bottomGridColumn}>
                    <Text style={styles.bottomGridLabel}>Weight at Birth:</Text>
                    <Text style={styles.bottomGridValue}>
                      {childInfo?.weightAtBirth || ''}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Mother's Information */}
          <View>
            <View style={styles.gridContainer}>
              <View style={styles.motherLabelGrid}>
                <Text style={styles.verticalText}>
                  M{'\n'}O{'\n'}T{'\n'}H{'\n'}E{'\n'}R
                </Text>
              </View>
              <View style={styles.leftGrid}>
                {/* Name Field */}
                <View style={[styles.nameFieldContainer, { padding: 3 }]}>
                  <Text style={styles.nameLabel}>Name:</Text>
                  <View style={styles.nameInputContainer}>
                    <Text style={styles.nameInput}>(First Name)</Text>
                    <Text style={styles.nameInput}>(Middle Name)</Text>
                    <Text style={styles.nameInput}>(Last Name)</Text>
                  </View>
                  <View style={styles.nameInputContainer}>
                    <Text style={styles.nameInput}>
                      {motherInfo?.firstName || ''}
                    </Text>
                    <Text style={styles.nameInput}>
                      {motherInfo?.middleName || ''}
                    </Text>
                    <Text style={styles.nameInput}>
                      {motherInfo?.lastName || ''}
                    </Text>
                  </View>
                </View>

                {/* Citizenship and Religion Field */}
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottom: '1px solid #000',
                  }}
                >
                  <View style={{ width: '50%', borderRight: '1px solid #000' }}>
                    <View
                      style={[
                        styles.fieldContainer,
                        { flexDirection: 'column', padding: 1 },
                      ]}
                    >
                      <Text style={styles.label}>Citizenship:</Text>
                      <Text style={styles.value}>
                        {motherInfo?.citizenship || ''}
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: '50%' }}>
                    <View
                      style={[
                        styles.fieldContainer,
                        { flexDirection: 'column', padding: 1 },
                      ]}
                    >
                      <Text style={styles.label}>Religion:</Text>
                      <Text style={styles.value}>
                        {motherInfo?.religion || ''}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Additional Fields */}
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottom: '1px solid #000',
                  }}
                >
                  <View style={{ width: '25%', borderRight: '1px solid #000' }}>
                    <View
                      style={[
                        styles.fieldContainer,
                        { flexDirection: 'column', padding: 7.3 },
                      ]}
                    >
                      <Text style={styles.label}>
                        Total Children Born Alive:
                      </Text>
                      <Text style={styles.value}>
                        {motherInfo?.totalChildrenBornAlive || ''}
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: '25%', borderRight: '1px solid #000' }}>
                    <View
                      style={[
                        styles.fieldContainer,
                        { flexDirection: 'column', padding: 7.3 },
                      ]}
                    >
                      <Text style={styles.label}>Children Now Dead:</Text>
                      <Text style={styles.value}>
                        {motherInfo?.childrenNowDead || ''}
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: '25%', borderRight: '1px solid #000' }}>
                    <View
                      style={[
                        styles.fieldContainer,
                        { flexDirection: 'column', padding: 7.3 },
                      ]}
                    >
                      <Text style={styles.label}>Occupation:</Text>
                      <Text style={styles.value}>
                        {motherInfo?.occupation || ''}
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: '25%' }}>
                    <View
                      style={[
                        styles.fieldContainer,
                        { flexDirection: 'column', padding: 3 },
                      ]}
                    >
                      <Text style={styles.label}>
                        Age at time of this birth(completed years):
                      </Text>
                      <Text style={styles.value}>{motherInfo?.age || ''}</Text>
                    </View>
                  </View>
                </View>

                {/* Residence Grid */}
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ width: '40%', borderRight: '1px solid #000' }}>
                    <View
                      style={[
                        styles.fieldContainer,
                        { flexDirection: 'column', border: 'none' },
                      ]}
                    >
                      <Text style={[styles.label]}>Residence:</Text>
                      <Text style={styles.value}>
                        {`${motherInfo?.residence?.houseNo || ''} ${
                          motherInfo?.residence?.st || ''
                        }, Brgy. ${motherInfo?.residence?.barangay || ''}`}
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: '20%', borderRight: '1px solid #000' }}>
                    <View
                      style={[
                        styles.fieldContainer,
                        { flexDirection: 'column', padding: 1 },
                      ]}
                    >
                      <Text style={styles.label}>City/Municipality:</Text>
                      <Text style={styles.value}>
                        {motherInfo?.residence?.cityMunicipality || ''}
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: '20%', borderRight: '1px solid #000' }}>
                    <View
                      style={[
                        styles.fieldContainer,
                        { flexDirection: 'column', padding: 1 },
                      ]}
                    >
                      <Text style={styles.label}>Province:</Text>
                      <Text style={styles.value}>
                        {motherInfo?.residence?.province === 'Metro Manila'
                          ? ''
                          : motherInfo?.residence?.province || ''}
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: '20%' }}>
                    <View
                      style={[
                        styles.fieldContainer,
                        { flexDirection: 'column', padding: 1 },
                      ]}
                    >
                      <Text style={styles.label}>Country:</Text>
                      <Text style={styles.value}>
                        {motherInfo?.residence?.country || ''}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Father's Information */}
          <View>
            <View style={styles.gridContainer}>
              <View style={styles.fatherLabelGrid}>
                <Text style={styles.verticalText}>
                  F{'\n'}A{'\n'}T{'\n'}H{'\n'}E{'\n'}R
                </Text>
              </View>
              <View style={styles.leftGrid}>
                {/* Name Field */}
                <View style={[styles.nameFieldContainer, { padding: 3 }]}>
                  <Text style={styles.nameLabel}>Name:</Text>
                  <View style={styles.nameInputContainer}>
                    <Text style={styles.nameInput}>(First Name)</Text>
                    <Text style={styles.nameInput}>(Middle Name)</Text>
                    <Text style={styles.nameInput}>(Last Name)</Text>
                  </View>
                  <View style={styles.nameInputContainer}>
                    <Text style={styles.nameInput}>
                      {fatherInfo?.firstName || ''}
                    </Text>
                    <Text style={styles.nameInput}>
                      {fatherInfo?.middleName || ''}
                    </Text>
                    <Text style={styles.nameInput}>
                      {fatherInfo?.lastName || ''}
                    </Text>
                  </View>
                </View>

                {/* Citizenship, Religion, Occupation, and Age Field */}
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottom: '1px solid #000',
                  }}
                >
                  <View style={{ width: '25%', borderRight: '1px solid #000' }}>
                    <View
                      style={[
                        styles.fieldContainer,
                        { flexDirection: 'column', padding: 7 },
                      ]}
                    >
                      <Text style={styles.label}>Citizenship:</Text>
                      <Text style={styles.value}>
                        {fatherInfo?.citizenship || ''}
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: '25%', borderRight: '1px solid #000' }}>
                    <View
                      style={[
                        styles.fieldContainer,
                        { flexDirection: 'column', padding: 7 },
                      ]}
                    >
                      <Text style={styles.label}>Religion:</Text>
                      <Text style={styles.value}>
                        {fatherInfo?.religion || ''}
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: '25%', borderRight: '1px solid #000' }}>
                    <View
                      style={[
                        styles.fieldContainer,
                        { flexDirection: 'column', padding: 7 },
                      ]}
                    >
                      <Text style={styles.label}>Occupation:</Text>
                      <Text style={styles.value}>
                        {fatherInfo?.occupation || ''}
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: '25%' }}>
                    <View
                      style={[
                        styles.fieldContainer,
                        { flexDirection: 'column', padding: 2.5 },
                      ]}
                    >
                      <Text style={styles.label}>
                        Age at time of this birth(completed years):
                      </Text>
                      <Text style={styles.value}>{fatherInfo?.age || ''}</Text>
                    </View>
                  </View>
                </View>

                {/* Residence Grid */}
                <View
                  style={{
                    flexDirection: 'row',
                    borderBottom: '1px solid #000',
                  }}
                >
                  <View style={{ width: '40%', borderRight: '1px solid #000' }}>
                    <View
                      style={[
                        styles.fieldContainer,
                        { flexDirection: 'column', padding: 1 },
                      ]}
                    >
                      <Text style={[styles.label]}>Residence:</Text>
                      <Text style={styles.value}>
                        {`${fatherInfo?.residence?.houseNo || ''} ${
                          fatherInfo?.residence?.st || ''
                        }, ${fatherInfo?.residence?.barangay || ''}`}
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: '20%', borderRight: '1px solid #000' }}>
                    <View
                      style={[
                        styles.fieldContainer,
                        { flexDirection: 'column', padding: 1 },
                      ]}
                    >
                      <Text style={styles.label}>City/Municipality:</Text>
                      <Text style={styles.value}>
                        {fatherInfo?.residence?.cityMunicipality || ''}
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: '20%', borderRight: '1px solid #000' }}>
                    <View
                      style={[
                        styles.fieldContainer,
                        { flexDirection: 'column', padding: 1 },
                      ]}
                    >
                      <Text style={styles.label}>Province:</Text>
                      <Text style={styles.value}>
                        {fatherInfo?.residence?.province === 'Metro Manila'
                          ? ''
                          : fatherInfo?.residence?.province || ''}
                      </Text>
                    </View>
                  </View>
                  <View style={{ width: '20%' }}>
                    <View
                      style={[
                        styles.fieldContainer,
                        { flexDirection: 'column', padding: 1 },
                      ]}
                    >
                      <Text style={styles.label}>Country:</Text>
                      <Text style={styles.value}>
                        {fatherInfo?.residence?.country || ''}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Marriage of Parents */}
          <View style={styles.sectionGrid}>
            <Text style={[styles.title, { padding: 5 }]}>
              Marriage of Parents
            </Text>
            <View style={[styles.marriageGridContainer]}>
              {/* Left Grid: Date */}
              <View style={[styles.marriageLeftGrid, { padding: 5 }]}>
                <Text style={styles.label}>Date:</Text>
                <View style={[styles.dateInputContainer]}>
                  <Text style={styles.dateInput}>(Month)</Text>
                  <Text style={styles.dateInput}>(Day)</Text>
                  <Text style={styles.dateInput}>(Year)</Text>
                </View>
                <View style={[styles.dateInputContainer]}>
                  <Text style={styles.dateInput}>
                    {parentMarriage?.date
                      ? parentMarriage.date.getMonth() + 1
                      : ''}
                  </Text>
                  <Text style={styles.dateInput}>
                    {parentMarriage?.date ? parentMarriage.date.getDate() : ''}
                  </Text>
                  <Text style={styles.dateInput}>
                    {parentMarriage?.date
                      ? parentMarriage.date.getFullYear()
                      : ''}
                  </Text>
                </View>
              </View>

              {/* Right Grid: Place */}
              <View style={[styles.marriageRightGrid, { padding: 5 }]}>
                <Text style={styles.label}>Place:</Text>
                <View style={[styles.dateInputContainer]}>
                  <Text style={styles.dateInput}>(City/Municipality)</Text>
                  <Text style={styles.dateInput}>(Province)</Text>
                  <Text style={styles.dateInput}>(Country)</Text>
                </View>
                <View style={[styles.dateInputContainer]}>
                  <Text style={styles.dateInput}>
                    {parentMarriage?.place?.cityMunicipality || ''}
                  </Text>
                  <Text style={styles.dateInput}>
                    {parentMarriage?.place?.province || ''}
                  </Text>
                  <Text style={styles.dateInput}>
                    {parentMarriage?.place?.country || ''}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Attendant */}
          <View style={styles.sectionGrid}>
            <Text style={styles.label}>Attendant:</Text>
            <Text style={styles.value}>
              {attendant?.type || ''} - {attendant?.certification?.name || ''}
            </Text>
          </View>

          {/* Certification of Attendant at Birth */}
          <View style={[styles.sectionGrid, { padding: 3 }]}>
            <Text style={[styles.label, { fontSize: 10 }]}>
              CERTIFICATION OF ATTENDANT AT BIRTH
            </Text>
            <Text style={[styles.value, { fontSize: 10 }]}>
              I hereby certify that I attended the birth of the child who was
              born alive at{' '}
              <Text style={{ textDecoration: 'underline' }}>
                {attendant?.certification?.time
                  ? new Intl.DateTimeFormat('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    }).format(new Date(attendant.certification.time))
                  : ''}
              </Text>{' '}
              on the date of birth specified above.
            </Text>
            <View style={{ flexDirection: 'row', marginTop: 3 }}>
              <View style={{ width: '50%' }}>
                <Text style={[styles.label, { fontSize: 10 }]}>Signature:</Text>
                <Text style={[styles.value, { fontSize: 10 }]}>
                  <Text style={{ textDecoration: 'underline' }}>
                    {attendant?.certification?.signature || ''}
                  </Text>
                </Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text style={[styles.label, { fontSize: 10 }]}>Address:</Text>
                <Text style={[styles.value, { fontSize: 10 }]}>
                  {`${attendant?.certification?.address?.houseNo || ''} ${
                    attendant?.certification?.address?.st || ''
                  }, ${attendant?.certification?.address?.barangay || ''}, ${
                    attendant?.certification?.address?.cityMunicipality || ''
                  }, ${attendant?.certification?.address?.province || ''}, ${
                    attendant?.certification?.address?.country || ''
                  }`}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 3 }}>
              <View style={{ width: '50%' }}>
                <Text style={[styles.label, { fontSize: 10 }]}>
                  Name in Print:
                </Text>
                <Text style={[styles.value, { fontSize: 10 }]}>
                  {attendant?.certification?.name || ''}
                </Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text style={[styles.label, { fontSize: 10 }]}>
                  Title or Position:
                </Text>
                <Text style={[styles.value, { fontSize: 10 }]}>
                  {attendant?.certification?.title || ''}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 3 }}>
              <View style={{ width: '50%' }}>
                <Text style={[styles.label, { fontSize: 10 }]}>Date:</Text>
                <Text style={[styles.value, { fontSize: 10 }]}>
                  {attendant?.certification?.date
                    ? formatDateTime(attendant.certification.date, {
                        monthFormat: 'numeric',
                        dayFormat: 'numeric',
                        yearFormat: 'numeric',
                      })
                    : ''}
                </Text>
              </View>
            </View>
          </View>

          {/* Certification Informant and Prepared By */}
          <View style={{ flexDirection: 'row' }}>
            {/* Certification Informant */}
            <View
              style={[
                styles.sectionGrid,
                { width: '50%', borderRight: '1px solid #000', padding: 3 },
              ]}
            >
              <Text style={[styles.label, { fontSize: 10 }]}>
                CERTIFICATION INFORMAT
              </Text>
              <Text style={[styles.value, { fontSize: 10 }]}>
                I hereby certify that all information supplied are true and
                correct to my own knowledge and belief.
              </Text>
              <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 10 }]}>
                    Signature:
                  </Text>
                  <Text style={[styles.value, { fontSize: 10 }]}>
                    <Text style={{ textDecoration: 'underline' }}>
                      {informant?.signature || ''}
                    </Text>
                  </Text>
                </View>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 10 }]}>
                    Name in Print:
                  </Text>
                  <Text style={[styles.value, { fontSize: 10 }]}>
                    {informant?.name || ''}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 10 }]}>
                    Relationship to the Child:
                  </Text>
                  <Text style={[styles.value, { fontSize: 10 }]}>
                    {informant?.relationship || ''}
                  </Text>
                </View>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 10 }]}>Address:</Text>
                  <Text style={[styles.value, { fontSize: 10 }]}>
                    {`${informant?.address?.houseNo || ''} ${
                      informant?.address?.st || ''
                    }, ${informant?.address?.barangay || ''}, ${
                      informant?.address?.cityMunicipality || ''
                    }, ${informant?.address?.province || ''}, ${
                      informant?.address?.country || ''
                    }`}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 10 }]}>Date:</Text>
                  <Text style={[styles.value, { fontSize: 10 }]}>
                    {informant?.date
                      ? formatDateTime(informant.date, {
                          monthFormat: 'numeric',
                        })
                      : ''}
                  </Text>
                </View>
              </View>
            </View>

            {/* Prepared By */}
            <View style={[styles.sectionGrid, { width: '50%', padding: 3 }]}>
              <Text style={[styles.label, { fontSize: 10 }]}>PREPARED BY</Text>
              <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 10 }]}>
                    Signature:
                  </Text>
                  <Text style={[styles.value, { fontSize: 10 }]}>
                    <Text style={{ textDecoration: 'underline' }}>
                      {preparedBy?.signature || ''}
                    </Text>
                  </Text>
                </View>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 10 }]}>
                    Name in Print:
                  </Text>
                  <Text style={[styles.value, { fontSize: 10 }]}>
                    {preparedBy?.nameInPrint || ''}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 10 }]}>
                    Title or Position:
                  </Text>
                  <Text style={[styles.value, { fontSize: 10 }]}>
                    {preparedBy?.titleOrPosition || ''}
                  </Text>
                </View>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 10 }]}>Date:</Text>
                  <Text style={[styles.value, { fontSize: 10 }]}>
                    {preparedBy?.date
                      ? formatDateTime(preparedBy.date, {
                          monthFormat: 'numeric',
                        })
                      : ''}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Received By and Registered At Grids */}
          <View style={{ flexDirection: 'row' }}>
            {/* Received By */}
            <View style={[styles.sectionGrid, styles.receivedByGrid]}>
              <Text style={[styles.label, { fontSize: 10 }]}>RECEIVED BY</Text>
              <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 10 }]}>
                    Signature:
                  </Text>
                  <Text style={[styles.value, { fontSize: 10 }]}>
                    <Text style={{ textDecoration: 'underline' }}>
                      {receivedBy?.signature || ''}
                    </Text>
                  </Text>
                </View>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 10 }]}>
                    Name in Print:
                  </Text>
                  <Text style={[styles.value, { fontSize: 10 }]}>
                    {receivedBy?.nameInPrint || ''}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 10 }]}>
                    Title or Position:
                  </Text>
                  <Text style={[styles.value, { fontSize: 10 }]}>
                    {receivedBy?.titleOrPosition || ''}
                  </Text>
                </View>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 10 }]}>Date:</Text>
                  <Text style={[styles.value, { fontSize: 10 }]}>
                    {receivedBy?.date
                      ? formatDateTime(receivedBy.date, {
                          monthFormat: 'numeric',
                        })
                      : ''}
                  </Text>
                </View>
              </View>
            </View>

            {/* Registered At the Office of the Civil Registrar */}
            <View style={[styles.sectionGrid, styles.registeredAtGrid]}>
              <Text style={[styles.label, { fontSize: 10 }]}>
                REGISTERED AT THE OFFICE OF THE CIVIL REGISTRAR
              </Text>
              <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 10 }]}>
                    Signature:
                  </Text>
                  <Text style={[styles.value, { fontSize: 10 }]}>
                    <Text style={{ textDecoration: 'underline' }}>
                      {registeredByOffice?.signature || ''}
                    </Text>
                  </Text>
                </View>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 10 }]}>
                    Name in Print:
                  </Text>
                  <Text style={[styles.value, { fontSize: 10 }]}>
                    {registeredByOffice?.nameInPrint || ''}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 10 }]}>
                    Title or Position:
                  </Text>
                  <Text style={[styles.value, { fontSize: 10 }]}>
                    {registeredByOffice?.titleOrPosition || ''}
                  </Text>
                </View>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 10 }]}>Date:</Text>
                  <Text style={[styles.value, { fontSize: 10 }]}>
                    {registeredByOffice?.date
                      ? formatDateTime(registeredByOffice.date, {
                          monthFormat: 'numeric',
                        })
                      : ''}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Remarks Grid */}
          <View style={[styles.sectionGrid, styles.remarksGrid]}>
            <Text style={[styles.label, { fontSize: 10 }]}>Remarks:</Text>
            <Text style={[styles.value, { fontSize: 10 }]}>
              {remarks || ''}
            </Text>
          </View>
        </View>
      </Page>

      {/* Back Page */}
      <Page size='LEGAL' style={[back.page]}>
        <View style={back.container}>
          {/* AFFIDAVIT OF ACKNOWLEDGEMENT/ADMISSION OF PATERNITY */}
          <View style={[back.container, back.page]}>
            <View style={back.columnContainer}>
              <Text style={[back.headerTitle]}>
                AFFIDAVIT OF ACKNOWLEDGEMENT/ADMISSION OF PATERNITY
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  width: '100%',
                  fontSize: 8,
                }}
              >
                <Text style={back.headerSubtitle}>
                  (For births before 3 August 1988)
                </Text>
                <Text style={back.headerSubtitle}>
                  (For births on or after 3 August 1988)
                </Text>
              </View>
            </View>

            <View style={[back.formRow, { marginTop: 15 }]}>
              <Text style={[back.textStyle, { marginLeft: 40 }]}>I/We,</Text>
              <Text style={[back.textStyle, back.formField]}>
                {affidavitOfPaternityDetails?.father?.name || ''}
              </Text>
              <Text style={[back.textStyle, { marginLeft: 12 }]}>and</Text>
              <Text style={[back.textStyle, back.formField]}>
                {affidavitOfPaternityDetails?.mother?.name || ''}
              </Text>
              <Text style={[back.textStyle]}>,</Text>
            </View>

            <View style={back.formRow}>
              <Text style={[back.textStyle, { marginRight: 12 }]}>
                of legal age, am/are the natural mother and/or father of:
              </Text>
              <Text style={[back.textStyle, back.formFieldWide]}>
                {`${childInfo?.firstName || ''} ${
                  childInfo?.middleName || ''
                } ${childInfo?.lastName || ''}`}
              </Text>
              ,
              <Text style={[back.textStyle, { marginLeft: 12 }]}>who was </Text>
            </View>

            <View style={back.formRow}>
              <Text style={[back.textStyle, { marginRight: 12 }]}>
                born on:
              </Text>
              <Text
                style={[back.textStyle, back.signatureText, { marginLeft: 12 }]}
              >
                {childDOB ? childDOB.toLocaleDateString() : ''}
              </Text>
              <Text style={[back.textStyle, { marginLeft: 12 }]}>at</Text>
              <Text style={[back.textStyle, back.formFieldWider]}>
                {[
                  childInfo?.placeOfBirth?.hospital,
                  childInfo?.placeOfBirth?.cityMunicipality,
                  childInfo?.placeOfBirth?.province,
                ]
                  .filter(Boolean)
                  .join(', ')}
              </Text>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: 15,
              }}
            >
              <Text style={[back.textStyle, { marginLeft: 40 }]}>
                I am / We are executing this affidavit to attest to the
                truthfulness of the foregoing statements and for purposes
              </Text>
              <Text style={[back.textStyle]}>
                of acknowledgement of my/our child.
              </Text>
            </View>

            <View style={[back.rowContainer, { marginTop: 15 }]}>
              <View style={back.signatureBlock}>
                <Text style={[back.textStyle, back.signatureText]}>
                  {affidavitOfPaternityDetails?.father?.signature || ''}
                </Text>
                <Text style={[back.textStyle, back.captionText]}>
                  (Signature Over Printed Name of Father)
                </Text>
              </View>
              <View style={back.signatureBlock}>
                <Text style={[back.textStyle, back.signatureText]}>
                  {affidavitOfPaternityDetails?.mother?.signature || ''}
                </Text>
                <Text style={[back.textStyle, back.captionText]}>
                  (Signature Over Printed Name of Mother)
                </Text>
              </View>
            </View>

            <View style={[back.formRow, { marginTop: 15 }]}>
              <Text
                style={[back.textStyle, { marginRight: 20, marginLeft: 40 }]}
              >
                <Text
                  style={[
                    back.headerTitle,
                    { fontSize: 10, textTransform: 'uppercase' },
                  ]}
                >
                  Subscribed and sworn
                </Text>
                <Text style={[back.textStyle]}> to before me this </Text>
              </Text>
              <Text
                style={[
                  back.textStyle,
                  back.signatureText,
                  { marginLeft: 12, width: 70 },
                ]}
              >
                {affidavitOfPaternityDetails?.dateSworn
                  ? new Date(affidavitOfPaternityDetails.dateSworn).getDate()
                  : ''}
              </Text>
              <Text style={[back.textStyle, { marginLeft: 12 }]}>day of</Text>
              <Text
                style={[back.textStyle, back.formFieldWider, { width: 150 }]}
              >
                {affidavitOfPaternityDetails?.dateSworn
                  ? new Date(
                      affidavitOfPaternityDetails.dateSworn
                    ).toLocaleString('default', { month: 'long' })
                  : ''}
              </Text>
              <Text style={[back.textStyle]}>,</Text>
              <Text
                style={[
                  back.textStyle,
                  back.signatureText,
                  { marginLeft: 12, width: 70 },
                ]}
              >
                {affidavitOfPaternityDetails?.dateSworn
                  ? new Date(
                      affidavitOfPaternityDetails.dateSworn
                    ).getFullYear()
                  : ''}
              </Text>
            </View>

            <View style={back.formRow}>
              <Text style={[back.textStyle]}>
                <Text style={[back.textStyle]}>by </Text>
              </Text>
              <Text
                style={[back.textStyle, back.signatureText, { width: 180 }]}
              >
                {affidavitOfPaternityDetails?.father?.name || ''}
              </Text>
              <Text style={[back.textStyle, { marginLeft: 10 }]}>and</Text>
              <Text
                style={[
                  back.textStyle,
                  back.signatureText,
                  { marginLeft: 10, width: 180 },
                ]}
              >
                {affidavitOfPaternityDetails?.mother?.name || ''}
              </Text>
              <Text style={[back.textStyle]}>,</Text>
              <Text style={[back.textStyle, { marginLeft: 10 }]}>
                who exhibited to me his/her
              </Text>
            </View>

            <View style={back.formRow}>
              <Text style={[back.textStyle]}>CTC/valid ID: </Text>
              <Text
                style={[back.textStyle, back.signatureText, { width: '30%' }]}
              >
                {affidavitOfPaternityDetails?.ctcInfo?.number || ''}
              </Text>
              <Text style={[back.textStyle, { marginLeft: 10 }]}>
                issued on{' '}
              </Text>
              <Text
                style={[back.textStyle, back.signatureText, { width: '40%' }]}
              >
                {affidavitOfPaternityDetails?.ctcInfo?.dateIssued
                  ? new Date(
                      affidavitOfPaternityDetails.ctcInfo.dateIssued
                    ).toLocaleDateString()
                  : ''}
              </Text>
            </View>

            <View style={back.formRow}>
              <Text style={[back.textStyle]}>at </Text>
              <Text
                style={[back.textStyle, back.signatureText, { width: '40%' }]}
              >
                {affidavitOfPaternityDetails?.ctcInfo?.placeIssued || ''}
              </Text>
            </View>

            <View style={[back.rowContainer, { marginTop: 30 }]}>
              <View style={back.signatureBlock}>
                <Text style={[back.textStyle, back.signatureText]}>
                  {affidavitOfPaternityDetails?.adminOfficer?.signature || ''}
                </Text>
                <Text style={[back.textStyle, back.captionText]}>
                  (Signature of the Administering Officer)
                </Text>
              </View>
              <View style={back.signatureBlock}>
                <Text style={[back.textStyle, back.signatureText]}>
                  {affidavitOfPaternityDetails?.adminOfficer?.position || ''}
                </Text>
                <Text style={[back.textStyle, back.captionText]}>
                  (Position/Title Designation)
                </Text>
              </View>
            </View>

            <View style={[back.rowContainer, { marginTop: 30 }]}>
              <View style={back.signatureBlock}>
                <Text style={[back.textStyle, back.signatureText]}>
                  {affidavitOfPaternityDetails?.adminOfficer?.name || ''}
                </Text>
                <Text style={[back.textStyle, back.captionText]}>
                  (Name in Print)
                </Text>
              </View>
              <View style={back.signatureBlock}>
                <Text style={[back.textStyle, back.signatureText]}>
                  {[
                    affidavitOfPaternityDetails?.adminOfficer?.address
                      ?.barangay,
                    affidavitOfPaternityDetails?.adminOfficer?.address
                      ?.cityMunicipality,
                    affidavitOfPaternityDetails?.adminOfficer?.address
                      ?.province,
                    affidavitOfPaternityDetails?.adminOfficer?.address?.country,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </Text>
                <Text style={[back.textStyle, back.captionText]}>
                  (Address)
                </Text>
              </View>
            </View>
          </View>

          {/* AFFIDAVIT FOR DELAYED REGISTRATION OF BIRTH */}
          <View style={[back.container, back.page]}>
            <View style={back.columnContainer}>
              <Text style={[back.headerTitle]}>
                AFFIDAVIT FOR DELAYED REGISTRATION OF BIRTH
              </Text>
              <Text style={back.headerSubtitle}>
                (To be accomplished by the hospital/clinic administrator,
                father, mother, or guardian or the person himself if 18 years
                old or over.)
              </Text>
            </View>

            <View style={[back.formRow, { marginTop: 15 }]}>
              <Text style={[back.textStyle, { marginLeft: 40 }]}>I </Text>
              <Text style={[back.textStyle, back.formField]}>
                {affidavitOfDelayedRegistration?.affiant?.name || ''}
              </Text>
              <Text style={[back.textStyle, { marginLeft: 12 }]}>
                of legal age,{' '}
                {affidavitOfDelayedRegistration?.affiant?.civilStatus
                  ? affidavitOfDelayedRegistration.affiant.civilStatus.toLowerCase()
                  : ''}{' '}
                , with
              </Text>
            </View>

            <View style={back.formRow}>
              <Text style={[back.textStyle, { paddingRight: 10 }]}>
                residence and postal address at
              </Text>
              <Text
                style={[
                  back.textStyle,
                  back.formField,
                  { width: '80%', flexWrap: 'wrap' },
                ]}
              >
                {affidavitOfDelayedRegistration?.affiant?.address
                  ? `${
                      affidavitOfDelayedRegistration.affiant.address.houseNo ||
                      ''
                    } ${
                      affidavitOfDelayedRegistration.affiant.address.st || ''
                    }, ${
                      affidavitOfDelayedRegistration.affiant.address.barangay ||
                      ''
                    }, ${
                      affidavitOfDelayedRegistration.affiant.address
                        .cityMunicipality || ''
                    }, ${
                      affidavitOfDelayedRegistration.affiant.address.province ||
                      ''
                    }, ${
                      affidavitOfDelayedRegistration.affiant.address.country ||
                      ''
                    }`
                  : ''}
              </Text>
            </View>

            <View style={back.formRow}>
              <Text style={[back.textStyle, { paddingRight: 12 }]}>
                after having been duly sworn in accordance with law, do hereby
                depose and say:
              </Text>
            </View>

            <View
              style={[
                back.columnContainer,
                { marginLeft: 40, marginTop: 15, alignItems: 'flex-start' },
              ]}
            >
              <View
                style={[back.columnContainer, { alignItems: 'flex-start' }]}
              >
                <Text style={[back.textStyle]}>
                  1. That I am the applicant for the delayed registration of:
                </Text>
                <View style={[back.formRow, { marginLeft: 20 }]}>
                  <View style={back.radio}>
                    {affidavitOfDelayedRegistration?.registrationType ===
                      'SELF' && (
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'black',
                          margin: 'auto',
                        }}
                      />
                    )}
                  </View>
                  <Text style={[back.textStyle]}>My birth in</Text>
                  <Text
                    style={[
                      back.textStyle,
                      back.signatureText,
                      { marginLeft: 12, flexWrap: 'wrap', width: '35%' },
                    ]}
                  >
                    {affidavitOfDelayedRegistration?.registrationType === 'SELF'
                      ? childInfo?.placeOfBirth?.cityMunicipality || ''
                      : ''}
                  </Text>
                  <Text style={[back.textStyle, { paddingRight: 12 }]}>on</Text>
                  <Text
                    style={[
                      back.textStyle,
                      back.signatureText,
                      {
                        marginLeft: 12,
                        flexWrap: 'wrap',
                        width: '35%',
                        paddingRight: 12,
                      },
                    ]}
                  >
                    {affidavitOfDelayedRegistration?.registrationType ===
                      'SELF' && childInfo?.dateOfBirth
                      ? formatDateTime(childInfo.dateOfBirth, {
                          monthFormat: '2-digit',
                          dayFormat: '2-digit',
                          yearFormat: 'numeric',
                          showTime: false,
                        })
                      : null}
                  </Text>
                </View>

                <View style={[back.formRow, { marginLeft: 20 }]}>
                  <View style={back.radio}>
                    {affidavitOfDelayedRegistration?.registrationType ===
                      'OTHER' && (
                      <View
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'black',
                          margin: 'auto',
                        }}
                      />
                    )}
                  </View>
                  <Text style={[back.textStyle]}>the birth of</Text>
                  <Text
                    style={[
                      back.textStyle,
                      back.signatureText,
                      { marginLeft: 12, flexWrap: 'wrap', width: '35%' },
                    ]}
                  >
                    {`${childInfo?.firstName || ''} ${
                      childInfo?.lastName || ''
                    }`}
                  </Text>
                  <Text style={[back.textStyle, { paddingRight: 12 }]}>
                    who was born in
                  </Text>
                  <Text
                    style={[
                      back.textStyle,
                      back.signatureText,
                      { flexWrap: 'wrap', width: '25%', paddingRight: 12 },
                    ]}
                  >
                    {childInfo?.placeOfBirth?.cityMunicipality || ''}
                  </Text>
                </View>

                <View style={[back.formRow, { marginLeft: 20 }]}>
                  <Text style={[back.textStyle, { paddingRight: 12 }]}>on</Text>
                  <Text
                    style={[
                      back.textStyle,
                      back.signatureText,
                      { flexWrap: 'wrap', width: '35%', paddingRight: 12 },
                    ]}
                  >
                    {childInfo?.dateOfBirth
                      ? formatDateTime(childInfo.dateOfBirth, {
                          monthFormat: '2-digit',
                          dayFormat: '2-digit',
                          yearFormat: 'numeric',
                          showTime: false,
                        })
                      : ''}
                  </Text>
                </View>

                <View
                  style={[
                    back.formRow,
                    { alignItems: 'flex-start', flexWrap: 'wrap' },
                  ]}
                >
                  <Text style={[back.textStyle]}>
                    2. That I/he/she was attended at birth by
                  </Text>
                  <Text
                    style={[
                      back.textStyle,
                      back.signatureText,
                      { marginLeft: 12, width: '55%', paddingRight: 12 },
                    ]}
                  >
                    {attendant?.certification?.name || ''}
                  </Text>
                </View>

                <View
                  style={[back.formRow, { flexWrap: 'wrap', paddingLeft: 20 }]}
                >
                  <Text style={[back.textStyle]}>who resides at</Text>
                  <Text
                    style={[
                      back.textStyle,
                      back.signatureText,
                      { marginLeft: 12, width: '60%', paddingRight: 12 },
                    ]}
                  >
                    {attendant?.certification?.address
                      ? `${attendant.certification.address.houseNo || ''} ${
                          attendant.certification.address.st || ''
                        }, ${attendant.certification.address.barangay || ''}, ${
                          attendant.certification.address.cityMunicipality || ''
                        }, ${attendant.certification.address.province || ''}, ${
                          attendant.certification.address.country || ''
                        }`
                      : ''}
                  </Text>
                </View>

                <View
                  style={[
                    back.formRow,
                    { alignItems: 'flex-start', flexWrap: 'wrap' },
                  ]}
                >
                  <Text style={[back.textStyle]}>
                    3. That I am /he/she is a citizen of
                  </Text>
                  <Text
                    style={[
                      back.textStyle,
                      back.signatureText,
                      { marginLeft: 12, width: '55%', paddingRight: 12 },
                    ]}
                  >
                    {affidavitOfDelayedRegistration?.affiant?.citizenship || ''}
                  </Text>
                </View>

                <View style={[back.formRow, { flexWrap: 'wrap' }]}>
                  <Text style={[back.textStyle]}>
                    4. That my/his/her parents were
                  </Text>
                  <View style={[back.formRow, { marginLeft: 20 }]}>
                    <View style={back.radio}>
                      {affidavitOfDelayedRegistration?.parentMaritalStatus ===
                        'MARRIED' && (
                        <View
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'black',
                            margin: 'auto',
                          }}
                        />
                      )}
                    </View>
                    <Text style={[back.textStyle]}>married on</Text>
                    <Text
                      style={[
                        back.textStyle,
                        back.signatureText,
                        { marginLeft: 12, flexWrap: 'wrap', width: '35%' },
                      ]}
                    >
                      {parentMarriage?.date
                        ? formatDateTime(parentMarriage.date, {
                            monthFormat: '2-digit',
                            dayFormat: '2-digit',
                            yearFormat: 'numeric',
                            showTime: false,
                          })
                        : ''}
                    </Text>
                    <Text style={[back.textStyle, { paddingRight: 12 }]}>
                      at
                    </Text>
                    <Text
                      style={[
                        back.textStyle,
                        back.signatureText,
                        {
                          marginLeft: 12,
                          flexWrap: 'wrap',
                          width: '35%',
                          paddingRight: 12,
                        },
                      ]}
                    >
                      {parentMarriage?.place?.cityMunicipality || ''}
                    </Text>
                  </View>

                  <View style={[back.formRow, { marginLeft: 20 }]}>
                    <View style={back.radio}>
                      {affidavitOfDelayedRegistration?.parentMaritalStatus ===
                        'NOT_MARRIED' && (
                        <View
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'black',
                            margin: 'auto',
                          }}
                        />
                      )}
                    </View>
                    <Text style={[back.textStyle]}>
                      not married but I/he/she was acknowledged/not acknowledged
                      by my/his/her{' '}
                    </Text>
                  </View>

                  <View style={[back.formRow, { marginLeft: 20 }]}>
                    <Text style={[back.textStyle, { paddingRight: 12 }]}>
                      father whose name is
                    </Text>
                    <Text
                      style={[
                        back.textStyle,
                        back.signatureText,
                        { flexWrap: 'wrap', width: '70%' },
                      ]}
                    >
                      {`${fatherInfo?.firstName || ''} ${
                        fatherInfo?.lastName || ''
                      }`}
                    </Text>
                  </View>

                  <View
                    style={[
                      back.formRow,
                      {
                        marginTop: 15,
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                      },
                    ]}
                  >
                    <Text style={[back.textStyle]}>
                      5. That the reason for the delay in registering my/his/her
                      birth was
                    </Text>
                    <Text
                      style={[
                        back.textStyle,
                        back.signatureText,
                        { marginLeft: 12, width: '90%' },
                      ]}
                    >
                      {affidavitOfDelayedRegistration?.reasonForDelay || ''}
                    </Text>
                  </View>

                  <View
                    style={[
                      back.formRow,
                      { justifyContent: 'center', alignItems: 'flex-end' },
                    ]}
                  >
                    <Text style={[back.textStyle]}>
                      6. (For the applicant only) That I am married to
                    </Text>
                    <Text
                      style={[
                        back.textStyle,
                        back.signatureText,
                        { marginLeft: 12, width: '45%' },
                      ]}
                    >
                      {'Need Fixing here '}
                    </Text>
                  </View>

                  <View
                    style={[
                      back.formRow,
                      {
                        marginTop: 10,
                        alignItems: 'flex-end',
                        flexWrap: 'wrap',
                      },
                    ]}
                  >
                    <Text style={[back.textStyle]}>
                      (If the applicant is other than the document owner) That I
                      am the
                    </Text>
                    <Text
                      style={[
                        back.textStyle,
                        back.signatureText,
                        { marginLeft: 12, width: '30%' },
                      ]}
                    >
                      {'Need Fixing here '}
                    </Text>
                    <Text style={[back.textStyle]}>of the said person.</Text>
                  </View>

                  <View
                    style={[
                      back.formRow,
                      {
                        marginTop: 15,
                        paddingRight: 12,
                        alignItems: 'flex-end',
                        flexWrap: 'wrap',
                      },
                    ]}
                  >
                    <Text style={[back.textStyle]}>
                      7. That I am executing this affidavit to attest to the
                      truthfulness of the foregoing statements for all legal
                    </Text>
                    <Text style={back.textStyle}>intents and purposes.</Text>
                  </View>

                  <View
                    style={[
                      back.formRow,
                      { flexWrap: 'wrap', alignItems: 'flex-end' },
                    ]}
                  >
                    <Text style={[back.textStyle]}>
                      In truth whereof, I have affixed my signature below this
                    </Text>
                    <Text
                      style={[
                        back.textStyle,
                        back.signatureText,
                        { marginLeft: 8, width: '10%' },
                      ]}
                    >
                      {affidavitOfDelayedRegistration?.dateSworn
                        ? formatDateTime(
                            affidavitOfDelayedRegistration.dateSworn,
                            {
                              dayFormat: '2-digit',
                              showTime: false,
                            }
                          )
                        : ''}
                    </Text>
                    <Text style={[back.textStyle]}>day of</Text>
                    <Text
                      style={[
                        back.textStyle,
                        back.signatureText,
                        { marginLeft: 8, width: '25%' },
                      ]}
                    >
                      {affidavitOfDelayedRegistration?.dateSworn
                        ? formatDateTime(
                            affidavitOfDelayedRegistration.dateSworn,
                            {
                              monthFormat: 'long',
                              yearFormat: 'numeric',
                              showTime: false,
                            }
                          )
                        : ''}
                    </Text>
                    <Text style={[back.textStyle]}>at</Text>
                    <Text
                      style={[
                        back.textStyle,
                        back.signatureText,
                        { marginLeft: 8, width: '30%' },
                      ]}
                    >
                      {affidavitOfDelayedRegistration?.affiant?.address
                        ?.cityMunicipality || ''}
                    </Text>
                    <Text style={[back.textStyle]}>, Philippines.</Text>
                  </View>

                  <View
                    style={[
                      back.formRow,
                      { justifyContent: 'space-between', marginTop: 40 },
                    ]}
                  >
                    <View style={{ alignItems: 'center', width: '45%' }}>
                      <Text
                        style={[
                          back.textStyle,
                          back.signatureText,
                          { width: '100%', textAlign: 'center' },
                        ]}
                      >
                        {affidavitOfDelayedRegistration?.affiant?.name || ''}
                      </Text>
                      <Text
                        style={[
                          back.textStyle,
                          { fontSize: 8, textAlign: 'center' },
                        ]}
                      >
                        Affiant
                      </Text>
                    </View>
                    <View style={{ alignItems: 'center', width: '45%' }}>
                      <Text
                        style={[
                          back.textStyle,
                          back.signatureText,
                          { width: '100%', textAlign: 'center' },
                        ]}
                      >
                        {affidavitOfDelayedRegistration?.adminOfficer?.name ||
                          ''}
                      </Text>
                      <Text
                        style={[
                          back.textStyle,
                          { fontSize: 8, textAlign: 'center' },
                        ]}
                      >
                        Signature of the Administering Officer
                      </Text>
                    </View>
                  </View>

                  <View
                    style={[
                      back.formRow,
                      { flexWrap: 'wrap', alignItems: 'flex-end' },
                    ]}
                  >
                    <Text style={[back.textStyle]}>
                      SUBSCRIBED AND SWORN to before me this
                    </Text>
                    <Text
                      style={[
                        back.textStyle,
                        back.signatureText,
                        { marginLeft: 8, width: '10%' },
                      ]}
                    >
                      {affidavitOfDelayedRegistration?.dateSworn
                        ? formatDateTime(
                            affidavitOfDelayedRegistration.dateSworn,
                            {
                              dayFormat: '2-digit',
                              showTime: false,
                            }
                          )
                        : ''}
                    </Text>
                    <Text style={[back.textStyle]}>day of</Text>
                    <Text
                      style={[
                        back.textStyle,
                        back.signatureText,
                        { marginLeft: 8, width: '25%' },
                      ]}
                    >
                      {affidavitOfDelayedRegistration?.dateSworn
                        ? formatDateTime(
                            affidavitOfDelayedRegistration.dateSworn,
                            {
                              monthFormat: 'long',
                              yearFormat: 'numeric',
                              showTime: false,
                            }
                          )
                        : ''}
                    </Text>
                    <Text style={[back.textStyle]}>at</Text>
                    <Text
                      style={[
                        back.textStyle,
                        back.signatureText,
                        { marginLeft: 8, width: '30%' },
                      ]}
                    >
                      {affidavitOfDelayedRegistration?.affiant?.address
                        ?.cityMunicipality || ''}
                    </Text>
                    <Text style={[back.textStyle]}>
                      , Philippines, affiant who exhibited to me his/her
                      C.T.C/valid ID
                    </Text>
                  </View>

                  <View
                    style={[
                      back.formRow,
                      {
                        marginTop: 10,
                        alignItems: 'flex-end',
                        flexWrap: 'wrap',
                      },
                    ]}
                  >
                    <Text style={[back.textStyle]}>issued on</Text>
                    <Text
                      style={[
                        back.textStyle,
                        back.signatureText,
                        { marginLeft: 8, width: '30%' },
                      ]}
                    >
                      {affidavitOfDelayedRegistration?.ctcInfo?.dateIssued
                        ? formatDateTime(
                            affidavitOfDelayedRegistration.ctcInfo.dateIssued,
                            {
                              monthFormat: '2-digit',
                              dayFormat: '2-digit',
                              yearFormat: 'numeric',
                              showTime: false,
                            }
                          )
                        : ''}
                    </Text>
                    <Text style={[back.textStyle]}>at</Text>
                    <Text
                      style={[
                        back.textStyle,
                        back.signatureText,
                        { marginLeft: 8, width: '40%' },
                      ]}
                    >
                      {affidavitOfDelayedRegistration?.ctcInfo?.placeIssued ||
                        ''}
                    </Text>
                  </View>

                  <View
                    style={[
                      back.formRow,
                      { justifyContent: 'space-between', marginTop: 40 },
                    ]}
                  >
                    <View style={{ alignItems: 'center', width: '45%' }}>
                      <Text
                        style={[
                          back.textStyle,
                          back.signatureText,
                          { width: '100%', textAlign: 'center' },
                        ]}
                      >
                        {affidavitOfDelayedRegistration?.adminOfficer?.name ||
                          ''}
                      </Text>
                      <Text
                        style={[
                          back.textStyle,
                          { fontSize: 8, textAlign: 'center' },
                        ]}
                      >
                        Signature of the Administering Officer
                      </Text>
                    </View>
                    <View style={{ alignItems: 'center', width: '45%' }}>
                      <Text
                        style={[
                          back.textStyle,
                          back.signatureText,
                          { width: '100%', textAlign: 'center' },
                        ]}
                      >
                        {''}
                      </Text>
                      <Text
                        style={[
                          back.textStyle,
                          { fontSize: 8, textAlign: 'center' },
                        ]}
                      >
                        Position / Title / Designation
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default BirthCertificatePDF;
