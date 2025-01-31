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
        padding: 5,
    },
    headerTitle:{
        fontSize: 15,
        fontFamily: "Helvetica-Bold",
        fontWeight: "extrabold",
        marginBottom: 3,
        textTransform: 'uppercase',
    },
    titleBold:{
        fontFamily: "Helvetica-Bold",
        fontSize:10,

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
        gap: 3,
        padding: 5,
        width: '100%',
    },
    gridRowChild:{
        display: 'flex',
        flexDirection: 'row',
        gap: 3,
        width: '100%',
    },
    gridColumnParent:{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        width: '100%',
    },
    gridColumnChild:{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        width: '100%',
    },
    title:{
        fontSize: 10,
        fontWeight: 'bold',
        width: '100%',
    },
    normalTitle:{
        fontSize: 10,
        fontWeight: 'bold',
        width: 'auto'
    },
    longTitle:{
        width: '100%',
    },
    value:{
        width: '100%',
        borderBottom: '1px solid #000',
        fontSize: 10,
        textAlign: 'center',
    },
    value2:{
        width: '100%',
        borderBottom: '1px solid #000',
        borderStyle: 'dashed',
        fontSize: 10,
        textAlign: 'center',
    },
    radioBox:{
        height:15,
        width:15,
        border: '1px solid #000',
    },
    paddingLeft:{
        paddingLeft: 40,
    },
    marginLeft:{
        marginLeft: 40,
    }
});