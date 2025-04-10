import React, { createContext, useState, useContext, ReactNode } from 'react';
import { getCredits, getCreditHistory } from "../services/credits";
import toast from 'react-hot-toast'

// Define the type for your context state
type CreditsContextType = {
  credits: number;
  setCredits: (credits: number) => void;
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  handleGetCredits: () => void;
  creditHistory: any;
  applicationFilterDetails: any;
  setApplicationFilterDetails: (arg: any) => void;
  jobListingFilterDetails: any,
  setJobListingFilterDetails: (arg: any) => void,
  interviewResultFilterDetails: any,
  setInterviewResultFilterDetails: (arg: any) => void,

};

export const getInitialApplicationFilterDetails = () => {
  return {
    startDate: null,
    endDate: null,
    jobListingName: [],
    status: null,
    customDateStatus: null,
    aiScreeningResult: null
  }
}

export const getJobListingInitialFilterDetails = () => {
  return {
    startDate: null,
    endDate: null,
    jobListingName: [],
    status: null,
    customDateStatus: null
  }
}

export const getInitialInterviewResultFilterDetails = () => {
  return {
    startDate: null,
    endDate: null,
    jobListingName: [],
    status: null,
    customDateStatus: null,
  }
}

// Create a Context with an initial value of `undefined`
const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

// Define a custom hook for easy access to the context
export const useCredits = () => {
  const context = useContext(CreditsContext);
  if (!context) {
    throw new Error('useCredits must be used within a CreditsProvider');
  }
  return context;
};

// Define the props for the provider component
type CreditsProviderProps = {
  children: ReactNode;
};

// Create a provider component
export const CreditsProvider: React.FC<CreditsProviderProps> = ({ children }) => {
  const [credits, setCredits] = useState<number>(0); // Initial credits state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [creditHistory, setCreditHistory] = useState([]);
  const [applicationFilterDetails, setApplicationFilterDetails] = useState(getInitialApplicationFilterDetails())
  const [jobListingFilterDetails, setJobListingFilterDetails] = useState(getJobListingInitialFilterDetails())
  const [interviewResultFilterDetails, setInterviewResultFilterDetails] = useState(getInitialInterviewResultFilterDetails())




  const handleCreditHistory = async () => {
    const recruiterId = localStorage.getItem('userId');
    if (!recruiterId) {
      return;
    }
    try {
      const resp = await getCreditHistory(recruiterId)
      console.log("credit History>>>>>>>", resp);
      setCreditHistory(resp?.transaction_history);
    } catch (error) {
      toast.error("Something went wrong!")
    }
  }

  const openSidebar = () => {
    handleCreditHistory();
    setIsSidebarOpen(true)
  }
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleGetCredits = async () => {
    const recruiterId = localStorage.getItem('userId')
    let response;
    if (recruiterId) {
      try {
        response = await getCredits(recruiterId);
        console.log("credits Response>>>>>>>>>>>>", response);
        setCredits(response.credits);
      } catch (error) {
        toast.error("Something went wrong!")
      }
    }
  }



  return (
    <CreditsContext.Provider value={{
      credits,
      setCredits,
      isSidebarOpen,
      openSidebar,
      closeSidebar,
      handleGetCredits,
      creditHistory,
      applicationFilterDetails,
      setApplicationFilterDetails,
      jobListingFilterDetails,
      setJobListingFilterDetails,
      interviewResultFilterDetails,
      setInterviewResultFilterDetails
    }}>
      {children}
    </CreditsContext.Provider>
  );
};
