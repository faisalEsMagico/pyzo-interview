import {
  academicDetailsErrorType,
  academicDetailsType,
  ApplicationDetailsErrorType,
  applicationQuestionErrorType,
  applicationQuestionType,
  IPersonalDetails,
} from "../types/application-type/applicationInterface";
import { isValidPhoneNumber } from "react-phone-number-input";
import dayjs from "dayjs";

export const isEmil = (text: string) => {
  // Regular expression for email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(text);
};

export const isValidEmail = (text: string, setError: (arg: string) => void) => {
  if (!text) {
    setError("please enter email!");
    return false;
  }
  if (!isEmil(text)) {
    setError("please enter valid email!");
    return false;
  }
  return true;
};

function validatePhoneNumber(phoneNumber: string) {
  const phoneNumberPattern =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneNumberPattern.test(phoneNumber);
}

interface FileValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

interface StateType {
  [key: string]: string;
}

const validateFileSize = (
  file: File,
  maxSizeInBytes: number
): FileValidationResult => {
  if (file.size <= maxSizeInBytes) {
    return { isValid: true };
  } else {
    return {
      isValid: false,
      errorMessage: `File size exceeds the maximum allowed (${maxSizeInBytes} bytes)`,
    };
  }
};

type FileType = string;

const validateFileType = (
  file: File,
  allowedTypes: FileType[]
): FileValidationResult => {
  if (!file) return { isValid: false };
  if (allowedTypes.includes(file.type)) {
    return { isValid: true };
  } else {
    return { isValid: false, errorMessage: `File type is not allowed` };
  }
};

export const validateAcademicDetails = (
  data: any,
  handleError: (
    key: string,
    value: string,
    handleState: React.Dispatch<React.SetStateAction<StateType>>
  ) => void,
  setError: any
) => {
  const allowedTypes: FileType[] = ["image/jpeg", "application/pdf"];
  const maxSize200KB = 200 * 1024; // 200 KB in bytes
  const maxSize5MB = 5 * 1024 * 1024; // 5 MB in bytes

  let flag = true;

  const curriculumVitaeFileExist = data?.curriculumVitae?.file;
  const highSchoolCertificateFileExist = data?.highSchoolCertificate?.file;

  // if user dont sumbit document
  if (!curriculumVitaeFileExist) {
    handleError(
      "curriculumVitae",
      "Curriculum Vitae (CV) is Required",
      setError
    );
    flag = false;
  }

  if (!highSchoolCertificateFileExist) {
    handleError(
      "highSchoolCertificate",
      "High School Certificate is Required",
      setError
    );
    flag = false;
  }

  // checking file type
  const curriculumVitaeFileTypes = validateFileType(
    data?.curriculumVitae?.file,
    allowedTypes
  )?.isValid;
  const highSchoolCertificateTypes = validateFileType(
    data?.highSchoolCertificate?.file,
    allowedTypes
  )?.isValid;

  if (curriculumVitaeFileExist && !curriculumVitaeFileTypes) {
    handleError("curriculumVitae", "Unsupported file type.", setError);
    flag = false;
  }

  if (highSchoolCertificateFileExist && !highSchoolCertificateTypes) {
    handleError("highSchoolCertificate", "Unsupported file type.", setError);
    flag = false;
  }

  // checking file size
  const curriculumVitaeFileType = data?.curriculumVitae?.file?.type || "";
  const highSchoolCertificateType =
    data?.highSchoolCertificate?.file?.type || "";

  if (
    curriculumVitaeFileExist &&
    curriculumVitaeFileTypes &&
    curriculumVitaeFileType === "image/jpeg"
  ) {
    /// checking image/jpeg file size which should 200kb
    if (!validateFileSize(data?.curriculumVitae?.file, maxSize200KB)?.isValid) {
      handleError(
        "curriculumVitae",
        "Please upload a file under 200KB.",
        setError
      );
      flag = false;
    }
  } else if (
    curriculumVitaeFileExist &&
    curriculumVitaeFileTypes &&
    curriculumVitaeFileType === "application/pdf"
  ) {
    if (!validateFileSize(data?.curriculumVitae?.file, maxSize5MB)?.isValid) {
      handleError(
        "curriculumVitae",
        "Please upload a file under 5mb.",
        setError
      );
      flag = false;
    }
  }

  if (
    highSchoolCertificateFileExist &&
    highSchoolCertificateTypes &&
    highSchoolCertificateType === "image/jpeg"
  ) {
    /// checking image/jpeg file size which should 200kb
    if (
      !validateFileSize(data?.highSchoolCertificate?.file, maxSize200KB)
        ?.isValid
    ) {
      handleError(
        "highSchoolCertificate",
        "Please upload a file under 200KB",
        setError
      );
      flag = false;
    }
  } else if (
    highSchoolCertificateFileExist &&
    highSchoolCertificateTypes &&
    highSchoolCertificateType === "application/pdf"
  ) {
    /// checking application/pdf file size which should 5mb
    if (
      !validateFileSize(data?.highSchoolCertificate?.file, maxSize5MB)?.isValid
    ) {
      handleError(
        "highSchoolCertificate",
        "Please upload a file under 5mb",
        setError
      );
      flag = false;
    }
  }

  return flag;
};

export const validatePersonalDetails = (
  data: any,
  handleError: (
    key: string,
    value: string,
    handleState: React.Dispatch<React.SetStateAction<StateType>>
  ) => void,
  setError: any
) => {
  let flag = true;

  if (!data?.name) {
    handleError("name", "Name is Required", setError);
    flag = false;
  }

  if (!data?.mobileNumber) {
    handleError("mobileNumber", "Mobile Number is Required", setError);
    flag = false;
  } else if (data?.mobileNumber) {
    if (!validatePhoneNumber(data?.mobileNumber)) {
      handleError("mobileNumber", "Invalid Mobile Number", setError);
      flag = false;
    }
  }

  if (!data?.dob) {
    handleError("dob", "Date of Birth is Required", setError);
    flag = false;
  }

  if (!data?.gender) {
    handleError("gender", "Please Select Gender", setError);
    flag = false;
  }

  if (!data?.linkdinUrl) {
    handleError("linkdinUrl", "LinkedIn URL is Required", setError);
    flag = false;
  }

  return flag;
};

// validation for linkedin url
function isValidLinkedInUrl(url: string) {
  // Regular expression to match LinkedIn profile URLs
  var linkedinRegex = /^https:\/\/www\.linkedin\.com\//;

  // Test the URL against the regular expression
  return linkedinRegex.test(url);
}

// validation for dob

function isValidDateOrPast(dateString: string | Date) {
  // Parse the input date string to Day.js object
  const date = dayjs(dateString);

  // Get the current date
  const currentDate = dayjs();

  // Check if the date is valid and is the same as today's date or before today's date
  return date.isValid() && date.isBefore(currentDate, "day");
}

export const isValidApplicationDetails = (
  data: IPersonalDetails,
  handleError: (arg: ApplicationDetailsErrorType) => void
) => {
  let flag = true;
  const initialError = {
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    gender: "",
    linkedinUrl: "",
    profileImage: "",
  };
  if (!data?.firstName) {
    initialError.firstName = "first name is required!";
    flag = false;
  }
  if (!data?.lastName) {
    initialError.lastName = "last name is required!";
    flag = false;
  }
  if (!data?.phone || !isValidPhoneNumber(data?.phone)) {
    initialError.phone = !data?.phone
      ? "mobile is required!"
      : "please enter valid mobile number!";
    flag = false;
  }
  if (!data?.dob || !isValidDateOrPast(data?.dob)) {
    initialError.dob = !data?.dob
      ? "date of birth is required!"
      : "date should not be future or todays date!";
    flag = false;
  }
  if (!data?.gender) {
    initialError.gender = "gender is required!";
    flag = false;
  }
  if (!data?.linkedinUrl || !isValidLinkedInUrl(data?.linkedinUrl)) {
    initialError.linkedinUrl = !data?.linkedinUrl
      ? "linkedIn url is required!"
      : "please enter valid linkedin url!";
    flag = false;
  }
  if (!data?.profileImage) {
    initialError.profileImage = "profile photo is required!";
    flag = false;
  }
  handleError(initialError);
  return flag;
};

export const isValidAcademicDetails = (
  data: academicDetailsType,
  handleError: (arg: academicDetailsErrorType) => void
) => {
  let flag = true;

  const initialError = {
    curriculumVitae: "",
    highSchoolCertificate: "",
  };

  if (!data?.curriculumVitae) {
    initialError.curriculumVitae = "CV is required!";
    flag = false;
  }

  if (!data?.highSchoolCertificate) {
    initialError.highSchoolCertificate = "HSC marksheet is required!";
    flag = false;
  }

  handleError(initialError);
  return flag;
};

export const isValidApplicationQuestion = (
  data: applicationQuestionType,
  handleError: (arg: applicationQuestionErrorType) => void
) => {
  let flag = true;

  const initialError = {
    startup_overview: "",
    startup_inspiration: "",
    startup_differentiation: "",
  };

  if (!data?.startup_overview) {
    initialError.startup_overview = "video is required!";
    flag = false;
  }
  if (!data?.startup_inspiration) {
    initialError.startup_inspiration = "video is required!";
    flag = false;
  }
  // if (!data?.startup_differentiation) {
  //   initialError.startup_differentiation = "video is required!";
  //   flag = false;
  // }
  handleError(initialError);
  return flag;
};

// ai interview portal start here

// const isValidEmail = (email) => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// };

const isValidPassword = (password: string) => {
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
  return passwordRegex.test(password);
};

export const isValidLoginDetails = (data: any, setError: any) => {
  const initialError = {
    email: "",
  };
  let flag = true;
  if (!data.email || !isEmil(data.email)) {
    initialError.email = data.email
      ? "please enter valid email!"
      : "email is required!";
    flag = false;
  }
  setError(initialError);
  return flag;
};

export const isValidUserLoginDetails = (data: any, setError: any) => {
  const initialError = {
    name: "",
    companyName: "",
    profile: "",
  };
  let flag = true;
  if (!data.name) {
    initialError.name = "Name Is Required!";
    flag = false;
  }
  if (!data.companyName) {
    initialError.companyName = "Company Name Is Required!";
    flag = false;
  }
  if (!data.profile) {
    initialError.profile = "Photo Is Required!";
    flag = false;
  }
  setError(initialError);
  return flag;
};

export const isValidForgotPasswordDetails = (data: any, setError: any) => {
  const initialError = {
    email: "",
  };
  let flag = true;
  if (!data.email || !isEmil(data.email)) {
    initialError.email = data.email
      ? "please enter valid email!"
      : "email is required!";
    flag = false;
  }
  setError(initialError);
  return flag;
};

export const isValidResetPasswordDetails = (data: any, setError: any) => {
  const initialError = {
    newPassword: "",
    confirmPassword: "",
  };
  let flag = true;
  if (!data.newPassword || !isValidPassword(data.newPassword)) {
    initialError.newPassword = data.newPassword
      ? "Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, 1 special character, and 1 number."
      : "New password is required!";
    flag = false;
  }
  if (!data.confirmPassword || data.confirmPassword !== data.newPassword) {
    initialError.confirmPassword = data.confirmPassword
      ? "New password and confirm password must be the same!"
      : "Confirm password is required!";
    flag = false;
  }
  setError(initialError);
  return flag;
};

const errorMessageForCreateForm = [
  "Jon Title Is Required!",
  "Job Description Is Required!",
  "Role And Responsibility Is Required!",
  "About The Company Is Required!",
  "Skills Are Required!",
  "Experience Is Required!",
  "current salary Is Required!",
  "current Location Is Required!",
  "Mode Of Work Is Required!",
];

export const isValidCreateFormDetails = (data: any, handleError: any) => {
  let flag = true;
  data = data?.map((item: any, i: number) => {
    if (item.value) {
      return item;
    } else {
      flag = false;
      return {
        ...item,
        error: errorMessageForCreateForm[i],
      };
    }
  });
  handleError(data);
  return flag;
};

export const isValidFormData = (data: any, handleError: any) => {
  let flag = true;
  const initialError = {
    name: "",
    email: "",
    phone: "",
    expected_CTC: "",
    years_of_experience: "",
    resume_file: "",
  };
  if (!data.name) {
    initialError.name = "Name Is Required!";
    flag = false;
  }
  if (!data.email || !isEmil(data.email)) {
    initialError.email = data.email
      ? "please enter valid email!"
      : "email is required!";
    flag = false;
  }
  if (!data.phone) {
    initialError.phone = "Mobile Number Is Required!";
    flag = false;
  }
  if (!data.expected_CTC) {
    initialError.expected_CTC = "Expected CTC Is Required!";
    flag = false;
  }
  if (!data.years_of_experience) {
    initialError.years_of_experience = "Years Of Experience Is Required!";
    flag = false;
  }
  handleError(initialError);
  return flag;
};

export const isValidResume = (resume: File | undefined, handleError: any) => {
  let flag = true;
  const initialError = {
    name: "",
    email: "",
    phone: "",
    expected_CTC: "",
    years_of_experience: "",
    resume_file: "",
  };
  if (!resume) {
    initialError.resume_file = "Resume Is Required!";
    flag = false;
  }
  handleError(initialError);
  return flag;
};
