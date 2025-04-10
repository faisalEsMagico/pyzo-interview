import { Box } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import UserSelect from './ui-components/UserSelect'
import profile from '../assets/images/profileImg.png'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import LogoutBtn from './ui-components/LogoutBtn'
import bellIcon from '../assets/svg/bellIcon.svg'
import creditBadgeIcon from "../assets/svg/creditBadgeIcon.svg"
import {getCredits} from "../services/credits"
import { useCredits } from "../context/CreditsContext"
import { CreditsComponent } from './ui-components/CreditsComponent'
function transformString(str: string) {
  return str
    .split('-') // Split the string by hyphen
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(' '); // Join the words with a space
}

const TopNavbar = () => {
  const router = useRouter();
  const currentRoute = router.pathname;
  const pathName = currentRoute.split('/');
  const { credits, setCredits, openSidebar, handleGetCredits } = useCredits();
  const [userDetails, setUserDetails] = useState({
    name: '',
    profile: '',
    company: ""
  })

  const handleLogout = () => {
    localStorage.clear();
    toast.success('sign out successful')
    router.push('login')
  }

  // const handleGetCredits = async () => {
  //   const recruiterId = localStorage.getItem('userId')
  //   let response;
  //   if(recruiterId) {
  //     try {
  //       response = await getCredits(recruiterId);
  //       console.log("credits Response>>>>>>>>>>>>", response);
  //       setCredits(response.credits);
  //     } catch (error) {
  //       toast.error("Something went wrong!")
  //     } 
  //   }
  // }

  const getUserDetails = async () => {
    const name = await localStorage.getItem('userName') ?? '';
    const profile = await localStorage.getItem('userProfile') ?? '';
    const orgName = await localStorage.getItem('companyName') ?? '';
    setUserDetails({
      name: name,
      profile: profile,
      company: orgName
    })
  }

  useEffect(() => {
    getUserDetails()
    handleGetCredits();
  }, [])

  return (
    <Box
      sx={{
        marginLeft: "200px",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFFFFF",
        zIndex: 20
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "8px 20px",
        }}
      >
        <Box
          sx={{
            fontWeight: 600,
            fontSize: "18px",
            color: "#1D1F2C"
          }}
        >{transformString(pathName[1])}</Box>
        <Box
          sx={{
            display: "flex",
            gap: "20px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* <Box 
          sx={{
            // width: "57px",
            height: "28px",
            padding: "3px 3px",
            border: "2px solid #FFCC00",
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
              alignItems: "center"
            }}
            >{credits}</Box>
          </Box> */}
          <Box onClick={openSidebar}>
          <CreditsComponent borderColor={"2px solid #FFCC00"} credits={credits}/>
          </Box>
          
          <img src={bellIcon.src} alt="icon" />
          <UserSelect
            onChange={() => { }}
            value={userDetails?.name}
            logo={userDetails?.profile}
            placeholder=''
            options={[{ label: "Logout", value: "logout" }]}
          />
          <Box
            fontSize={'18px'} fontWeight={600} color={'#003D86'}
          >
            {userDetails?.company}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default TopNavbar