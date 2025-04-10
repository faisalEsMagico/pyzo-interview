import { Box } from '@chakra-ui/react'
import React from 'react'
import SideBar from './SideBar'
import TopNavbar from './TopNavbar'

const Layout = ({ children }: { children: any }) => {
    return (
        <Box
            display={"flex"}
            width="100%"
            height="100%"

        >
            <SideBar drawerWidth="200px" />
            <Box sx={{ backgroundColor: "#FFFFFF", }}>
                <Box position={'relative'} width={'100vw'}>
                    <TopNavbar />

                    {children}
                </Box>
            </Box>
        </Box>
    )
}

export default Layout