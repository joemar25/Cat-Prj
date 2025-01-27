import { StyleSheet } from '@react-pdf/renderer';

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
    padding: 3,
    borderBottom: '1px solid #000',
  },
  nameFieldContainer: {
    width: '100%',
    flexDirection: 'column',
    marginBottom: 0,
    borderBottom: '1px solid #000',
  },
  nameLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 1,
  },
  nameInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameInput: {
    width: '30%',
    fontSize: 10,
  },
  verticalText: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  label: {
    width: '100%',
    fontSize: 10,
    color: '#666',
    marginBottom: 1,
  },
  value: {
    width: '100%',
    fontSize: 10,
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
    fontSize: 10,
    color: '#666',
    marginBottom: 1,
  },
  dateInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    width: '30%',
    fontSize: 10,
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
    fontSize: 10,
    color: '#666',
  },
  sexValue: {
    fontSize: 10,
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
    fontSize: 10,
    color: '#666',
  },
  placeOfBirthValue: {
    fontSize: 10,
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
    fontSize: 10,
    color: '#666',
  },
  bottomGridValue: {
    fontSize: 10,
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
    marginBottom: 10,
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
  textStyle:{
    fontSize: 10,
  }
});