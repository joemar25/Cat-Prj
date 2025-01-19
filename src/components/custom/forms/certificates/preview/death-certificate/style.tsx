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
    marginBottom: 5,
  },
  municipal: {
    flexDirection: "column",
    alignItems: "flex-start",
    fontSize: 8,
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
    fontSize: 8,
    marginBottom: 5,
  },
  headerNote1: {
    fontSize: 8,
    marginBottom: 5,
    color: "#666",
  },
  headerNote2: {
    fontSize: 8,
    marginBottom: 5,
    color: "#666",
    width: 100,
  },
  fieldContainer1: {
    flexDirection: "column",
    border: "1px solid #000",
    padding: 5,
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
    padding: 5,
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
    height: 30,
    borderBottom: "1px solid #000",
    borderLeft: "1px solid #000",
    borderRight: "1px solid #000",
  },
  fieldContainer3: {
    width: 250,
    padding: 5,
  },
  data1: {
    fontSize: 8,
    width: "100%",
    paddingTop: 4,
    paddingBottom: 4,
  },
  sectionTitle: {
    fontSize: 8,
    fontWeight: "bold",
    paddingTop: 5,
  },
  label: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 2,
  },
  value: {
    fontSize: 8,
    borderBottom: "1px solid #000",
    paddingBottom: 2,
    width: "100%",
    paddingLeft: 20,
  },
  subtitle: {
    fontSize: 8,
    fontWeight: "bold",
  },
  DateOfDeath: {
    flexDirection: "row",
    height: 30,
    borderBottom: "1px solid #000",
    borderLeft: "1px solid #000",
    borderRight: "1px solid #000",
    padding: 5,
  },
  fieldContainer4: {
    width: "100%",
  },
  fieldContainer5: {
    flexDirection: "row",
    width: "100%",
    height: 30,
    borderBottom: "1px solid #000",
    borderLeft: "1px solid #000",
    borderRight: "1px solid #000",
  },
  PlaceOfDeathParent: {
    flexDirection: "row",
    gap: 25,
    width: "100%",
    height: 30,
    padding: 5,
    borderRight: "1px solid #000",
  },
  PlaceOfDeath: {
    flexDirection: "column",
    gap: 5,
    width: "100%",
  },
  CivilStatus: {
    padding: 5,
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
    height: 30,
    borderBottom: "1px solid #000",
    borderLeft: "1px solid #000",
    borderRight: "1px solid #000",
  },
  religion: {
    width: 200,
    borderRight: "1px solid #000",
    padding: 5,
  },
  citizenship: {
    width: 200,
    borderRight: "1px solid #000",
    padding: 5,
  },
  residence: {
    width: "100%",
    padding: 5,
  },
  fatherName: {
    flexDirection: "row",
    width: 200,
    gap: 5,
  },
  fieldContainer7: {
    width: "100%",
    padding: 5,
  },
  fieldContainer8: {
    width: "100%",
    padding: 5,
  },
  motherMaidenName: {
    flexDirection: "row",
    width: "100%",
    gap: 5,
  },
  label1: {
    fontSize: 8,
    color: "#666",
  },
  section2: {
    flexDirection: "row",
    width: "100%",
    height: 30,
    borderBottom: "1px solid #000",
    borderLeft: "1px solid #000",
    borderRight: "1px solid #000",
  },
  occupation: {
    width: 250,
    padding: 5,
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
    padding: 5,
  },
  causeRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  causeLabel: {
    fontSize: 8,
    fontWeight: "bold",
    width: 150,
  },
  causeValue: {
    fontSize: 8,
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
    fontSize: 8,
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
    fontSize: 8,
  },
  externalCauses: {
    marginBottom: 10,
  },
  externalCauseRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  externalCauseLabel: {
    fontSize: 8,
    fontWeight: "bold",
    width: 150,
  },
  externalCauseValue: {
    fontSize: 8,
    borderBottom: "1px solid #000",
    flex: 1,
  },
  autopsySection: {
    marginBottom: 10,
  },
  autopsyValue: {
    fontSize: 8,
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
    fontSize: 8,
  },
  attendantDuration: {
    marginTop: 10,
  },
  durationRow: {
    flexDirection: "row",
    gap: 10,
  },
  durationLabel: {
    fontSize: 8,
  },
  durationValue: {
    fontSize: 8,
    borderBottom: "1px solid #000",
  },
  certificationSection: {
    marginBottom: 10,
  },
  certificationText: {
    fontSize: 8,
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
    fontSize: 8,
    fontWeight: "bold",
    width: 100,
  },
  signatureValue: {
    fontSize: 8,
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
    fontSize: 8,
    fontWeight: "bold",
    width: 150,
  },
  reviewedByValue: {
    fontSize: 8,
    borderBottom: "1px solid #000",
    flex: 1,
  },
  medicalHeader: {
    flexDirection: "column",
    fontSize: 8,
    fontWeight: "bold",
    paddingBottom: 5,
    textAlign: "center",
    borderBottom: "1px solid #000",
    borderLeft: "1px solid #000",
    borderRight: "1px solid #000",
  },
  medicalCertificate: {
    width: "100%",
  },
  sectionTitle2: {
    fontSize: 8,
  },
  fieldContainer9: {
    marginBottom: 5,
    borderRight: "1px solid #000",
    borderLeft: "1px solid #000",
    borderBottom: "1px solid #000",
    padding: 5,
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
    fontSize: 8,
    marginBottom: 5,
  },
  label4: {
    fontSize: 8,
    textAlign: "right",
  },
  data2: {
    fontSize: 8,
    marginBottom: 5,
    borderBottom: "1px solid #000",
  },
  data3: {
    fontSize: 8,
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
    padding: 5,
  },
  maternalConditionLabel: {
    fontWeight: "bold",
    fontSize: 8,
    flex: 1,
  },
  maternalConditionValue: {
    fontSize: 8,
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
    fontSize: 8,
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
    fontSize: 8,
  },
  deathExternalCausesValue: {
    flex: 2,
    fontSize: 8,
  },
  section20Container: {
    flex: 1,
    padding: 8,
  },
  autopsyTitle: {
    fontWeight: "bold",
    fontSize: 8,
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
    padding: 5,
    borderRight: "1px solid #000", // Add a border to the container
    flex: 1, // Allow 21a to take up half the space
    marginRight: 10, // Add spacing between 21a and 21b
  },
  attendantSection4: {
    padding: 5,
    flex: 1, // Allow 21b to take up half the space
    marginLeft: 10, // Add spacing between 21a and 21b
  },
  attendantSectionTitle: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 10, // Add spacing below the title
  },
  attendantContainer: {

    padding: 5, // Add padding inside the container
    flexDirection: "column", // Stack fields vertically
    gap: 5, // Add spacing between fields
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
    fontSize: 8,
    fontWeight: "bold",
  },
  attendantValue: {
    fontSize: 8,
    borderBottom: "1px solid #000", // Add a bottom border to the value
    paddingBottom: 2, // Add spacing below the value
  },

  certificationSection11: {
    
    borderRight: "1px solid #000",
    borderLeft: "1px solid #000",
    borderBottom: "1px solid #000",
  },

  // Section title
  certificationTitle: {
    borderBottom: "1px solid #000",
    width: "100%",
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
  },

  // Field container
  fieldContainer11: {
    flexDirection: "row",
    marginBottom: 2,
    padding: 5,
  },

  // Labels
  attendedLabel: {
    width: "40%",
    fontSize: 8,
    fontWeight: "bold",
  },
  deathDateTimeLabel: {
    width: "40%",
    fontSize: 8,
    fontWeight: "bold",
  },
  nameLabel: {
    width: "40%",
    fontSize: 8,
    fontWeight: "bold",
  },
  titleLabel: {
    width: "40%",
    fontSize: 8,
    fontWeight: "bold",
  },

  // Values
  attendedValue: {
    width: "60%",
    fontSize: 8,
  },
  deathDateTimeValue: {
    width: "60%",
    fontSize: 8,
  },
  nameValue: {
    width: "60%",
    fontSize: 8,
  },
  titleValue: {
    width: "60%",
    fontSize: 8,
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
    padding: 5,
  },
  burialCremationCell: {
    width: "32%",
    borderRight: "1px solid #000",
    padding: 5,
  },
  transferPermitCell: {
    width: "32%",
    padding: 5,
  },

  // Labels
  corpseDisposalLabel: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 5,
  },
  burialCremationLabel: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 5,
  },
  transferPermitLabel: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 5,
  },

  // Values
  corpseDisposalValue: {
    fontSize: 8,
  },
  burialCremationValue: {
    fontSize: 8,
  },
  transferPermitValue: {
    fontSize: 8,
  },
  fieldContainer222: {
    flexDirection: "column",
    padding: 5,
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
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
  preparedByTitle: {
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
  receivedByTitle: {
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
  registeredAtCivilRegistrarTitle: {
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
  },

  // Field containers
  fieldContainer12: {
    flexDirection: "column",
  },

  // Labels
  label12: {
    fontSize: 8,
    fontWeight: "bold",
    marginBottom: 2,
  },

  // Values
  value12: {
    fontSize: 8,
  },
  
});