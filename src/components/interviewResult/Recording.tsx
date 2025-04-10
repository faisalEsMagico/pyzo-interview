import { Box, Button } from '@chakra-ui/react'
import React, { useState } from 'react'
import { PiVideoFill } from "react-icons/pi";
import MuiCheckbox from '../ui-components/MuiChackbox';

const result = [
    'test1',
    'test2',
    'test3'
]

const Recording = () => {
    const [data, setData] = useState<string[]>([])

    const handleChange = (e: any) => {
        const { name, checked } = e.target;
        if (checked) {
            setData((pre: any) => {
                return [...pre, name];
            });
        } else {
            let newData = [...data]
            newData = newData.filter((item: any) => item !== name);
            setData(newData);
        }
    }

    return (
        <Box>
            <Box
                sx={{ marginTop: "23px", display: "flex", gap: '100px' }}
            >
                <Box>
                    <Box
                        sx={{ color: "#272727", fontWeight: 700, fontSize: '14px', marginBottom: "16px" }}
                    >
                        Video Recording
                    </Box>
                    <Box sx={{ display: "flex", gap: "16px", alignItems: "center", justifyContent: "center" }}>

                        <Box
                            sx={{ color: '#5D79C2', fontWeight: 300, fontSize: '14px', gap: '10px', backgroundColor: '#F6F6F6', padding: "10px 20px", borderRadius: "8px" }}
                        >
                            <a style={{ display: "flex", alignItems: "center", gap: '10px', }} href=""> <PiVideoFill color='#333F51' size={32} /> Interview 15 Apr 2024 Recording.MP4</a></Box>

                        {/* @ts-ignore */}
                        <Button onClick={() => { }} bg='#000000' color={'#FFFFFF'}>Proctor</Button>
                    </Box>
                </Box>
                <Box>
                    <Box
                        sx={{ color: "#272727", fontWeight: 700, fontSize: '14px', marginBottom: "16px" }}
                    >
                        Screen Recording
                    </Box>
                    <a href=""><Box
                        sx={{ color: '#5D79C2', fontWeight: 300, fontSize: '14px', display: "flex", alignItems: "center", gap: '10px', backgroundColor: '#F6F6F6', padding: "10px 20px", borderRadius: "8px" }}
                    >
                        <PiVideoFill color='#333F51' size={32} /> Interview 15 Apr 2024 Recording.MP4</Box>
                    </a>
                </Box>
            </Box>
            <Box sx={{ marginTop: "23px", backgroundColor: "#F6F6F6", borderRadius: "10px", padding: "24px 16px" }}>

                {result?.map((item, index) => {
                    return <Box key={index} mt="10px">
                        <MuiCheckbox
                            label={item}
                            checked={data.includes(item)}
                            onChange={handleChange}
                        />
                    </Box>
                })}
                <Box sx={{ display: "flex", gap: "10px", marginTop: '16px' }}>
                    {/* @ts-ignore */}
                    <Button
                        onClick={() => { }}
                        bg='#009220'
                        color={'#FFFFFF'}
                    >
                        Mark As Clear
                    </Button>
                    <Button
                        onClick={() => { }}
                        bg='#F31212'
                        color={'#FFFFFF'}
                    >
                        Mark As Suspicious
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default Recording