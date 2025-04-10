import { Box } from '@chakra-ui/react'
import React from 'react'

const LabelValuePair = ({ label, value, isUrl = false }:
    { label: string, value: string | number, isUrl?: boolean, }) => {
    return (
        <Box>
            <Box
                sx={{
                    fontSize: "12px",
                    fontFamily: "Inter-regular",
                    fontWeight: 400,
                    color: "#737373"
                }}
            >
                {label}
            </Box>
            {isUrl && typeof value==='string' ? <a style={{color:"#5D79C2",fontSize:"14px",fontFamily:"Inter-regular"}} href={value} target='_blank' rel="noreferrer" >{value}</a> : <Box
                sx={{
                    fontSize: "14px",
                    fontFamily: "Inter-regular",
                    fontWeight: 400,
                    color: "#000000"
                }}
            >{value}</Box>}
        </Box>
    )
}

export default LabelValuePair