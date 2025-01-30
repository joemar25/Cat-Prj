import { StyleSheet } from "@react-pdf/renderer";

export const style = StyleSheet.create({
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
        fontSize: 14,
        fontFamily: "Helvetica-Bold",
        fontWeight: "extrabold",
        textTransform: 'uppercase',
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
    label2: {
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
        fontSize: 15,
        fontWeight: 'bold',
        borderBottom: '1px solid #000',
        textAlign: 'center',
    },
    gridContainer: {
        flexDirection: 'row',
        border: '1px solid #000',
    },
    gridColumn: {
        flexDirection: 'column',
        border: '1px solid #000',
    },
    gridHeader: {
        fontSize: 10,
        color: '#666',
        fontWeight: 'bold',
    },
    flexColumn: {
        flexDirection: 'column',
    },
    fieldContainer: {
        width: 250,
        padding: 5,
    },
    fieldContainer2: {
        width: 250,
        padding: 5,
        borderRight: '1px solid #000',
    },
    flex1: {
        flex: 1
    },
    label: {
        fontSize: 10,
        color: '#666',
        fontWeight: 'bold',
    },
    value: {
        fontSize: 10,
        paddingTop: 5
    },
    valueLine: {
        fontSize: 10,
        borderBottom: '1px solid #000',
        textAlign: 'center',
        width: '100%',
    },
    valueCenter: {
        fontSize: 10,
        textAlign: 'center'
    },
    paddingGlobal: {
        padding: 5
    },
    paddingLeft: {
        paddingLeft: 20
    },
    flexRow: {
        flexDirection: 'row',
    },
    labelContainer: {
        display: 'flex',
        alignItems: 'baseline',
        width: '100%',
        marginBottom: '8px',
    },
})