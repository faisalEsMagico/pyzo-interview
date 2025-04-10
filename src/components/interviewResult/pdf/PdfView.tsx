import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import FeedbackPdf from "./FeedbackPdf";
import { styles } from "./PdfStyle";
const PdfView = () => {
    return (
        <div>
            <PDFViewer style={styles.pdfViewer}>
                <FeedbackPdf />
            </PDFViewer>
        </div>
    );
};

export default PdfView;
