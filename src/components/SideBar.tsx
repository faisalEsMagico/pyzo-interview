import { Box } from '@chakra-ui/react'
import React from 'react'
import esmagicoLogo from "../assets/images/esmagicoLogo.png";
import logoImage from "../assets/images/PyzoLogo.png";
import copy from '../../assets/svg/copy.svg'
import { useRouter } from 'next/router';
import analyticsIcon from '../assets/svg/analyticsIcon.svg'
import jobListIcon from '../assets/svg/jobListingIcon.svg'
import applicationReviewIcon from '../assets/svg/applicationReview.svg'
import interviewResultIcon from '../assets/svg/interviewResultIcon.svg'
import { IoChevronDownSharp, IoChevronUpSharp } from 'react-icons/io5';

const navItems = [
    // {
    //     text: "Analytics",
    //     icon: analyticsIcon,
    //     url: "/analytics",
    // },
    {
        text: "Job Listing",
        icon: jobListIcon,
        url: "/job-listing",
        routes: [
            {
                text: 'View job listings',
                url: "/job-listing"
            },
            {
                text: 'Create job listings',
                url: "/job-listing/create-new-job"
            }
        ]
    },
    {
        text: "Applications",
        icon: applicationReviewIcon,
        url: "/applications",
        routes: [
            {
                text: 'View Applications',
                url: "/applications"
            },
            {
                text: 'Applicant Details',
                url: "/applicant-details",
                notRoute: true
            }
        ]
    },
    {
        text: "Interview Results",
        icon: interviewResultIcon,
        url: "/interview-results",
        routes: [
            {
                text: 'View Interview Results',
                url: "/interview-results"
            },
            {
                text: 'Applicant Results',
                url: "/applicant-result",
                notRoute: true
            }
        ]
    },
];

const SideBar = ({ drawerWidth }: { drawerWidth: string }) => {
    const router = useRouter();
    const currentRoute = router.pathname;
    return (
        <Box sx={{
            width: drawerWidth,
            position: "fixed",
            top: 0,
            bottom: 0,
            backgroundColor: "#FFFFFF",
            borderRight: "0.7px solid #F0F1F3",
            zIndex: 3
        }}>
            {/* <Box sx={{
                margin: "18px",
                fontSize: "26px",
                fontWeight: 600,
                color: "#003D86",
                fontStyle: "italic"
            }}>logo</Box> */}

            <Box
                sx={{
                    marginLeft: "30px",
                    marginTop:"20px",
                    
                }}
            >
                <img
                    src={logoImage.src}
                    //alt="Logo"
                    style={{ width: "140px",  }}
                />
            </Box>
            <Box >
                {navItems?.map((item, i) => {
                    return <Box
                        key={i}
                        mt='20px'
                    >
                        <Box
                            onClick={() => router.push(item.url)}
                            sx={{

                                margin: '10px 6px',
                                borderRadius: "8px",
                                cursor: "pointer",
                                display: "flex",
                                justifyContent: 'space-between',
                                px: '6px'
                            }}  >

                            <Box sx={{
                                display: 'flex',
                                fontWeight: 600,
                                color: "#0B1B32",
                                gap: "10px",
                                fontSize: "12px",
                            }}> <img src={item.icon.src} alt="icon" /> {item.text}</Box>
                            {(currentRoute.includes(item.routes[0].url) || currentRoute.includes(item.routes[1].url)) ?
                                <IoChevronUpSharp /> : <IoChevronDownSharp />
                            }
                        </Box>
                        {(currentRoute.includes(item.routes[0].url) || currentRoute.includes(item.routes[1].url)) && item.routes?.map((routes, ind) => {
                            return <Box
                                key={ind}
                                bg={currentRoute == routes.url ? '#F5F6F8' : ''}
                                fontSize={'12px'}
                                fontWeight={600}
                                p={'6px 12px 6px 28px'}
                                mx='6px'
                                color={currentRoute == routes.url ? '#0B1B32' : '#7E8794'}
                                borderRadius={'8px'}
                                onClick={() => routes?.notRoute ? () => { } : router.push(routes.url)}
                                cursor={routes?.notRoute ? '' : 'pointer'}
                            >{routes.text}</Box>
                        })}
                    </Box>
                })}

            </Box>
            <Box sx={{
                position: "absolute",
                bottom: "50px",
                paddingLeft: "23px"
            }}>
                <div
                    style={{
                        fontFamily: "Inter-regular",
                        fontSize: "15px",
                        fontWeight: 600,
                        lineHeight: "12px",
                        textAlign: "left",
                        marginBottom: "12px",
                        color: "#000000"
                    }}
                >
                    Powered
                </div>
                <a href="https://www.esmagico.in/" target="_blank" rel="noreferrer"
                    style={{
                        display: "flex",
                        gap: "5px",
                        color: "#075FCC",
                        fontSize: "12px",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                    By   <img
                        src={esmagicoLogo.src}
                        alt="logo"
                        style={{ width: "78px", height: '10px' }} />{" "}
                </a>
            </Box>
        </Box>
    )
}

export default SideBar