import axios from "axios";

export const getCredits = async (recruiterId) => {
    const resp = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/credits/?recruiter=${recruiterId}`
    );
    return resp?.data;
  };

export const getCreditHistory = async (recruiterId) => {
    const resp = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/credithistory?recruiter=${recruiterId}`
    );
    return resp?.data   
}