import axios from "axios";
import toast from "react-hot-toast";

export const postJobListing = async (data) => {
  const resp = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/job-descriptions/`,
    data
  );
  return resp?.data;
};

export const getRequiredSkills = async (jobId) => {
  const resp = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/ai/mapskills/?job_id=${jobId}`
  );
  return resp?.data;
};

export const putRequiredSkills = async (id, data) => {
  const resp = await axios.put(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/job-descriptions/${id}/`,
    data
  );
  return resp?.data;
};

export const getJobListing = async (
  id,
  currentPage,
  perPage,
  jobTitles,
  status,
  search,
  startDate,
  endDate
) => {
  const resp = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/organisation/${id}/jobs/?page=${currentPage}&perpage=${perPage}${jobTitles}${startDate}${endDate}${search}${status}`
  );
  return resp?.data;
};

export const postCandidatesDetails = async (data) => {
  const resp = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/addcandidatedetails/`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return resp?.data;
};

export const parseResume = async (data) => {
  const resp = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/ai/parse-resume/`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return resp?.data;
};

export const getCandidatesDetails = async (
  id,
  currentPage,
  perPage,
  jobTitles,
  status,
  aiScreeningResult,
  search,
  startDate,
  endDate
) => {
  const resp = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/addcandidatedetails/${id}/?page=${currentPage}&perpage=${perPage}${jobTitles}${startDate}${endDate}${search}${status}${aiScreeningResult}`
  );
  return resp?.data;
};

export const getApplicationOverview = async (id) => {
  const resp = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/getindividualcandidatedetail/${id}/`
  );
  return resp?.data;
};

export const updateCandidateDetails = async (data) => {
  const resp = await axios.patch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/addcandidatedetails/`,
    data
  );
  return resp?.data;
};

export const sendFeedbackAsMail = async (data, key) => {
  const resp = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/send-${key}-feedback-email/`,
    data
  );
  return resp?.data;
};

export const shortlistCandidate = async (
  candidateId,
  jobId,
  handleProgress
) => {
  const resp = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/ai/shortlist-candidate/?candidate_id=${candidateId}&job_id=${jobId}`,
    {
      onUploadProgress: (progressEvent) => {
        const uploadProgress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        handleProgress(uploadProgress);
      },
    }
  );
  return resp?.data;
};

export const generateInterviewLink = async (data) => {
  const resp = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/generate-interview-link/`,
    data
  );
  return resp?.data;
};

export const getInterviewResult = async (
  id,
  currentPage,
  perPage,
  jobTitles,
  status,
  search,
  startDate,
  endDate
) => {
  const resp = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/getinterviewdetails/${id}/?page=${currentPage}&perpage=${perPage}&${search}&${startDate}&${endDate}${jobTitles}&${status}`
  );
  return resp?.data;
};

export const getInterviewResultForSingleCandidate = async (id) => {
  const resp = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/getcandidateinterview/${id}/`
  );
  return resp?.data;
};

export const getJobDescription = async (id) => {
  const resp = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/job-descriptions/${id}/`
  );
  return resp?.data;
};

export const postBulkUpload = async (formData) => {
  const resp = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/ai/bulk_upload_resumes/`,
    formData
  );
  return resp.data;
};

export const getShortlistedCandidate = async (id) => {
  const resp = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/shortlisting-status/${id}/`
  );
  return resp.data;
};

export const deleteJob = async (jobId, recruiteId) => {
  const resp = await axios.delete(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/job-descriptions/${jobId}/?recruiterid=${recruiteId}`
  );
  return resp.data;
};

export const getSaveTemplates = async (id) => {
  const resp = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/save-template/?recruiter_id=${id}`
  );
  return resp.data;
};

export const PostSaveTemplates = async (data) => {
  const resp = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/save-template/`,
    data
  );
  return resp.data;
};

export const getSingleTemplates = async (id) => {
  const resp = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/single-save-template/?template_id=${id}`
  );
  return resp.data;
};

export const getAllJobListing = async (id) => {
  const resp = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/get-job-titles/${id}/`
  );
  return resp.data;
};
