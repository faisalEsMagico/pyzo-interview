import { Box } from '@chakra-ui/react'
import React from 'react'

const HorizontalLabelValuePair = ({ label, value }: { label: string, value: string | number }) => {
    return (
        <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}
        >
            <Box sx={{ fontSize: "12px", color: "#737373", }}>{label}: </Box>
            <Box sx={{ fontSize: '14px', color: "#000000" }}>{value}</Box>
        </Box>
    )
}

export default HorizontalLabelValuePair