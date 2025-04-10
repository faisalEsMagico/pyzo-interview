import React, { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'
import { Box } from '@chakra-ui/react'
import MuiStepper from '../../../UiComponents/MuiStepper'
import CreateUserForm from '../../../components/create-new-job/CreateUserForm';
import SelectRequiredSkillSet from '../../../components/create-new-job/SelectRequiredSkillSet';
import GeneratedLink from '../../../components/create-new-job/GeneratedLink';
import { useRouter } from 'next/router';
import { getJobDescription, getSaveTemplates } from '../../../services/jobListingApi';

export const fieldsName = [
  "job_title",
  "job_description",
  "roles_and_responsibilities",
  "about_company",
  "skills_required",
  "years_of_experience",
  "salary",
  "location",
  "mode_of_work"
]

const getInitialQuestions = () => {
  return [
    {
      question: "What's the Job Title",
      questionType: "input",
      value: "",
      error: "",
      placeholder: "Enter Job Title",
    },
    {
      question: "Enter the Job Description",
      questionType: "Paragraph Text",
      value: "",
      error: "",
      placeholder: "Enter Job Title",
      preFillOptionsText: "Prefill job description from saved templates",
      preFillOptions: []
    },
    {
      question: "Enter the Roles And Responsibilities",
      questionType: "Paragraph Text",
      value: "",
      error: "",
      placeholder: "Enter Roles And Responsibilities",
      preFillOptionsText: "Prefill roles and responsibilities from saved templates",
      preFillOptions: []
    },
    {
      question: "Enter About Company",
      questionType: "Paragraph Text",
      value: "",
      error: "",
      placeholder: "Enter About Company",
      preFillOptionsText: "Prefill About Company from saved templates",
      preFillOptions: []
    },
    {
      question: "Enter the Skills Required",
      questionType: "Paragraph Text",
      value: "",
      error: "",
      placeholder: "Enter the Skills Required",
      preFillOptionsText: "Prefill skills required from saved templates",
      preFillOptions: []
    },
    {
      question: "What's Expected Years Of Experience",
      questionType: "User Input Field",
      value: "",
      error: "",
      placeholder: "Select Expected Year's Of Experience",
      type: 'number',
      options: [
        {
          label: "0-2 years",
          value: "0-2 years",
        },
        {
          label: "2-5 years",
          value: "2-5 years",
        },
        {
          label: "5-7 years",
          value: "5-7 years",
        },
        {
          label: "10+ years",
          value: "10+ years",
        },
      ],
    },
    {
      question: "What's the Expected Salary (In LPA)",
      questionType: "User Input Field",
      value: "",
      error: "",
      placeholder: "Enter the Expected Salary (In LPA)",
      type: 'number'
    },
    {
      question: "What's the Work Location ?",
      questionType: "User Input Field",
      value: "",
      error: "",
      placeholder: "Enter Expected Location",
    },
    {
      question: "What's the Mode Of Work",
      questionType: "MCQ Type",
      value: "",
      error: "",
      options: [
        {
          label: "Work From Office",
          value: "Work From Office",
        },
        {
          label: "Remote",
          value: "Remote",
        },
        {
          label: "Hybrid",
          value: "Hybrid",
        },
      ],
    },
  ];
};

const CrateNewJob = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [questions, setQuestions] = useState(getInitialQuestions());
  const [customField, setCustomField] = useState<any>([])
  const [skills, setSkills] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false)
  const router = useRouter()

  const { editId } = router.query;

  const handleNext = (next: number) => {
    setActiveStep((prevActiveStep) => prevActiveStep + next);
  };

  const handleBack = (back: number) => {
    setActiveStep((prevActiveStep) => prevActiveStep - back);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId") ?? '';
    if (!userId) {
      router.push('/login')
    }
  }, [router])


  const handleFetchData = async () => {
    const userId = localStorage.getItem('userId') ?? '';
    const newQuestions = [...questions];

    try {
      const resp1 = await getSaveTemplates(userId);
      console.log('templates', resp1);
      

      newQuestions[1] = { ...newQuestions[1], preFillOptions: resp1?.prefill_jobdescription };
      newQuestions[2] = { ...newQuestions[2], preFillOptions: resp1?.prefill_roles_responsibilities };
      newQuestions[3] = { ...newQuestions[3], preFillOptions: resp1?.prefill_about_company };
      newQuestions[4] = { ...newQuestions[4], preFillOptions: resp1?.prefill_skills };

      setQuestions([...newQuestions]); // Set state after first API call
    } catch (e) {
      console.error('Error while calling getSaveTemplates:', e);
    }

    console.log('after save template');

    try {
      const resp2 = await getJobDescription(editId);
      console.log('resp2', resp2);

      const updatedQuestions = [...newQuestions]; // Create a new array to avoid mutation issues
      updatedQuestions[0] = { ...updatedQuestions[0], value: resp2?.job_title };
      updatedQuestions[1] = { ...updatedQuestions[1], value: resp2?.job_description };
      updatedQuestions[2] = { ...updatedQuestions[2], value: resp2?.roles_and_responsibilities };
      updatedQuestions[3] = { ...updatedQuestions[3], value: resp2?.about_company };
      updatedQuestions[4] = { ...updatedQuestions[4], value: resp2?.skills_required };
      updatedQuestions[5] = { ...updatedQuestions[5], value: resp2?.years_of_experience };
      updatedQuestions[6] = { ...updatedQuestions[6], value: resp2?.salary };
      updatedQuestions[7] = { ...updatedQuestions[7], value: resp2?.location };
      updatedQuestions[8] = { ...updatedQuestions[8], value: resp2?.mode_of_work };

      setQuestions(updatedQuestions);
      setCustomField(resp2.custom_fields)
    } catch (e) {
      console.error('Error while calling getJobDescription:', e);
    }
  };


  useEffect(() => {
    if (editId && typeof editId === 'string') {
      localStorage.setItem('JDID', editId)
      handleFetchData()
      setActiveStep(2)
    }

  }, [editId])

  return (
    <Layout>
      <Box sx={{ marginLeft: "200px", height: "100vh", overflowY: "scroll", display: 'block' }}>
        <MuiStepper activeStep={activeStep} />
        {activeStep === 0 && (
          <CreateUserForm
            handleNext={handleNext}
            questions={questions}
            setQuestions={setQuestions}
            setIsCopied={setIsCopied}
            handleScrollToTop={handleScrollToTop}
            setIsUpdate={setIsUpdate}
            isUpdate={isUpdate}
            customField={customField}
            setCustomField={setCustomField}
            editId={editId}
          />
        )}
        {activeStep === 1 && (
          <SelectRequiredSkillSet
            questions={questions}
            handleBack={handleBack}
            handleNext={handleNext}
            skills={skills}
            setSkills={setSkills}
            setIsCopied={setIsCopied}
            handleScrollToTop={handleScrollToTop}
            setIsUpdate={setIsUpdate}
            editId={editId}
          />
        )}
        {(activeStep === 2 || activeStep === 3) && (
          <GeneratedLink
            questions={questions}
            handleBack={handleBack}
            handleNext={handleNext}
            setIsCopied={setIsCopied}
            isCopied={isCopied}
            setIsUpdate={setIsUpdate}
          />
        )}
      </Box>
    </Layout>
  )
}

export default CrateNewJob