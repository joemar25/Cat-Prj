import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { MarriageFormData, PersonName, Place, ConsentPerson, SolemnizingOfficer } from '@/types/marriage-certificate'; // Adjust the import path as needed

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
    border: '1px solid #000',
    borderRadius: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottom: '1px solid #000',
    paddingBottom: 5,
  },
  fieldContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '30%',
    fontSize: 12,
    color: '#666',
  },
  value: {
    width: '70%',
    fontSize: 12,
  },
});

// Helper functions to format data
const formatName = (name: PersonName | null | undefined): string => {
  if (!name) return 'N/A';
  return `${name.first}${name.middle ? ` ${name.middle}` : ''} ${name.last}`;
};

const formatPlace = (place: Place | null | undefined): string => {
  if (!place) return 'N/A';
  const { cityMunicipality, province, country } = place;
  return [cityMunicipality, province, country].filter(Boolean).join(', ');
};

// PDF Component
interface MarriageCertificatePDFProps {
  data: Partial<MarriageFormData>;
}

const MarriageCertificatePDF: React.FC<MarriageCertificatePDFProps> = ({ data }) => {
  if (!Object.entries(data).length) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>No data available for preview.</Text>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Husband's Information */}
        <View style={styles.section}>
          <Text style={styles.title}>Husband's Information</Text>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Full Name:</Text>
            <Text style={styles.value}>
              {[data.husbandFirstName, data.husbandMiddleName, data.husbandLastName].filter(Boolean).join(' ')}
            </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={styles.value}>{data.husbandDateOfBirth || 'N/A'}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Age:</Text>
            <Text style={styles.value}>{data.husbandAge || 'N/A'}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Place of Birth:</Text>
            <Text style={styles.value}>{formatPlace(data.husbandPlaceOfBirth)}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Sex:</Text>
            <Text style={styles.value}>{data.husbandSex || 'N/A'}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Citizenship:</Text>
            <Text style={styles.value}>{data.husbandCitizenship || 'N/A'}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Residence:</Text>
            <Text style={styles.value}>{data.husbandResidence || 'N/A'}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Religion:</Text>
            <Text style={styles.value}>{data.husbandReligion || 'N/A'}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Civil Status:</Text>
            <Text style={styles.value}>{data.husbandCivilStatus || 'N/A'}</Text>
          </View>
        </View>

        {/* Husband's Family */}
        <View style={styles.section}>
          <Text style={styles.title}>Husband's Family</Text>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Father's Name:</Text>
            <Text style={styles.value}>{formatName(data.husbandFatherName)}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Father's Citizenship:</Text>
            <Text style={styles.value}>{data.husbandFatherCitizenship || 'N/A'}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mother's Maiden Name:</Text>
            <Text style={styles.value}>{formatName(data.husbandMotherMaidenName)}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mother's Citizenship:</Text>
            <Text style={styles.value}>{data.husbandMotherCitizenship || 'N/A'}</Text>
          </View>
        </View>

        {/* Wife's Information */}
        <View style={styles.section}>
          <Text style={styles.title}>Wife's Information</Text>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Full Name:</Text>
            <Text style={styles.value}>
              {[data.wifeFirstName, data.wifeMiddleName, data.wifeLastName].filter(Boolean).join(' ')}
            </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={styles.value}>{data.wifeDateOfBirth || 'N/A'}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Age:</Text>
            <Text style={styles.value}>{data.wifeAge || 'N/A'}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Place of Birth:</Text>
            <Text style={styles.value}>{formatPlace(data.wifePlaceOfBirth)}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Sex:</Text>
            <Text style={styles.value}>{data.wifeSex || 'N/A'}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Citizenship:</Text>
            <Text style={styles.value}>{data.wifeCitizenship || 'N/A'}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Residence:</Text>
            <Text style={styles.value}>{data.wifeResidence || 'N/A'}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Religion:</Text>
            <Text style={styles.value}>{data.wifeReligion || 'N/A'}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Civil Status:</Text>
            <Text style={styles.value}>{data.wifeCivilStatus || 'N/A'}</Text>
          </View>
        </View>

        {/* Wife's Family */}
        <View style={styles.section}>
          <Text style={styles.title}>Wife's Family</Text>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Father's Name:</Text>
            <Text style={styles.value}>{formatName(data.wifeFatherName)}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Father's Citizenship:</Text>
            <Text style={styles.value}>{data.wifeFatherCitizenship || 'N/A'}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mother's Maiden Name:</Text>
            <Text style={styles.value}>{formatName(data.wifeMotherMaidenName)}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Mother's Citizenship:</Text>
            <Text style={styles.value}>{data.wifeMotherCitizenship || 'N/A'}</Text>
          </View>
        </View>

        {/* Marriage Details */}
        <View style={styles.section}>
          <Text style={styles.title}>Marriage Details</Text>
          {data.placeOfMarriage && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Place of Marriage:</Text>
              <Text style={styles.value}>
                {`${data.placeOfMarriage.office}, ${formatPlace(data.placeOfMarriage)}`}
              </Text>
            </View>
          )}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Date of Marriage:</Text>
            <Text style={styles.value}>{data.dateOfMarriage || 'N/A'}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Time of Marriage:</Text>
            <Text style={styles.value}>{data.timeOfMarriage || 'N/A'}</Text>
          </View>
        </View>

        {/* Solemnizing Officer */}
        {data.solemnizingOfficer && (
          <View style={styles.section}>
            <Text style={styles.title}>Solemnizing Officer</Text>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{data.solemnizingOfficer.name || 'N/A'}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Position:</Text>
              <Text style={styles.value}>{data.solemnizingOfficer.position || 'N/A'}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Religion:</Text>
              <Text style={styles.value}>{data.solemnizingOfficer.religion || 'N/A'}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Registry Expiry Date:</Text>
              <Text style={styles.value}>{data.solemnizingOfficer.registryNoExpiryDate || 'N/A'}</Text>
            </View>
          </View>
        )}

        {/* Consent Information */}
        {(data.husbandConsentPerson || data.wifeConsentPerson) && (
          <View style={styles.section}>
            <Text style={styles.title}>Consent Information</Text>
            {data.husbandConsentPerson && (
              <View>
                <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>Husband's Consent Person</Text>
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.value}>{formatName(data.husbandConsentPerson.name)}</Text>
                </View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Relationship:</Text>
                  <Text style={styles.value}>{data.husbandConsentPerson.relationship || 'N/A'}</Text>
                </View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Residence:</Text>
                  <Text style={styles.value}>{data.husbandConsentPerson.residence || 'N/A'}</Text>
                </View>
              </View>
            )}
            {data.wifeConsentPerson && (
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 5 }}>Wife's Consent Person</Text>
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Name:</Text>
                  <Text style={styles.value}>{formatName(data.wifeConsentPerson.name)}</Text>
                </View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Relationship:</Text>
                  <Text style={styles.value}>{data.wifeConsentPerson.relationship || 'N/A'}</Text>
                </View>
                <View style={styles.fieldContainer}>
                  <Text style={styles.label}>Residence:</Text>
                  <Text style={styles.value}>{data.wifeConsentPerson.residence || 'N/A'}</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default MarriageCertificatePDF;