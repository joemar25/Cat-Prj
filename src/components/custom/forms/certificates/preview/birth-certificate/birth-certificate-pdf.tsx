import { BirthCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 10, // Reduced padding
  },
  section: {
    margin: 5, // Reduced margin
    padding: 5, // Reduced padding
    flexGrow: 1,
    border: '1px solid #000',
    borderRadius: 5,
  },
  title: {
    fontSize: 14, // Reduced font size
    fontWeight: 'bold',
    marginBottom: 5, // Reduced margin
    borderBottom: '1px solid #000',
    paddingBottom: 3, // Reduced padding
  },
  fieldContainer: {
    flexDirection: 'row',
    marginBottom: 3, // Reduced margin
  },
  label: {
    width: '30%',
    fontSize: 10, // Reduced font size
    color: '#666',
  },
  value: {
    width: '70%',
    fontSize: 10, // Reduced font size
  },
});

// Helper function to format name
const formatName = (
  firstName: string = '',
  middleName: string = '',
  lastName: string = ''
): string => {
  return [firstName, middleName, lastName].filter(Boolean).join(' ') || 'N/A';
};

// Helper function to format address
const formatAddress = (
  address: {
    address?: string;
    cityMunicipality?: string;
    province?: string;
    country?: string;
  } = {}
): string => {
  return (
    [
      address.address,
      address.cityMunicipality,
      address.province,
      address.country,
    ]
      .filter(Boolean)
      .join(', ') || 'N/A'
  );
};

// Helper function to format date
const formatDate = (
  date: { day?: string; month?: string; year?: string } = {}
): string => {
  if (!date.day || !date.month || !date.year) return 'N/A';
  return `${date.month}/${date.day}/${date.year}`;
};

interface BirthCertificatePDFProps {
  data: Partial<BirthCertificateFormValues>;
}

const BirthCertificatePDF: React.FC<BirthCertificatePDFProps> = ({ data }) => {
  if (!Object.entries(data).length) {
    return (
      <Document>
        <Page size='A4' style={styles.page}>
          <View style={styles.section}>
            <Text>No data available for preview.</Text>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        {/* Registry Information */}
        <View style={styles.section}>
          <Text style={styles.title}>Registry Information</Text>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Registry Number:</Text>
            <Text style={styles.value}>{data.registryNumber || 'N/A'}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Province:</Text>
            <Text style={styles.value}>{data.province || 'N/A'}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>City/Municipality:</Text>
            <Text style={styles.value}>{data.cityMunicipality || 'N/A'}</Text>
          </View>
        </View>

        {/* Child Information */}
        <View style={styles.section}>
          <Text style={styles.title}>Child&apos;s Information</Text>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>
              {data.childInfo &&
                formatName(
                  data.childInfo.firstName,
                  data.childInfo.middleName,
                  data.childInfo.lastName
                )}
            </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Sex:</Text>
            <Text style={styles.value}>{data.childInfo?.sex || 'N/A'}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Date of Birth:</Text>
            <Text style={styles.value}>
              {data.childInfo?.dateOfBirth &&
                formatDate(data.childInfo.dateOfBirth)}
            </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Place of Birth:</Text>
            <Text style={styles.value}>
              {data.childInfo?.placeOfBirth &&
                formatAddress(data.childInfo.placeOfBirth)}
            </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Type of Birth:</Text>
            <Text style={styles.value}>
              {data.childInfo?.typeOfBirth || 'N/A'}
            </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Birth Order:</Text>
            <Text style={styles.value}>
              {data.childInfo?.birthOrder || 'N/A'}
            </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Weight:</Text>
            <Text style={styles.value}>
              {data.childInfo?.weightAtBirth || 'N/A'}
            </Text>
          </View>
        </View>

        {/* Mother's Information */}
        <View style={styles.section}>
          <Text style={styles.title}>Mother&apos;s Information</Text>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>
              {data.motherInfo &&
                formatName(
                  data.motherInfo.firstName,
                  data.motherInfo.middleName,
                  data.motherInfo.lastName
                )}
            </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Citizenship:</Text>
            <Text style={styles.value}>
              {data.motherInfo?.motherCitizenship || 'N/A'}
            </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Religion:</Text>
            <Text style={styles.value}>
              {data.motherInfo?.motherReligion || 'N/A'}
            </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Occupation:</Text>
            <Text style={styles.value}>
              {data.motherInfo?.motherOccupation || 'N/A'}
            </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Age:</Text>
            <Text style={styles.value}>{data.motherInfo?.motherAge || 'N/A'}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Residence:</Text>
            <Text style={styles.value}>
              {data.motherInfo?.residence &&
                formatAddress(data.motherInfo.residence)}
            </Text>
          </View>
        </View>

        {/* Father's Information */}
        <View style={styles.section}>
          <Text style={styles.title}>Father&apos;s Information</Text>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>
              {data.fatherInfo &&
                formatName(
                  data.fatherInfo.firstName,
                  data.fatherInfo.middleName,
                  data.fatherInfo.lastName
                )}
            </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Citizenship:</Text>
            <Text style={styles.value}>
              {data.fatherInfo?.fatherCitizenship || 'N/A'}
            </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Religion:</Text>
            <Text style={styles.value}>
              {data.fatherInfo?.fatherReligion || 'N/A'}
            </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Occupation:</Text>
            <Text style={styles.value}>
              {data.fatherInfo?.fatherOccupation || 'N/A'}
            </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Age:</Text>
            <Text style={styles.value}>{data.fatherInfo?.fatherAge || 'N/A'}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Residence:</Text>
            <Text style={styles.value}>
              {data.fatherInfo?.residence &&
                formatAddress(data.fatherInfo.residence)}
            </Text>
          </View>
        </View>

        {/* Other Information */}
        <View style={styles.section}>
          <Text style={styles.title}>Other Information</Text>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Marriage of Parents:</Text>
            <Text style={styles.value}>
              {data.parentMarriage?.date &&
                formatDate(data.parentMarriage.date)}
              {data.parentMarriage?.place &&
                ` at ${formatAddress(data.parentMarriage.place)}`}
            </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Attendant:</Text>
            <Text style={styles.value}>
              {data.attendant?.type} -{' '}
              {data.attendant?.certification?.name || 'N/A'}
            </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Informant:</Text>
            <Text style={styles.value}>
              {data.informant?.name} ({data.informant?.relationship || 'N/A'})
            </Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Remarks:</Text>
            <Text style={styles.value}>{data.remarks || 'N/A'}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default BirthCertificatePDF;