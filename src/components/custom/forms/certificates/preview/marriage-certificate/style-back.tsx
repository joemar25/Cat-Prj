import { StyleSheet} from '@react-pdf/renderer';


export const back = StyleSheet.create({
    page: {
        padding: 10,
        backgroundColor: '#E4E4E4',
        width: '100%',
        height: '100%',
        border: '1px solid #000',
    },
    parentBorder:{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        border: '1px solid #000',
        padding: 10,
    },
    headerTitle:{
        fontSize: 15,
        fontFamily: "Helvetica-Bold",
        fontWeight: "extrabold",
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    centeredText:{
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridRowParent:{
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        paddingTop: 5,
        width: '100%',
    },
    gridRowChild:{
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        width: '100%',
    },
    gridColumnParent:{
        display: 'flex',
        flexDirection: 'column',
        padding: 10,
        gap: 5,
        width: '100%',
    },
    gridColumnChild:{
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        width: '100%',
    },
    title:{
        fontSize: 11,
        fontWeight: 'bold',
        width: '100%',
    },
    normalTitle:{
        fontSize: 11,
        fontWeight: 'bold',
    },
    longTitle:{
        width: '100%',
    },
    value:{
        width: '100%',
        borderBottom: '1px solid #000',
        fontSize: 11,
        textAlign: 'center',
    },
    radioBox:{
        height:20,
        width:20,
        border: '1px solid #000',
    },
    paddingLeft:{
        paddingLeft: 40,
    }
});