import React, { useEffect, useState } from 'react';
import { useCredits } from '../context/CreditsContext';
import { Box } from '@chakra-ui/react';
import { CreditsComponent } from './ui-components/CreditsComponent';
import closeIcon from "../assets/svg/CloseIcon.svg"
import pCoinIcon from "../assets/svg/PCoinIcon.svg";
import csvFileIcon from "../assets/svg/CSVfileDownloadIcon.svg";
import { convertToCSV } from "../utils/converToCSV"

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreditHistoryDrawer: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { credits , creditHistory} = useCredits();


    const downloadCSV = () => {
        const csvContent = convertToCSV(creditHistory);
        // console.log(csvContent, "downloadCSV")
    
        // Create a blob from the CSV content
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
        // Create a link element and trigger a download
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'credit-history.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };


  return (
    <>
      {/* Backdrop */}
      {isOpen && <Box
      sx={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: "100",
        display: isOpen ? "block" : "none"
      }}
        onClick={onClose}></Box>}
      
      {/* Sidebar */}
      <Box 
        sx={isOpen ? {
            position: "fixed",
            top: "0",
            // right: "-300px",
            width: "405px",
            height: "100%",
            backgroundColor: "white",
            boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.3)",
            transition: "right 0.3s ease",
            zIndex: "200",
            right: "0",
            // padding: "12px 16px"
        }: 
        {
            position: "fixed",
            top: "0",
            right: "-405px",
            width: "405px",
            height: "100%",
            backgroundColor: "white",
            boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.3)",
            transition: "right 0.3s ease",
            zIndex: "200",
        }
    
    }
      >
        <Box
            sx={{
                display: "flex",
                borderBottom: "1px solid #E5E5E5",
                padding: "12px 16px",
                gap: "12px"
            }}
        >
                <Box 
                sx={{
                    // padding: "1rem",
                    // borderBottom: "1px solid #ddd"
                    fontWeight: "600",
                    fontSize: "16px",
                    color: "#2C313B"
                }}>
                    Credit History
                </Box>
                <CreditsComponent borderColor={"2px solid #FFCC00"} credits={credits}/>
                <Box
                    sx={{display: "flex", flexGrow: "1",
                        justifyContent: "flex-end"}}
                >
                    <img onClick={onClose} src={closeIcon.src} alt="Close icon" style={{maxWidth: "none"}}/>
                </Box>
                
            </Box>
        
        
        <Box 
            sx={{
                // border: "1px solid red",
                padding: "20px 16px",
                height: "100%",
                display: "flex",
                flexDirection: "column"
            }}
        >
          <Box 
          sx={{overflow: "auto", height: "85%"}}
          >
                {creditHistory.map((creditField) => <Box key={creditField?.id}
                    sx={{
                        display: "flex",
                        borderBottom: "1px solid #D9D9D9",
                        gap: "13px",
                        // height: "42px",
                        // alignItems: "center",
                        padding: "10px 0px 10px 0px"
                    }}
                >
                    <Box >
                        <img src={pCoinIcon.src} alt="P coin" style={{maxWidth: "none"}}/>
                    </Box>
                    <Box
                        sx={{
                            fontWeight: "600",
                            fontSize: "16px",
                            color: "#172B4D",
                            flexGrow: 1
                        }}
                    >{creditField?.description}</Box>
                    <Box
                        sx={{
                            color: creditField?.transaction_type === "Deduction" ? "#E25247": creditField?.transaction_type === "Addition"? "green" : ""
                        }}
                    >
                        {creditField?.transaction_type === "Deduction" ?<span>-</span>: creditField?.transaction_type === "Addition"? <span>+</span> : "" }
                        {creditField?.credits}
                    </Box>
                </Box>)}
          </Box>
          <Box
            sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                backgroundColor: "#003D86",
                borderRadius: "5px",
                padding: "7.5px",
                color: "#FFFFFF",
                gap: "10px",
                fontSize: "14px",
                fontWeight: "500",
                justifyContent: "center",
                marginTop: "20px",
                cursor: "pointer"
            }}
            onClick={() => downloadCSV()}
          >
            Download CSV
            <img src={csvFileIcon.src} alt="csv" />
          </Box>
        </Box> 
      </Box>
    </>
  );
};

export default CreditHistoryDrawer;
