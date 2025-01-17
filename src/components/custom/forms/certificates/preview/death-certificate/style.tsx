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
    fontSize: 12,
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
    width: 120,
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
    marginBottom: 10,
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
    fontSize: 12,
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
  PlaceOfDeathParent:{
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

  sectionTitleContainer:{
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
    borderBottom: "1px solid #000",
  },
  medicalCertificate: {
    border: "1px solid #000",
    width: "100%",
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
});
