import { Box } from '@chakra-ui/react'
import React from 'react'

const TextHeading = ({ text, required = false,color='#E5E5E5' }: { text: string, required?: boolean,color?:string }) => {
    return (
        <Box sx={{ color: color, fontSize: '14px', fontWeight: 700, margin: "15px 0px 7px 0px" }}>{text}{required && <span style={{ color: "red" }}>*</span>} </Box>
    )
}

export default TextHeading