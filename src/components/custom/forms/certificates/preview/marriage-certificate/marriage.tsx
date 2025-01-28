import { StyleSheet} from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 10,
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: "row",
    textAlign: "center",
    justifyContent: "space-between",
    marginBottom: 15,
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
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 10,
    marginBottom: 2,
  },
  headerNote1: {
    fontSize: 8,
    marginBottom: 2,
    color: "#666",
  },
  headerNote2: {
    fontSize: 8,
    marginBottom: 2,
    color: "#666",
    width: 100,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    borderBottom: '1px solid #000',
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    border: '1px solid #000',
  },
  gridColumn: {
    padding: 5,
  },
  gridHeader: {
    fontSize: 10,
    color: '#666',
    fontWeight: 'bold',
  },
  flexColumn: {
    padding: 5,
    flexDirection: 'column',
  },
  fieldContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  label: {
    fontSize: 10,
    color: '#666',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 10,
  },

  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  
});