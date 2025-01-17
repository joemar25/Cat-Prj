import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    textAlign: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  municipal: {
    flexDirection: "column",
    alignItems: "flex-start",
    fontSize: 10,
    gap: 5,
  },
  republic: {
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    fontWeight: "extrabold",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 10,
    marginBottom: 5,
  },
  headerNote1: {
    fontSize: 10,
    marginBottom: 5,
    color: "#666",
  },
  headerNote2: {
    fontSize: 10,
    marginBottom: 5,
    color: "#666",
    width: 100,
  },
  fieldContainer1: {
    flexDirection: "column",
    border: "1px solid #000",
    padding: 10,
    width: "100%",
  },
  fieldContainer2: {
    flexDirection: "row",
    gap: 20,
    width: "100%",
  },
  registry: {
    width: 250,
    borderRight: "1px solid #000",
    borderTop: "1px solid #000",
    borderBottom: "1px solid #000",
    padding: 10,
  },
  section1: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fieldContainer: {
    flexDirection: "column",
    marginBottom: 5,
  },
  section: {

  },
  personalInfo: {
    flexDirection: "row",
    height: 50,
    borderBottom: "1px solid #000",
    borderLeft: "1px solid #000",
    borderRight: "1px solid #000",
    padding: 10,
  },
  fieldContainer3: {
    width: 250,
  },
  data1: {
    fontSize: 10,
    width: "100%",
    paddingTop: 4,
    paddingBottom: 4,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    paddingTop: 5,
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    borderBottom: "1px solid #000",
    paddingBottom: 2,
    width: "100%",
    paddingLeft: 20,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: "bold",
  },
  DateOfDeath: {
    flexDirection: "row",
    height: 50,
    borderBottom: "1px solid #000",
    borderLeft: "1px solid #000",
    borderRight: "1px solid #000",
    padding: 10,
  },
  fieldContainer4: {
    width: "100%",
  },
  fieldContainer5: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    borderBottom: "1px solid #000",
    borderLeft: "1px solid #000",
    borderRight: "1px solid #000",
  },
  PlaceOfDeathParent: {
    flexDirection: "column",
    gap: 5,
    width: "100%",
    height: 50,
    padding: 10,
    borderRight: "1px solid #000",
  },
  PlaceOfDeath: {
    flexDirection: "row",
    gap: 25,
    width: "100%",
  },
  CivilStatus: {
    padding: 10,
    width: 150,
  },
  hospital: {
    width: "100%",
    fontSize: 8,
    color: "#666",
  },
  fieldContainer6: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    borderBottom: "1px solid #000",
    borderLeft: "1px solid #000",
    borderRight: "1px solid #000",
  },
  religion: {
    width: 200,
    borderRight: "1px solid #000",
    padding: 10,
  },
  citizenship: {
    width: 200,
    borderRight: "1px solid #000",
    padding: 10,
  },
  residence: {
    width: "100%",
    padding: 10,
  },
  fatherName: {
    flexDirection: "row",
    width: 200,
    gap: 5,
  },
  fieldContainer7: {
    width: "100%",
    padding: 10,
  },
  fieldContainer8: {
    width: "100%",
    padding: 10,
  },
  motherMaidenName: {
    flexDirection: "row",
    width: "100%",
    gap: 5,
  },
  label1: {
    fontSize: 10,
    color: "#666",
  },
  section2: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    borderBottom: "1px solid #000",
    borderLeft: "1px solid #000",
    borderRight: "1px solid #000",
  },
  occupation: {
    width: 250,
    padding: 10,
  },
  sectionTitleContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
    borderBottom: "1px solid #000",
  },
  causesOfDeath: {
    marginBottom: 10,
    padding: 10,
  },
  causeRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  causeLabel: {
    fontSize: 10,
    fontWeight: "bold",
    width: 150,
  },
  causeValue: {
    fontSize: 10,
    borderBottom: "1px solid #000",
    flex: 1,
  },
  intervalSection: {
    marginBottom: 10,
  },
  intervalRow: {
    flexDirection: "row",
  },
  intervalValue: {
    fontSize: 10,
    borderBottom: "1px solid #000",
    flex: 1,
  },
  maternalCondition: {
    marginBottom: 10,
  },
  checkboxRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  checkboxLabel: {
    fontSize: 10,
  },
  externalCauses: {
    marginBottom: 10,
  },
  externalCauseRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  externalCauseLabel: {
    fontSize: 10,
    fontWeight: "bold",
    width: 150,
  },
  externalCauseValue: {
    fontSize: 10,
    borderBottom: "1px solid #000",
    flex: 1,
  },
  autopsySection: {
    marginBottom: 10,
  },
  autopsyValue: {
    fontSize: 10,
    borderBottom: "1px solid #000",
  },
  attendantSection: {
    marginBottom: 10,
  },
  attendantRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  attendantLabel: {
    fontSize: 10,
  },
  attendantDuration: {
    marginTop: 10,
  },
  durationRow: {
    flexDirection: "row",
    gap: 10,
  },
  durationLabel: {
    fontSize: 10,
  },
  durationValue: {
    fontSize: 10,
    borderBottom: "1px solid #000",
  },
  certificationSection: {
    marginBottom: 10,
  },
  certificationText: {
    fontSize: 10,
    marginBottom: 10,
  },
  signatureSection: {
    marginBottom: 10,
  },
  signatureRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  signatureLabel: {
    fontSize: 10,
    fontWeight: "bold",
    width: 100,
  },
  signatureValue: {
    fontSize: 10,
    borderBottom: "1px solid #000",
    flex: 1,
  },
  reviewedBySection: {
    marginBottom: 10,
  },
  reviewedByRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  reviewedByLabel: {
    fontSize: 10,
    fontWeight: "bold",
    width: 150,
  },
  reviewedByValue: {
    fontSize: 10,
    borderBottom: "1px solid #000",
    flex: 1,
  },
  medicalHeader: {
    flexDirection: "column",
    fontSize: 10,
    fontWeight: "bold",
    paddingBottom: 10,
    textAlign: "center",
    borderBottom: "1px solid #000",
    borderLeft: "1px solid #000",
    borderRight: "1px solid #000",
  },
  medicalCertificate: {
    width: "100%",
  },
  sectionTitle2: {
    fontSize: 10,
  },
  fieldContainer9: {
    marginBottom: 10,
    borderRight: "1px solid #000",
    borderLeft: "1px solid #000",
    borderBottom: "1px solid #000",
    padding: 10,
  },
  gridContainer: {
    display: "flex",
    flexDirection: "column",
  },
  gridRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  gridColumn: {
    flex: 1,
    paddingHorizontal: 5,
  },
  label3: {
    fontWeight: "bold",
    fontSize: 10,
    marginBottom: 5,
  },
  label4: {
    fontSize: 10,
    textAlign: "right",
  },
  data2: {
    fontSize: 10,
    marginBottom: 5,
    borderBottom: "1px solid #000",
  },
  data3: {
    fontSize: 10,
    borderBottom: "1px solid #000",
  },
  Other: {
    flexDirection: "column",
    gap: 5,
  },
  rowSpan: {
    paddingBottom: 5,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  maternalConditionContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottom: "1px solid #000",
    borderLeft: "1px solid #000",
    borderRight: "1px solid #000",
    marginTop: -10,
    padding: 10,
  },
  maternalConditionLabel: {
    fontWeight: "bold",
    fontSize: 10,
    flex: 1,
  },
  maternalConditionValue: {
    fontSize: 10,
    flex: 2,
  },
  deathExternalCausesContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#000",
  },
  section19Container: {
    flex: 3,
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  deathExternalCausesTitleContainer: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    backgroundColor: "#f0f0f0",
  },
  deathExternalCausesTitle: {
    fontWeight: "bold",
    fontSize: 10,
  },
  deathExternalCausesFieldContainer: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  deathExternalCausesLabel: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 10,
  },
  deathExternalCausesValue: {
    flex: 2,
    fontSize: 10,
  },
  section20Container: {
    flex: 1,
    padding: 8,
  },
  autopsyTitle: {
    fontWeight: "bold",
    fontSize: 10,
    marginBottom: 8,
  },
  attendantSection2: {
    borderRight: "1px solid #000", // Add a border to the container
    borderLeft: "1px solid #000",
    borderBottom: "1px solid #000",
    flexDirection: "row", // Arrange 21a and 21b side by side
    justifyContent: "space-between", // Add space between 21a and 21b
  },
  attendantSection3: {
    padding: 10,
    borderRight: "1px solid #000", // Add a border to the container
    flex: 1, // Allow 21a to take up half the space
    marginRight: 10, // Add spacing between 21a and 21b
  },
  attendantSection4: {
    padding: 10,
    flex: 1, // Allow 21b to take up half the space
    marginLeft: 10, // Add spacing between 21a and 21b
  },
  attendantSectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10, // Add spacing below the title
  },
  attendantContainer: {

    padding: 10, // Add padding inside the container
    flexDirection: "column", // Stack fields vertically
    gap: 10, // Add spacing between fields
  },
  attendantFieldContainer: {
    flexDirection: "row", // Align label and value horizontally
    justifyContent: "space-between", // Space out label and value
    alignItems: "center", // Vertically center align items
  },
  attendantFieldContainerColumn: {
    flexDirection: "column", // Stack content vertically
    gap: 5, // Add spacing between items
  },
  attendantLabel2: {
    fontSize: 10,
    fontWeight: "bold",
  },
  attendantValue: {
    fontSize: 10,
    borderBottom: "1px solid #000", // Add a bottom border to the value
    paddingBottom: 2, // Add spacing below the value
  },

  certificationSection11: {
    padding: 10,
    borderRight: "1px solid #000",
    borderLeft: "1px solid #000",
    borderBottom: "1px solid #000",
  },

  // Section title
  certificationTitle: {
    borderBottom: "1px solid #000",
    width: "100%",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
  },

  // Field container
  fieldContainer11: {
    flexDirection: "row",
    marginBottom: 5,
  },

  // Labels
  attendedLabel: {
    width: "40%",
    fontSize: 12,
    fontWeight: "bold",
  },
  deathDateTimeLabel: {
    width: "40%",
    fontSize: 12,
    fontWeight: "bold",
  },
  nameLabel: {
    width: "40%",
    fontSize: 12,
    fontWeight: "bold",
  },
  titleLabel: {
    width: "40%",
    fontSize: 12,
    fontWeight: "bold",
  },

  // Values
  attendedValue: {
    width: "60%",
    fontSize: 12,
  },
  deathDateTimeValue: {
    width: "60%",
    fontSize: 12,
  },
  nameValue: {
    width: "60%",
    fontSize: 12,
  },
  titleValue: {
    width: "60%",
    fontSize: 12,
  },
  gridContainer22: {
    flexDirection: "row",
    borderRight: "1px solid #000",
    borderLeft: "1px solid #000",
    borderBottom: "1px solid #000",
  },

  // Grid cells
  corpseDisposalCell: {
    width: "32%",
    borderRight: "1px solid #000",
    padding: 10,
  },
  burialCremationCell: {
    width: "32%",
    borderRight: "1px solid #000",
    padding: 10,
  },
  transferPermitCell: {
    width: "32%",
    padding: 10,
  },

  // Labels
  corpseDisposalLabel: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 5,
  },
  burialCremationLabel: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 5,
  },
  transferPermitLabel: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 5,
  },

  // Values
  corpseDisposalValue: {
    fontSize: 10,
  },
  burialCremationValue: {
    fontSize: 10,
  },
  transferPermitValue: {
    fontSize: 10,
  },
  fieldContainer222: {
    flexDirection: "column",
    padding: 10,
    gap: 5,
    borderRight: "1px solid #000",
    borderLeft: "1px solid #000",
    borderBottom: "1px solid #000",
  },

  Last:{
    borderRight: "1px solid #000",
    borderLeft: "1px solid #000",
    borderBottom: "1px solid #000",
  },
  section12: {
    padding: 5,
    flex: 1, // Ensures equal height for sections in the same row
  },

  // Section titles
  certificationOfInformantTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  preparedByTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  receivedByTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  registeredAtCivilRegistrarTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },

  // Field containers
  fieldContainer12: {
    flexDirection: "column",
  },

  // Labels
  label12: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
  },

  // Values
  value12: {
    fontSize: 10,
  },
  
});