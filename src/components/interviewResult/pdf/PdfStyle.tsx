import { Font, StyleSheet } from "@react-pdf/renderer";

Font.register({
    family: "Outfit",
    fonts: [
        {
            src: "https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4TC1C4G-EiAou6Y.ttf",
            fontWeight: 400,
        },
        {
            src: "https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4QK1C4G-EiAou6Y.ttf",
            fontWeight: 500,
        },
        {
            src: "https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4e6yC4G-EiAou6Y.ttf",
            fontWeight: 600,
        },
        {
            src: "https://fonts.gstatic.com/s/outfit/v11/QGYyz_MVcBeNP4NjuGObqx1XmO1I4deyC4G-EiAou6Y.ttf",
            fontWeight: 700,
        },
    ],
});

export const styles = StyleSheet.create({
    pdfViewer: {
        width: "100vw",
        height: "100vw",
    },
    image1: {
        height: "18px",
        width: "150px",
    },
    image2: {
        height: "22px",
        width: "42px",
    },
    headingText: {
        fontFamily: "Outfit",
        textAlign: "center",
        fontSize: "20px",
        color: "#272727",
        fontWeight: "semibold",
    },
    TopNavbar: {
        backgroundColor: "#F7F9FC",
        padding: "12px 20px",
    },

    mainContainer: {
        margin: "20px 30px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    userDetails: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
    },
    profilePhoto: {
        width: "40px",
        height: "40px",
        borderRadius: "4px",
    },
    userName: {
        fontFamily: "Outfit",
        fontSize: "9px",
        // fontWeight: "normal",
        textAlign: "left",
    },
    userEmail: {
        fontFamily: "Outfit",
        fontSize: "9px",
        textAlign: "left",
        // fontWeight: "normal",
    },
    flexContainer1: {
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        justifyContent: "flex-end",
        alignItems: "center",
        border: "1px solid #E0E2E7",
        padding: "8px",
        borderRadius: "4px",
       marginLeft:"20px",
    },
    flexContainer2: {
        display: "flex",
        flexDirection: "row",
        gap: "5px",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    flexContainer3: {
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        alignItems: "flex-start",
        marginBottom: "10px",
    },
    textStyle2: {
        fontFamily: "Outfit",
        fontSize: "10px",
        fontWeight: "normal",
        textAlign: "left",
        marginBottom: "10px",
        color: "#1D1F2C",
        margin: "auto",
    },
    detailsBorder: {
        borderBottom: "0.6px solid #6A6A6A",
        margin: "0px 30px",
    },
    questionContainer: {
        margin: "10px 30px",
    },
    quesStyle: {
        fontFamily: "Outfit",
        fontSize: "11px",
        fontWeight: "semibold",
        color: "#003D86",
        flex: 1,

    },
    ansStyle: {
        fontFamily: "Outfit",
        fontSize: "10px",
        color: "#282C36",
        fontWeight: "normal",
        flex: 1,
    },
    ansHeadingStyle: {
        fontFamily: "Outfit",
        fontSize: "11px",
        color: "#282C36",
        fontWeight: "normal",
    },
    ansStyle1: {
        fontFamily: "Outfit",
        fontSize: "10px",
        color: "#131313",
        marginBottom: "10px"
    },
    scoreLogicContainer: {
        backgroundColor: "#F7F9FC",
        padding: "10px",
    },
    scoreTextStyle: {
        fontFamily: "Outfit",
        fontSize: "11px",
        fontWeight: "semibold",
        color: "#858D9D",
        marginBottom: "5px"
    },
    container: {
        marginTop: "20px"
    },


    personalDetails: {
        display: "flex",
        flexDirection: 'row',
        gap: "20px"
    },
    label: {
        color: '#7E8086',
        fontFamily: "Outfit",
        fontSize: '10px',
        fontWeight: "medium",
        marginTop: "5px"
    },
    skillContainer: {

        display: "flex",
        justifyContent: "space-between",
        flexDirection: "row",
        gap: "0px",
        marginTop: "10px",
        width: "45%"

    },
    skillMainContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "20px",
        alignItems: "flex-start",
    },
    skillText: {
        fontSize: '10px',
        fontWeight: "semibold",
        color: '#7E8086',
        width: "50%"
    },
    scoreText: {
        fontSize: '10px',
        fontWeight: "semibold",
        color: '#1D1F2C'
    },
    progressBar: {
        border: "3px solid #2D8DFF",
        color: '#1D1F2C',
        width: '130px',
        height: "130px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",

    },
    overallScore: {
        fontSize: "24px",
        fontWeight: "bold",
    },
    overallOutOff: {
        fontSize: "16px",
        fontWeight: "bold",
    },
    overallScoreText: {
        fontSize: "14px",
        fontWeight: "bold",
        width: "50%",
        textAlign: 'center'
    },
    sentimentScoreText: {
        fontSize: "14px",
        fontWeight: "bold",
        width: "70%",
        textAlign: 'center'
    },
    Heading: {
        fontFamily: "Outfit",
        fontSize: "9px",
        textAlign: "left",
        paddingBottom: '1px',
        textDecoration: "underline"
    },
    evaluationReasonText: {
        fontSize: "10px",
        color: '#131313',
        marginTop: "10px",
        lineHeight: "1.3px"
    },
    evaluationReasonContainer: {
        marginTop: "20px",

    },
    circleContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        margin: "auto",
        gap: "50px"
    },
    skillFlex: {
        display: 'flex',
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "10px"
    },
    questionAnswerContainer: {
        border: "1px solid #E0E2E7",
        borderRadius: "12px",
        overflow: 'hidden',
        marginTop: '16px'
    },
    questionCount: {
        color: '#667085',
        fontSize: "11px",
        fontWeight: "semibold",
        padding: '10px',
        borderBottom: "1px solid #E0E2E7",
    },
    questionPadding: {
        padding: "10px"
    },
    table: {
        width: 'auto',
        padding: "25px",
        color: "#131313"
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableCol1: {
        width: '10%',
        padding: 3,
    },
    tableCol2: {
        width: '25%',
        padding: 3,
    },
    tableCol3: {
        width: '15%',
        padding: 3,
        textAlign: "center"
    },
    tableCol4: {
        width: '50%',
        padding: 3,
    },
    tableHeader: {
        backgroundColor: '#F7F9FC',
        fontWeight: 'bold',
        fontSize: "9px"
    },
    tableCell: {
        padding: '4px',
    },
    tableBodyText: {
        fontSize: '9px',
        borderBottom: '1px solid #E0E2E7',
    },
    tableHeading: {
        fontSize: 16,
        marginBottom: 8,
        textAlign: 'start',  
    }
});
