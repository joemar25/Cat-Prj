import { StyleSheet } from "@react-pdf/renderer";

export const back = StyleSheet.create({
  page: {
    padding: 10,
    backgroundColor: '#E4E4E4',
  },
  container: {
    border: "1px solid #000",
  },
  columnContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: 10,
  },
  headerTitle: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    fontWeight: "extrabold",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 9,
    textAlign: "center",
  },
  rowContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    gap: 10,
  },
  signatureBlock: {
    width: "48%", // Adjusted to fit both blocks with gap
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  textStyle: {
    fontSize: 10,
  },
  signatureText: {
    width: "100%",
    borderBottom: "1px solid #000",
    textAlign: "center",
  },
  captionText: {
    color: "#666",
    fontSize: 9,
  },
  formRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  formField: {
    marginLeft: 10,
    width: 225,
    borderBottom: "1px solid #000",
    textAlign: "center",
  },
  formFieldWide: {
    marginLeft: 10,
    width: 250,
    borderBottom: "1px solid #000",
    textAlign: "center",
  },
  formFieldWider: {
    marginLeft: 10,
    width: "100%",
    borderBottom: "1px solid #000",
    textAlign: "center",
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#000",
    marginRight: 6,
    justifyContent: "center",
    alignItems: "center",
  },
});
