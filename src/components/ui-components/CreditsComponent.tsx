import React from "react";
import { Box } from '@chakra-ui/react';
import creditBadgeIcon from "../../assets/svg/creditBadgeIcon.svg"


export const CreditsComponent = (props: any) => {
    const {borderColor, credits} = props;
    return (
        <Box 
          sx={{
            // width: "57px",
            minWidth: "57px",
            height: "28px",
            padding: "3px 3px",
            border: borderColor,
            borderRadius: "35px",
            boxSizing: "border-box",
            display: "flex",
            gap: "5px",
            backgroundColor: "#FFF5CC"
          }}>
            <img src={creditBadgeIcon.src} alt="credit icon" />
            <Box
            sx={{
              fontWeight: "400",
              fontSize: "12px",
              color: "#131313",
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "center"
            }}
            >{credits}</Box>
          </Box>
    )
}