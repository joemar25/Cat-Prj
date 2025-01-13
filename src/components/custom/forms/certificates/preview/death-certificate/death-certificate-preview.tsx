'use client';

import { DeathCertificateFormValues } from '@/lib/types/zod-form-certificate/formSchemaCertificate';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
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
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
});

interface DeathCertificatePDFProps {
  data: Partial<DeathCertificateFormValues>;
}

const DeathCertificatePDF: React.FC<DeathCertificatePDFProps> = ({ data }) => {
  if (!data || Object.keys(data).length === 0) {
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

  // Split the sections into two groups
  const firstPageSections = [
    // Registry Information
    <View key="registry" style={styles.section}>
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
    </View>,

    // Personal Information
    <View key="personal" style={styles.section}>
      <Text style={styles.title}>Personal Information</Text>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>
          {[data.name?.first, data.name?.middle, data.name?.last]
            .filter(Boolean)
            .join(' ') || 'N/A'}
        </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Sex:</Text>
        <Text style={styles.value}>{data.sex || 'N/A'}</Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Civil Status:</Text>
        <Text style={styles.value}>{data.civilStatus || 'N/A'}</Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Date of Death:</Text>
        <Text style={styles.value}>
          {data.dateOfDeath
            ? new Date(data.dateOfDeath).toLocaleDateString()
            : 'N/A'}
        </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Date of Birth:</Text>
        <Text style={styles.value}>
          {data.dateOfBirth
            ? new Date(data.dateOfBirth).toLocaleDateString()
            : 'N/A'}
        </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Age at Death:</Text>
        <Text style={styles.value}>
          {`${data.ageAtDeath?.years || 0} years, ${
            data.ageAtDeath?.months || 0
          } months, ${data.ageAtDeath?.days || 0} days, ${
            data.ageAtDeath?.hours || 0
          } hours`}
        </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Place of Death:</Text>
        <Text style={styles.value}>{data.placeOfDeath || 'N/A'}</Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Religion:</Text>
        <Text style={styles.value}>{data.religion || 'N/A'}</Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Citizenship:</Text>
        <Text style={styles.value}>{data.citizenship || 'N/A'}</Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Residence:</Text>
        <Text style={styles.value}>{data.residence || 'N/A'}</Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Occupation:</Text>
        <Text style={styles.value}>{data.occupation || 'N/A'}</Text>
      </View>
    </View>,

    // Family Information
    <View key="family" style={styles.section}>
      <Text style={styles.title}>Family Information</Text>
      <Text style={styles.subtitle}>Father&apos;s Information</Text>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Father&apos;s Name:</Text>
        <Text style={styles.value}>
          {[data.fatherName?.first, data.fatherName?.last]
            .filter(Boolean)
            .join(' ') || 'N/A'}
        </Text>
      </View>
      <Text style={styles.subtitle}>Mother&apos;s Information</Text>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Mother&apos;s Maiden Name:</Text>
        <Text style={styles.value}>
          {[data.motherMaidenName?.first, data.motherMaidenName?.last]
            .filter(Boolean)
            .join(' ') || 'N/A'}
        </Text>
      </View>
    </View>,

    // Medical Certificate
    <View key="medical" style={styles.section}>
      <Text style={styles.title}>Medical Certificate</Text>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Immediate Cause:</Text>
        <Text style={styles.value}>
          {data.causesOfDeath?.immediate || 'N/A'}
        </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Antecedent Cause:</Text>
        <Text style={styles.value}>
          {data.causesOfDeath?.antecedent || 'N/A'}
        </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Underlying Cause:</Text>
        <Text style={styles.value}>
          {data.causesOfDeath?.underlying || 'N/A'}
        </Text>
      </View>
      {data.sex === 'Female' && (
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Maternal Condition:</Text>
          <Text style={styles.value}>
            {data.maternalCondition || 'N/A'}
          </Text>
        </View>
      )}
    </View>,
  ];

  const secondPageSections = [
    // Death by External Causes
    <View key="external" style={styles.section}>
      <Text style={styles.title}>Death by External Causes</Text>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Manner of Death:</Text>
        <Text style={styles.value}>
          {data.deathByExternalCauses?.mannerOfDeath || 'N/A'}
        </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Place of Occurrence:</Text>
        <Text style={styles.value}>
          {data.deathByExternalCauses?.placeOfOccurrence || 'N/A'}
        </Text>
      </View>
    </View>,

    // Attendant Information
    <View key="attendant" style={styles.section}>
      <Text style={styles.title}>Attendant Information</Text>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Type:</Text>
        <Text style={styles.value}>{data.attendant?.type || 'N/A'}</Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Duration:</Text>
        <Text style={styles.value}>
          {data.attendant?.duration?.from && data.attendant?.duration?.to
            ? `From: ${new Date(
                data.attendant.duration.from
              ).toLocaleDateString()} To: ${new Date(
                data.attendant.duration.to
              ).toLocaleDateString()}`
            : 'N/A'}
        </Text>
      </View>
    </View>,

    // Certification
    <View key="certification" style={styles.section}>
      <Text style={styles.title}>Certification of Death</Text>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Attended Deceased:</Text>
        <Text style={styles.value}>
          {data.certification?.hasAttended ? 'Yes' : 'No'}
        </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Death Date/Time:</Text>
        <Text style={styles.value}>
          {data.certification?.deathDateTime || 'N/A'}
        </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>
          {data.certification?.nameInPrint || 'N/A'}
        </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Title/Position:</Text>
        <Text style={styles.value}>
          {data.certification?.titleOfPosition || 'N/A'}
        </Text>
      </View>
    </View>,

    // Disposal Information
    <View key="disposal" style={styles.section}>
      <Text style={styles.title}>Disposal Information</Text>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Method:</Text>
        <Text style={styles.value}>{data.disposal?.method || 'N/A'}</Text>
      </View>
      <Text style={styles.subtitle}>Burial Permit</Text>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Permit Number:</Text>
        <Text style={styles.value}>
          {data.disposal?.burialPermit?.number || 'N/A'}
        </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Date Issued:</Text>
        <Text style={styles.value}>
          {data.disposal?.burialPermit?.dateIssued
            ? new Date(
                data.disposal.burialPermit.dateIssued
              ).toLocaleDateString()
            : 'N/A'}
        </Text>
      </View>
      <Text style={styles.subtitle}>Cemetery Information</Text>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Cemetery Address:</Text>
        <Text style={styles.value}>{data.cemeteryAddress || 'N/A'}</Text>
      </View>
    </View>,

    // Informant Information
    <View key="informant" style={styles.section}>
      <Text style={styles.title}>Informant Information</Text>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>
          {data.informant?.nameInPrint || 'N/A'}
        </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Relationship:</Text>
        <Text style={styles.value}>
          {data.informant?.relationshipToDeceased || 'N/A'}
        </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Address:</Text>
        <Text style={styles.value}>{data.informant?.address || 'N/A'}</Text>
      </View>
    </View>,

    // Remarks
    <View key="remarks" style={styles.section}>
      <Text style={styles.title}>Remarks</Text>
      <View style={styles.fieldContainer}>
        <Text style={styles.value}>{data.remarks || 'N/A'}</Text>
      </View>
    </View>,
  ];

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        {firstPageSections}
      </Page>
      <Page size='A4' style={styles.page}>
        {secondPageSections}
      </Page>
    </Document>
  );
};

export default DeathCertificatePDF;