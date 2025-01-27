import { StyleSheet } from "@react-pdf/renderer";

export const back = StyleSheet.create({
  page: {
    padding: 10,
  },
  container: {
    border: "1px solid #000",
  },
  columnContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: 11,
  },
  headerTitle: {
    fontSize: 16,
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
    fontSize: 11,
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
    marginTop: 5,
    flexWrap: "wrap",
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
});
