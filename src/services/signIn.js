import axios from "axios";

export const signInUser = async (detail) => {
  const resp = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/login/`,
    detail
  );
  return resp.data;
};

export const OTPVerification = async (detail) => {
  const resp = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/verify-otp/`,
    detail
  );
  return resp.data;
};

export const createNewUser = async (detail) => {
  const resp = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/signup/`,
    detail
  );
  return resp.data;
};
