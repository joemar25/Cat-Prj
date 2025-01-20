import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import { formatDateTime } from '@/utils/date';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

// Define styles for the PDF
export const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    borderBottom: '1px solid #000',
    paddingBottom: 3,
  },
  gridContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    border: '1px solid #000',
    marginBottom: 0, // Remove marginBottom to stick sections together
  },
  childLabelGrid: {
    width: '8%',
    padding: 1,
    borderRight: '1px solid #000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  motherLabelGrid: {
    width: '8%',
    padding: 1,
    borderRight: '1px solid #000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  fatherLabelGrid: {
    width: '8%',
    padding: 1,
    borderRight: '1px solid #000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  leftGrid: {
    width: '92%',
    padding: 0,
    borderRight: '1px solid #000',
  },
  rightGrid: {
    width: '50%', // Adjusted to 50% for two grids
    padding: 0,
  },
  fieldContainer: {
    flexDirection: 'row',
    marginBottom: 0,
    borderBottom: '1px solid #000',
  },
  nameFieldContainer: {
    width: '100%',
    flexDirection: 'column',
    marginBottom: 0,
    borderBottom: '1px solid #000',
  },
  nameLabel: {
    fontSize: 8,
    color: '#666',
    marginBottom: 1,
  },
  nameInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameInput: {
    width: '30%',
    fontSize: 8,
  },
  verticalText: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    width: '100%',
    fontSize: 8,
    color: '#666',
    marginBottom: 1,
  },
  value: {
    width: '100%',
    fontSize: 8,
    textAlign: 'center',
    marginTop: 1,
  },
  registryNoContainer: {
    flexDirection: 'column',
    padding: 5, // Add padding for better spacing
  },
  dateFieldContainer: {
    width: '100%',
    flexDirection: 'column',
    marginBottom: 0,
    borderBottom: '1px solid #000',
  },
  dateLabel: {
    fontSize: 8,
    color: '#666',
    marginBottom: 1,
  },
  dateInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    width: '30%',
    fontSize: 8,
  },
  sexGrid: {
    width: '15%',
    padding: 1,
    borderRight: '1px solid #000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  sexLabel: {
    fontSize: 8,
    color: '#666',
  },
  sexValue: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  placeOfBirthContainer: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
  },
  placeOfBirthColumn: {
    flex: 1,
    padding: 1,
    borderRight: '1px solid #000',
  },
  placeOfBirthLabel: {
    fontSize: 8,
    color: '#666',
  },
  placeOfBirthValue: {
    fontSize: 8,
  },
  bottomGridContainer: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
  },
  bottomGridColumn: {
    flex: 1,
    padding: 1,
    borderRight: '1px solid #000',
  },
  bottomGridLabel: {
    fontSize: 8,
    color: '#666',
  },
  bottomGridValue: {
    fontSize: 8,
  },
  marriageGridContainer: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
    marginBottom: 0, // Remove marginBottom to stick sections together
  },
  marriageLeftGrid: {
    width: '50%',
    padding: 1,
    borderRight: '1px solid #000',
  },
  marriageRightGrid: {
    width: '50%',
    padding: 1,
  },
  attendantGrid: {
    flexDirection: 'column',
    borderBottom: '1px solid #000',
    marginBottom: 0, // Remove marginBottom to stick sections together
    padding: 1,
  },
  certificationGrid: {
    flexDirection: 'column',
    borderBottom: '1px solid #000',
    marginBottom: 0, // Remove marginBottom to stick sections together
    padding: 1,
  },
  preparedByGrid: {
    flexDirection: 'row',
    marginBottom: 0, // Remove marginBottom to stick sections together
  },
  preparedByLeftGrid: {
    width: '50%',
    padding: 1,
    borderRight: '1px solid #000',
  },
  preparedByRightGrid: {
    width: '50%',
    padding: 1,
  },
  sectionGrid: {
    border: '1px solid #000',
    marginBottom: 0, // Remove marginBottom to stick sections together
    padding: 5,
  },
  receivedByGrid: {
    width: '50%',
    padding: 3,
    borderRight: '1px solid #000',
  },
  registeredAtGrid: {
    width: '50%',
    padding: 3,
  },
  remarksGrid: {
    width: '100%',
    padding: 3,
    borderTop: '1px solid #000',
  },
  header: {
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  municipal: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    fontSize: 10,
    gap: 5,
  },
  republic: {
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    fontWeight: 'extrabold',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 10,
    marginBottom: 5,
  },
  headerNote1: {
    fontSize: 10,
    marginBottom: 5,
    color: '#666',
  },
  headerNote2: {
    fontSize: 10,
    marginBottom: 5,
    color: '#666',
    width: 100,
  },
});

interface BirthCertificatePDFProps {
  data: Partial<BirthCertificateFormValues>;
}

const BirthCertificatePDF: React.FC<BirthCertificatePDFProps> = ({ data }) => {
  if (!Object.entries(data).length) {
    return (
      <Document>
        <Page size='A4' style={styles.page}>
          <View>
            <Text>No data available for preview.</Text>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        {/* Parent Grid Container */}
        <View style={{ border: '1px solid #000' }}>
          <View style={[styles.header, { padding: 10 }]}>
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
                  <Text style={styles.value}>{data.province || 'N/A'}</Text>
                </View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>City/Municipality:</Text>
                  <Text style={styles.value}>
                    {data.cityMunicipality || 'N/A'}
                  </Text>
                </View>
              </View>

              {/* Right Grid: Registry No. */}
              <View style={styles.rightGrid}>
                <View style={styles.registryNoContainer}>
                  <Text style={styles.label}>Registry No.:</Text>
                  <Text style={styles.value}>
                    {data.registryNumber || 'N/A'}
                  </Text>
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
                <View style={styles.nameFieldContainer}>
                  <Text style={styles.nameLabel}>Name:</Text>
                  <View style={styles.nameInputContainer}>
                    <Text style={styles.nameInput}>(First Name)</Text>
                    <Text style={styles.nameInput}>(Middle Name)</Text>
                    <Text style={styles.nameInput}>(Last Name)</Text>
                  </View>
                  <View style={styles.nameInputContainer}>
                    <Text style={styles.nameInput}>
                      {data.childInfo?.firstName || 'N/A'}
                    </Text>
                    <Text style={styles.nameInput}>
                      {data.childInfo?.middleName || 'N/A'}
                    </Text>
                    <Text style={styles.nameInput}>
                      {data.childInfo?.lastName || 'N/A'}
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
                    <Text style={styles.sexValue}>
                      {data.childInfo?.sex || 'N/A'}
                    </Text>
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
                          {data.childInfo?.dateOfBirth?.month || 'N/A'}
                        </Text>
                        <Text style={styles.dateInput}>
                          {data.childInfo?.dateOfBirth?.day || 'N/A'}
                        </Text>
                        <Text style={styles.dateInput}>
                          {data.childInfo?.dateOfBirth?.year || 'N/A'}
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
                      {data.childInfo?.placeOfBirth?.hospital || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.placeOfBirthColumn}>
                    <Text style={styles.placeOfBirthLabel}>
                      City/Municipality:
                    </Text>
                    <Text style={styles.placeOfBirthValue}>
                      {data.childInfo?.placeOfBirth?.cityMunicipality || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.placeOfBirthColumn}>
                    <Text style={styles.placeOfBirthLabel}>Province:</Text>
                    <Text style={styles.placeOfBirthValue}>
                      {data.childInfo?.placeOfBirth?.province || 'N/A'}
                    </Text>
                  </View>
                </View>

                {/* Bottom Grid: Type of Birth, Multiple Birth, Birth Order, Weight at Birth */}
                <View style={styles.bottomGridContainer}>
                  <View style={styles.bottomGridColumn}>
                    <Text style={styles.bottomGridLabel}>Type of Birth:</Text>
                    <Text style={styles.bottomGridValue}>
                      {data.childInfo?.typeOfBirth || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.bottomGridColumn}>
                    <Text style={styles.bottomGridLabel}>
                      Multiple Birth Order:
                    </Text>
                    <Text style={styles.bottomGridValue}>
                      {data.childInfo?.multipleBirthOrder || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.bottomGridColumn}>
                    <Text style={styles.bottomGridLabel}>Birth Order:</Text>
                    <Text style={styles.bottomGridValue}>
                      {data.childInfo?.birthOrder || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.bottomGridColumn}>
                    <Text style={styles.bottomGridLabel}>Weight at Birth:</Text>
                    <Text style={styles.bottomGridValue}>
                      {data.childInfo?.weightAtBirth || 'N/A'}
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
                <View style={styles.nameFieldContainer}>
                  <Text style={styles.nameLabel}>Name:</Text>
                  <View style={styles.nameInputContainer}>
                    <Text style={styles.nameInput}>(First Name)</Text>
                    <Text style={styles.nameInput}>(Middle Name)</Text>
                    <Text style={styles.nameInput}>(Last Name)</Text>
                  </View>
                  <View style={styles.nameInputContainer}>
                    <Text style={styles.nameInput}>
                      {data.motherInfo?.firstName || 'N/A'}
                    </Text>
                    <Text style={styles.nameInput}>
                      {data.motherInfo?.middleName || 'N/A'}
                    </Text>
                    <Text style={styles.nameInput}>
                      {data.motherInfo?.lastName || 'N/A'}
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
                        {data.motherInfo?.motherCitizenship || 'N/A'}
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
                        {data.motherInfo?.motherReligion || 'N/A'}
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
                        {data.motherInfo?.totalChildrenBornAlive || 'N/A'}
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
                        {data.motherInfo?.childrenNowDead || 'N/A'}
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
                        {data.motherInfo?.motherOccupation || 'N/A'}
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
                      <Text style={styles.value}>
                        {data.motherInfo?.motherAge || 'N/A'}
                      </Text>
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
                      <Text style={styles.label}>Residence:</Text>
                      <Text style={styles.value}>
                        {data.motherInfo?.residence?.address || 'N/A'}
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
                        {data.motherInfo?.residence?.cityMunicipality || 'N/A'}
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
                        {data.motherInfo?.residence?.province || 'N/A'}
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
                        {data.motherInfo?.residence?.country || 'N/A'}
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
                <View style={styles.nameFieldContainer}>
                  <Text style={styles.nameLabel}>Name:</Text>
                  <View style={styles.nameInputContainer}>
                    <Text style={styles.nameInput}>(First Name)</Text>
                    <Text style={styles.nameInput}>(Middle Name)</Text>
                    <Text style={styles.nameInput}>(Last Name)</Text>
                  </View>
                  <View style={styles.nameInputContainer}>
                    <Text style={styles.nameInput}>
                      {data.fatherInfo?.firstName || 'N/A'}
                    </Text>
                    <Text style={styles.nameInput}>
                      {data.fatherInfo?.middleName || 'N/A'}
                    </Text>
                    <Text style={styles.nameInput}>
                      {data.fatherInfo?.lastName || 'N/A'}
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
                        {data.fatherInfo?.fatherCitizenship || 'N/A'}
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
                        {data.fatherInfo?.fatherReligion || 'N/A'}
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
                        {data.fatherInfo?.fatherOccupation || 'N/A'}
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
                      <Text style={styles.value}>
                        {data.fatherInfo?.fatherAge || 'N/A'}
                      </Text>
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
                      <Text style={styles.label}>Residence:</Text>
                      <Text style={styles.value}>
                        {data.fatherInfo?.residence?.address || 'N/A'}
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
                        {data.fatherInfo?.residence?.cityMunicipality || 'N/A'}
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
                        {data.fatherInfo?.residence?.province || 'N/A'}
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
                        {data.fatherInfo?.residence?.country || 'N/A'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Marriage of Parents */}
          <View style={styles.sectionGrid}>
            <Text style={styles.title}>Marriage of Parents</Text>
            <View style={styles.marriageGridContainer}>
              <View style={styles.marriageLeftGrid}>
                <Text style={styles.label}>Date:</Text>
                <View style={styles.dateInputContainer}>
                  <Text style={styles.dateInput}>(Month)</Text>
                  <Text style={styles.dateInput}>(Day)</Text>
                  <Text style={styles.dateInput}>(Year)</Text>
                </View>
                <View style={styles.dateInputContainer}>
                  <Text style={styles.dateInput}>
                    {data.parentMarriage?.date?.month || 'N/A'}
                  </Text>
                  <Text style={styles.dateInput}>
                    {data.parentMarriage?.date?.day || 'N/A'}
                  </Text>
                  <Text style={styles.dateInput}>
                    {data.parentMarriage?.date?.year || 'N/A'}
                  </Text>
                </View>
              </View>
              <View style={styles.marriageRightGrid}>
                <Text style={styles.label}>Place:</Text>
                <View style={styles.dateInputContainer}>
                  <Text style={styles.dateInput}>(City/Municipality)</Text>
                  <Text style={styles.dateInput}>(Province)</Text>
                  <Text style={styles.dateInput}>(Country)</Text>
                </View>
                <View style={styles.dateInputContainer}>
                  <Text style={styles.dateInput}>
                    {data.parentMarriage?.place?.cityMunicipality || 'N/A'}
                  </Text>
                  <Text style={styles.dateInput}>
                    {data.parentMarriage?.place?.province || 'N/A'}
                  </Text>
                  <Text style={styles.dateInput}>
                    {data.parentMarriage?.place?.country || 'N/A'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Attendant */}
          <View style={styles.sectionGrid}>
            <Text style={styles.label}>Attendant:</Text>
            <Text style={styles.value}>
              {data.attendant?.type || 'N/A'} -{' '}
              {data.attendant?.certification?.name || 'N/A'}
            </Text>
          </View>

          {/* Certification of Attendant at Birth */}
          <View style={[styles.sectionGrid, { padding: 3 }]}>
            <Text style={[styles.label, { fontSize: 7 }]}>
              CERTIFICATION OF ATTENDANT AT BIRTH
            </Text>
            <Text style={[styles.value, { fontSize: 7 }]}>
              I hereby certify that I attended the birth of the child who was
              born alive at{' '}
              <Text style={{ textDecoration: 'underline' }}>
                {data.attendant?.certification?.time || 'N/A'}
              </Text>{' '}
              on the date of birth specified above.
            </Text>
            <View style={{ flexDirection: 'row', marginTop: 3 }}>
              <View style={{ width: '50%' }}>
                <Text style={[styles.label, { fontSize: 7 }]}>Signature:</Text>
                <Text style={[styles.value, { fontSize: 7 }]}>
                  <Text style={{ textDecoration: 'underline' }}>
                    {data.attendant?.certification?.signature || 'N/A'}
                  </Text>
                </Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text style={[styles.label, { fontSize: 7 }]}>Address:</Text>
                <Text style={[styles.value, { fontSize: 7 }]}>
                  {data.attendant?.certification?.address || 'N/A'}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 3 }}>
              <View style={{ width: '50%' }}>
                <Text style={[styles.label, { fontSize: 7 }]}>
                  Name in Print:
                </Text>
                <Text style={[styles.value, { fontSize: 7 }]}>
                  {data.attendant?.certification?.name || 'N/A'}
                </Text>
              </View>
              <View style={{ width: '50%' }}>
                <Text style={[styles.label, { fontSize: 7 }]}>
                  Title or Position:
                </Text>
                <Text style={[styles.value, { fontSize: 7 }]}>
                  {data.attendant?.certification?.title || 'N/A'}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 3 }}>
              <View style={{ width: '50%' }}>
                <Text style={[styles.label, { fontSize: 7 }]}>Date:</Text>
                <Text style={[styles.value, { fontSize: 7 }]}>
                  {data.attendant?.certification?.date
                    ? formatDateTime(data.attendant.certification.date, {
                        monthFormat: 'numeric',
                        dayFormat: 'numeric',
                        yearFormat: 'numeric',
                      })
                    : 'N/A'}
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
              <Text style={[styles.label, { fontSize: 7 }]}>
                CERTIFICATION INFORMAT
              </Text>
              <Text style={[styles.value, { fontSize: 7 }]}>
                I hereby certify that all information supplied are true and
                correct to my own knowledge and belief.
              </Text>
              <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 7 }]}>
                    Signature:
                  </Text>
                  <Text style={[styles.value, { fontSize: 7 }]}>
                    <Text style={{ textDecoration: 'underline' }}>
                      {data.informant?.signature || 'N/A'}
                    </Text>
                  </Text>
                </View>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 7 }]}>
                    Name in Print:
                  </Text>
                  <Text style={[styles.value, { fontSize: 7 }]}>
                    {data.informant?.name || 'N/A'}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 7 }]}>
                    Relationship to the Child:
                  </Text>
                  <Text style={[styles.value, { fontSize: 7 }]}>
                    {data.informant?.relationship || 'N/A'}
                  </Text>
                </View>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 7 }]}>Address:</Text>
                  <Text style={[styles.value, { fontSize: 7 }]}>
                    {data.informant?.address || 'N/A'}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 7 }]}>Date:</Text>
                  <Text style={[styles.value, { fontSize: 7 }]}>
                    {data.informant?.date
                      ? formatDateTime(data.informant.date, {
                          monthFormat: 'numeric',
                        })
                      : 'N/A'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Prepared By */}
            <View style={[styles.sectionGrid, { width: '50%', padding: 3 }]}>
              <Text style={[styles.label, { fontSize: 7 }]}>PREPARED BY</Text>
              <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 7 }]}>
                    Signature:
                  </Text>
                  <Text style={[styles.value, { fontSize: 7 }]}>
                    <Text style={{ textDecoration: 'underline' }}>
                      {data.preparedBy?.signature || 'N/A'}
                    </Text>
                  </Text>
                </View>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 7 }]}>
                    Name in Print:
                  </Text>
                  <Text style={[styles.value, { fontSize: 7 }]}>
                    {data.preparedBy?.name || 'N/A'}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 7 }]}>
                    Title or Position:
                  </Text>
                  <Text style={[styles.value, { fontSize: 7 }]}>
                    {data.preparedBy?.title || 'N/A'}
                  </Text>
                </View>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 7 }]}>Date:</Text>
                  <Text style={[styles.value, { fontSize: 7 }]}>
                    {data.preparedBy?.date
                      ? formatDateTime(data.preparedBy.date, {
                          monthFormat: 'numeric',
                        })
                      : 'N/A'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Received By and Registered At Grids */}
          <View style={{ flexDirection: 'row' }}>
            {/* Received By */}
            <View style={[styles.sectionGrid, styles.receivedByGrid]}>
              <Text style={[styles.label, { fontSize: 7 }]}>RECEIVED BY</Text>
              <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 7 }]}>
                    Signature:
                  </Text>
                  <Text style={[styles.value, { fontSize: 7 }]}>
                    <Text style={{ textDecoration: 'underline' }}>
                      {data.receivedBy?.signature || 'N/A'}
                    </Text>
                  </Text>
                </View>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 7 }]}>
                    Name in Print:
                  </Text>
                  <Text style={[styles.value, { fontSize: 7 }]}>
                    {data.receivedBy?.name || 'N/A'}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 7 }]}>
                    Title or Position:
                  </Text>
                  <Text style={[styles.value, { fontSize: 7 }]}>
                    {data.receivedBy?.title || 'N/A'}
                  </Text>
                </View>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 7 }]}>Date:</Text>
                  <Text style={[styles.value, { fontSize: 7 }]}>
                    {data.receivedBy?.date
                      ? formatDateTime(data.receivedBy.date, {
                          monthFormat: 'numeric',
                        })
                      : 'N/A'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Registered At the Office of the Civil Registrar */}
            <View style={[styles.sectionGrid, styles.registeredAtGrid]}>
              <Text style={[styles.label, { fontSize: 7 }]}>
                REGISTERED AT THE OFFICE OF THE CIVIL REGISTRAR
              </Text>
              <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 7 }]}>
                    Signature:
                  </Text>
                  <Text style={[styles.value, { fontSize: 7 }]}>
                    <Text style={{ textDecoration: 'underline' }}>
                      {data.registeredByOffice?.signature || 'N/A'}
                    </Text>
                  </Text>
                </View>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 7 }]}>
                    Name in Print:
                  </Text>
                  <Text style={[styles.value, { fontSize: 7 }]}>
                    {data.registeredByOffice?.name || 'N/A'}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 7 }]}>
                    Title or Position:
                  </Text>
                  <Text style={[styles.value, { fontSize: 7 }]}>
                    {data.registeredByOffice?.title || 'N/A'}
                  </Text>
                </View>
                <View style={{ width: '50%' }}>
                  <Text style={[styles.label, { fontSize: 7 }]}>Date:</Text>
                  <Text style={[styles.value, { fontSize: 7 }]}>
                    {data.registeredByOffice?.date
                      ? formatDateTime(data.registeredByOffice.date, {
                          monthFormat: 'numeric',
                        })
                      : 'N/A'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Remarks Grid */}
          <View style={[styles.sectionGrid, styles.remarksGrid]}>
            <Text style={[styles.label, { fontSize: 7 }]}>Remarks:</Text>
            <Text style={[styles.value, { fontSize: 7 }]}>
              {data.remarks || 'N/A'}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default BirthCertificatePDF;
