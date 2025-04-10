import axios from "axios";
import toast from "react-hot-toast";

export const getInitialQuestion = async (candidateId, jobId) => {
  const resp = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/ai/getquestions/?candidate_id=${candidateId}&job_id=${jobId}`
  );
  return resp?.data;
};

export const AnswerTheQuestion = async (req) => {
  const resp = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/ai/getskilllevelconfidence/`,
    req
  );
  return resp.data;
};

export const postConversation = async (req) => {
  const resp = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/ai/conversation/`,
    req
  );
  return resp.data;
};

export const authorizeUser = async (jobId, candidateId, token) => {
  const resp = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/verifyinterview/?jobid=${jobId}&candidate_id=${candidateId}&token=${token}`
  );
  return resp?.data;
};

export const interviewFeedback = async (jobId, candidateId, reqruiterId) => {
  const resp = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/ai/getfeedback/?job_id=${jobId}&candidate_id=${candidateId}&organisation_id=${reqruiterId}`
  );
  return resp?.data;
};

export const postInterviewDetails = async (data) => {
  const resp = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/liveinterviewdetails/`,data
  );
  return resp;
};

export const getInterviewDetails = async (id) => {
  const resp = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/liveinterviewdetails/?candidate_id=${id}`
  );
  return resp;
};
