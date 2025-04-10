import React, { useState } from 'react'
import { Box, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay } from '@chakra-ui/react'
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { version } from 'pdfjs-dist';
import LabelValuePair from '../ui-components/LabelValuePair';

const ApplicationOverviewPopup = ({ isOpen, onClose, data }:
    { isOpen: boolean, onClose: () => void, data: any }) => {

    const OverlayOne = () => (
        <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(10px) hue-rotate(90deg)'
        />
    )
    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose} size='full'>
            {OverlayOne()}
            {/* @ts-ignore */}
            <ModalContent>
                <ModalCloseButton />
                <ModalBody >
                    <Box
                        sx={{
                            fontFamily: "Inter-regular",
                            fontSize: "24px",
                            fontWeight: 700,
                            color: "#000000",
                            borderBottom: "1px solid #E4E4E4",
                            paddingBottom: "20px",
                            marginBottom: "20px",

                        }}
                    >Application Overview
                        <span style={{
                            backgroundColor: data?.status === 'Accepted' ? "#009220" : "",
                            color: "#FFFFFF",
                            fontWeight: 600,
                            fontSize: "16px",
                            padding: "8px",
                            marginLeft: "10px",
                            borderRadius: "2px"
                        }}>{data?.status}</span>
                    </Box>
                    <Box sx={{ display: "flex", gap: "12px" }} >
                        <Box
                            sx={{
                                padding: "16px",
                                border: "1px solid #E4E4E4",
                                borderRadius: "8px",
                                width: "50%"
                            }}
                        >
                            <Box
                                sx={{
                                    fontFamily: "Inter-regular",
                                    fontSize: "14px",
                                    fontWeight: 700,
                                    paddingBottom: "16px",
                                    borderBottom: "1px solid #D9D9D9"
                                }}
                            >
                                Details
                            </Box>
                            <Box sx={{
                                display: "grid",
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: "40px",
                                margin: "16px 0px 80px 0px"
                            }}>
                                <LabelValuePair
                                    label="Applicant Name"
                                    value={data?.name}
                                />
                                <LabelValuePair
                                    label="Phone Number"
                                    value={data?.phone}
                                />
                                <LabelValuePair
                                    label="Email"
                                    value={data?.email}
                                />
                                <LabelValuePair
                                    label="Years of Experience"
                                    value={data?.years_of_experience}
                                />
                                <LabelValuePair
                                    label="Salary"
                                    value={data?.expected_CTC}
                                />
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                width: "50%", border: '1px solid #ccc',
                                boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <Box>
                                <Box
                                    sx={{
                                        fontSize: "14px",
                                        fontWeight: 700,
                                        fontFamily: "Inter-regular",
                                        margin: '16px',
                                        textAlign: "center"
                                    }}
                                >Resume</Box>
                                <Box
                                    sx={{
                                        width: '100%', 
                                        height: '65vh',
                                        padding: '10px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {data?.cv_url && <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.js`}>
                                        <Viewer
                                            fileUrl={data?.cv_url}
                                        //   onLoadSuccess={onDocumentLoadSuccess}
                                        />
                                    </Worker>}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal >
    )
}

export default ApplicationOverviewPopup