import React, { useEffect, useState } from "react";

import loginImage from "../../assets/images/loginImage.png";
import { Box, Button } from "@chakra-ui/react";
import Label from "../../components/ui-components/Label";
import InputField from "../../components/ui-components/InputField";
import { useRouter } from "next/router";
import { isValidLoginDetails, isValidUserLoginDetails } from "../../utils/validation";
import { createNewUser, OTPVerification, signInUser } from '../../services/signIn';
import toast from "react-hot-toast";
import { CircularProgress, Backdrop } from "@material-ui/core";
import OtpInput from "../../components/ui-components/OtpInput";
import ImageUpload from "../../components/ui-components/UploadImage";
import { FaPen } from "react-icons/fa6";

const initialUserDetails = () => {
  return {
    name: "",
    companyName: "",
    profile: null
  }
}

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [loginStatus, setLoginStatus] = useState('email');
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [timer, setTimer] = useState(30);
  const [timerRunning, setTimerRunning] = useState(false);
  const [userDetails, setUserDetails] = useState(initialUserDetails())
  const [userDetailsError, setUserDetailsError] = useState<any>({
    name: "",
    companyName: "",
    profile: ''
  })
  const [loginDetails, setLoginDetails] = useState({
    email: "",
  });
  const [error, setError] = useState<any>({
    email: "",
  });

  const router = useRouter()

  const handleChange = (key: string, value: string) => {
    if (error[key]) {
      setError((pre: any) => {
        return {
          ...pre,
          [key]: "",
        };
      });
    }
    setLoginDetails((pre) => {
      return {
        ...pre,
        [key]: value,
      };
    });
  };

  const handleUserDetailsChange = (key: string, value: string | File) => {
    if (userDetailsError[key]) {
      setUserDetailsError((pre: any) => {
        return {
          ...pre,
          [key]: "",
        };
      });
    }
    setUserDetails((pre) => {
      return {
        ...pre,
        [key]: value,
      };
    });
  }

  const handleOtpSend = async () => {
    if (isValidLoginDetails(loginDetails, setError)) {
      setLoading(true)
      try {
        const resp = await signInUser(loginDetails)
        setLoading(false)
        if (resp.detail === 'OTP sent successfully.') {
          setLoginStatus('otp-send')
          setTimer(30);
          setTimerRunning(true);
        }
        console.log('email resp', resp)

        // router.push('/job-listing')
      } catch (error) {
        // @ts-ignore
        if (error?.response?.data?.detail === 'User not found. Please Sign-Up First.' || error?.response?.data?.detail === "Sign-Up Otp Verifcation Pending. Retry Sign-Up via OTP verification again!!") {
          setLoginStatus('new-user')
        } else {
          toast.error("Something went Wrong, Please try again!")
        }
        setLoading(false)
        console.log('error for email verification api:-', error)
      }
    }
  };

  const handleOtpSendKey = (e: any) => {
    e.preventDefault();
    if (e.keyCode === 13) {
      handleOtpSend()
    }
  }

  const handleOtpVerify = async (otp: string) => {
    setLoading(true)
    try {
      const resp = await OTPVerification({ otp: otp, email: loginDetails?.email })
      localStorage.setItem('userToken', resp?.token)
      localStorage.setItem('userName', resp?.name ?? '')
      localStorage.setItem('companyName', resp?.company_name ?? '')
      localStorage.setItem('userProfile', resp?.image ?? '')
      localStorage.setItem('userId', resp?.id)
      localStorage.setItem('userEmail', resp?.userEmail)
      localStorage.setItem('organisation_type', resp?.organisation_type ?? '')
      router.push('/job-listing')
      setLoading(false)
    } catch (e) {
      console.log('error for verify otp:-', e)
      // @ts-ignore
      setOtpError(e?.response?.data?.detail)
      setLoading(false)
    }
  }

  const resendOTP = () => {
    handleOtpSend()
  };

  const handleUserDetails = async () => {
    if (isValidUserLoginDetails(userDetails, setUserDetailsError)) {
      const formData = new FormData();
      // @ts-ignore
      formData.append('image', userDetails.profile);
      formData.append('name', userDetails.name);
      formData.append('company_name', userDetails.companyName);
      formData.append('email', loginDetails.email);
      formData.append('organisation_type', "RECRUITER");
      formData.append('metadata', JSON.stringify([]));
      try {
        const resp = await createNewUser(formData)
        if (resp.detail === 'OTP sent successfully.') {
          // handleOtpSend()
          setUserDetails(initialUserDetails())
          setLoginStatus('otp-send')
        }
      } catch (e) {
        console.log('error while create new user:-', e)
        toast.error('Something went wrong, Please try again!')
      }
    }
  }

  useEffect(() => {
    if (timerRunning && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setTimerRunning(false);
    }
  }, [timer, timerRunning]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: "100vh",
        overflow: "scroll"
      }}>
      {loading && <Backdrop open={true} style={{ zIndex: 999, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>}
      <Box sx={{ width: "40%", height: "99vh" }}>
        <Box
          mt="32px"
          ml="32px"
          sx={{ textAlign: "left", fontWeight: 600, fontSize: "24px" }}
        >
          PYZO
        </Box>
        {loginStatus === 'email' &&
          <Box sx={{ width: "80%", margin: "auto", marginTop: "200px" }}>
            <Box
              sx={{
                fontSize: "32px",
                fontWeight: 700,
                textAlign: "left",
                marginBottom: "8px",
              }}
            >
              Welcome to admin panel
            </Box>
            <Box
              sx={{
                fontSize: "16px",
                fontWeight: 400,
                color: "#667085",
                marginBottom: "24px"
              }}
            >
              Enter your email id linked with your account
            </Box>
            <Box mb="35px">
              <Label text="Email address" />
              <InputField
                value={loginDetails.email}
                onChange={(value) => handleChange("email", value)}
                errorMessage={error.email}
                placeholder="abc@example.com"
                handleKeyChange={handleOtpSendKey}
                size='14px'
              />
            </Box>
            {/* @ts-ignore */}
            <Button
              color={'#FFFFFF'}
              bg={'#003D86'}
              _hover={{ bg: "#003D86" }}  // Change this to your desired hover color
              _active={{ bg: "#003D86" }}
              sx={{
                fontSize: "16px",
                fontWeight: 400,
                padding: "4px 32px"
              }}
              onClick={handleOtpSend}
            >Send OTP</Button>
          </Box>
        }

        {loginStatus === 'new-user' &&
          <Box sx={{ width: "80%", margin: "auto", marginTop: "70px" }}>
            <Box
              sx={{
                fontSize: "32px",
                fontWeight: 700,
                textAlign: "left",
                marginBottom: "8px",
              }}
            >
              Welcome to admin panel
            </Box>
            <Box
              sx={{
                fontSize: "16px",
                fontWeight: 400,
                color: "#667085",
                marginBottom: "24px"
              }}
            >
              Enter your email id linked with your account
            </Box>
            <Box mb="35px">
              <Label text="Name" />
              <InputField
                value={userDetails.name}
                onChange={(value) => handleUserDetailsChange("name", value)}
                errorMessage={userDetailsError.name}
                placeholder="Enter Name"
              />
            </Box>
            <Box mb="35px">
              <Label text="Company Name" />
              <InputField
                value={userDetails.companyName}
                onChange={(value) => handleUserDetailsChange("companyName", value)}
                errorMessage={userDetailsError.companyName}
                placeholder="Enter Company Name"
              />
            </Box>
            <ImageUpload
              onChange={(value) => handleUserDetailsChange('profile', value)}
              value={userDetails?.profile}
              error={userDetailsError}
              handleError={setUserDetailsError} />
            {/* @ts-ignore */}
            <Button
              color={'#FFFFFF'}
              bg={'#003D86'}
              _hover={{ bg: "#003D86" }}  // Change this to your desired hover color
              _active={{ bg: "#003D86" }}
              sx={{
                fontSize: "16px",
                fontWeight: 400,
                padding: "4px 32px"
              }} onClick={handleUserDetails}>Send OTP</Button>
          </Box>
        }
        {
          loginStatus === 'otp-send' &&
          <Box sx={{ width: "80%", margin: "auto", marginTop: "200px" }}>
            <Box
              sx={{
                fontSize: "32px",
                fontWeight: 700,
                textAlign: "left",
                marginBottom: "8px",
              }}
            >
              Email Verification
            </Box>
            <Box
              sx={{
                fontSize: "16px",
                fontWeight: 400,
                color: "#667085",
                marginBottom: "24px"
              }}
            >
              Please enter the 6-digit OTP that has been sent to
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px"
                }}>{loginDetails?.email}
                <FaPen
                  size={16}
                  style={{ cursor: "pointer" }}
                  onClick={() => setLoginStatus('email')}
                /></span>
            </Box>

            <Box mb="16px">
              <OtpInput
                placeholder='0'
                value={otp}
                onChange={(value) => {
                  if (otpError) {
                    setOtpError('')
                  }
                  // setTimeout(() => {
                  //   if (value.length === 6) {
                  //     handleOtpVerify(value)
                  //   }
                  // }, 2000)
                  setOtp(value)
                }

                }
                errorMessage={otpError}
              />
            </Box>
            {/* resend otp  */}
            <Box mb={'24px'} >
              {timer === 0 ?
                <div
                  style={{
                    fontWeight: 300,
                    fontSize: "16px",
                    color: "#8B8B8B"
                  }}> Didn{`'`}t received OTP?
                  <span
                    style={{
                      color: "#3178FF",
                      fontWeight: 600,
                      marginLeft: "5px",
                      cursor: "pointer"
                    }}
                    onClick={resendOTP}
                  >Resend
                  </span>
                </div> :
                <div style={{
                  fontWeight: 300,
                  fontSize: "16px",
                  color: "#8B8B8B"
                }} >Resend OTP in
                  <span
                    style={{
                      color: "#3178FF",
                      fontWeight: 600,
                      marginLeft: "5px",
                    }}
                  >{timer}s</span>
                </div>
              }
            </Box>
            {/* @ts-ignore */}
            <Button
              color={'#FFFFFF'}
              bg={'#003D86'}
              _hover={{ bg: "#003D86" }}  // Change this to your desired hover color
              _active={{ bg: "#003D86" }}
              sx={{
                fontSize: "16px",
                fontWeight: 400,
                padding: "4px 32px"
              }}
              onClick={() => handleOtpVerify(otp)}
              disabled={!(otp && otp.length === 6)}
            >Verify</Button>
          </Box>
        }
      </Box>
      <Box
        sx={{
          width: "60%",
          margin: "32px",
          display: "flex",
          justifyContent: "end",
        }}
      >
        <img
          src={loginImage.src}
          alt="loginImg"
          style={{ height: "91vh", width: "100%" }}
        />
      </Box>
    </Box >
  );
};

export default Login;
