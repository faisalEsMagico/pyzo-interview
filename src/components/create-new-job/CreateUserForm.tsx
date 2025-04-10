import React, { useEffect, useState } from "react";
import InputField from "../ui-components/InputField";
import RadioButton from "../../UiComponents/RadioButton";
import { Box, Button, FormControl, FormLabel, Switch } from "@chakra-ui/react";
import ChakraUITextarea from "../ui-components/ChakraUITextarea";
import { isValidCreateFormDetails } from "../../utils/validation";
import { getSaveTemplates, getSingleTemplates, postJobListing, putRequiredSkills } from '../../services/jobListingApi';
import toast from "react-hot-toast";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { IoIosArrowUp } from "react-icons/io";
import SelectTag from "../ui-components/SelectTag";
import { HiPlus } from "react-icons/hi";
import { RiAddCircleFill, RiCircleLine } from "react-icons/ri";
import SaveTemplatePopup from "./SaveTemplatePopup";
import { MdDeleteOutline } from "react-icons/md";
import { useCredits } from "../../context/CreditsContext";
import { CreditsComponent } from "../ui-components/CreditsComponent";
import { creditRequiredMapping } from "../../utils/creditsRequiredMapping"
import { Tooltip } from '@chakra-ui/react';
import TooltipIcon from "../../assets/svg/TooltipIcon.svg";

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

const customFieldOptions = [
  {
    label: "Multiple Choice Question",
    value: 'Multiple choice question',
  },
  {
    label: "Text Box",
    value: 'Text box',
  },
  {
    label: "Checkbox",
    value: 'Checkbox',
  }
]

const getCustomComponents = (data: any, onChange: any, index: number, allData: any) => {

  const handleDelete = (index: number) => {
    const newData = [...allData];
    newData.splice(index, 1);
    onChange(newData);
  }

  const handleAddOptions = (i: number) => {
    const newAllData = [...allData];
    newAllData[i] = { ...newAllData[i], option: [...newAllData[i].option, ''] };
    onChange(newAllData);
  }

  const handleChange = (key: string, value: any, i: number, optionIndex?: number) => {
    const newAllData = [...allData];

    if (key === 'option') {
      const optionObj = newAllData[i];
      const option = optionObj?.option
      // @ts-ignore
      option[optionIndex] = value;
    } else {
      newAllData[i] = { ...newAllData[i], [key]: value, templateId: '' };
    }

    onChange(newAllData);
  }

  switch (data.type) {
    case "Text box": {
      return (
        <Box
          display={'flex'}
          gap='20px'
        >
          <Box
            border='1px solid #E0E2E7'
            borderRadius={'6px'}
            mt='20px'
            display={'flex'}
            gap='20px'
            alignItems={'center'}
            justifyContent={'space-between'}
            width='60%'
            p='10px'
          >
            {data?.value}
            <Box width={'100%'}  >
              <InputField
                placeholder={`${index + 1}. Enter your question`}
                value={data?.question}
                onChange={(value) => handleChange('question', value, index)}
                errorMessage={data.error}
                borderLess={true}
                size='14px'
              />
            </Box>
            {/* @ts-ignore */}
            <FormControl display='flex' width={'30%'} alignItems='center' gap='10px'>
              <Switch id='email-alerts'
                isChecked={data?.mandatory}
                onChange={(e) => handleChange('mandatory', e?.target?.checked, index)}
              />
              <FormLabel
                htmlFor='email-alerts'
                mb='0'
                fontSize={'14px'}
                fontWeight={400}
              >
                Mandatory
              </FormLabel>
            </FormControl>
          </Box>
          <Box>
            <Button
              onClick={() => handleDelete(index)}
              _hover={'#EDBDBD'} _active={'#EDBDBD'} bg={'#EDBDBD'}
              size="small" mt='20px' p='7px 12px' >
              <MdDeleteOutline size={20} color="#BB1414" /></Button>
          </Box>
        </Box>
      )
    }

    case 'Checkbox': case "Multiple choice question": {
      return (
        <Box
          display={'flex'}
          gap='20px'
        >
          <Box
            border='1px solid #E0E2E7'
            borderRadius={'6px'}
            width='60%'
            p='10px'
            mt='20px'
          >
            <Box
              display={'flex'}
              gap='20px'
              alignItems={'center'}
              justifyContent={'space-between'}
              borderBottom={'1px solid #1680FF'}
            >
              <Box width={'100%'}   >
                <InputField
                  placeholder={`${index + 1}. Enter your question`}
                  value={data.question}
                  onChange={(value) => handleChange('question', value, index)}
                  // errorMessage={data.error}
                  borderLess={true}
                  size='14px'
                />
              </Box>
              {/* @ts-ignore */}
              <FormControl display='flex' width={'30%'} alignItems='center' gap='10px'>
                <Switch id='email-alerts'
                  isChecked={data?.mandatory}
                  onChange={(e) => handleChange('mandatory', e?.target?.checked, index)}
                />
                <FormLabel
                  htmlFor='email-alerts'
                  mb='0'
                  fontSize={'14px'}
                  fontWeight={400}
                >
                  Mandatory
                </FormLabel>
              </FormControl>
            </Box>
            {data?.option?.map((item: any, ind: number) => {
              return <Box
                key={ind}
                display='flex'
                justifyContent={'left'}
                alignItems={'center'}
                gap='10px'
                mt='10px'
              >
                <Box width={'2%'}>
                  <RiCircleLine color="#1680FF" />
                </Box>
                <Box width={'100%'} borderBottom={'1px solid #E0E2E7'}>
                  <InputField
                    placeholder={`enter your options`}
                    value={item}
                    onChange={(value) => handleChange('option', value, index, ind)}
                    errorMessage={data.error}
                    borderLess={true}
                    size='14px'
                  />
                </Box>
              </Box>
            })}

            <Button
              mt='20px'
              size="small"
              _hover='#FFFFFF'
              _active={'#FFFFFF'}
              bg='#FFFFFF'
              color="#1680FF"
              fontSize={'12px'}
              fontWeight={600}
              leftIcon={<RiAddCircleFill color="#1680FF" size={16} />}
              onClick={() => handleAddOptions(index)}
            >
              Add more
            </Button>

          </Box>
          <Box>
            <Button
              onClick={() => handleDelete(index)}
              _hover={'#EDBDBD'} _active={'#EDBDBD'} bg={'#EDBDBD'}
              size="small" mt='20px' p='7px 12px'
            ><MdDeleteOutline size={20} color="#BB1414" /></Button>
          </Box>
        </Box>
      )
    }
  }
}

const getComponents = (data: any,
  onChange: any,
  index: number,
  allData: any,
  handleAllDataChange: any) => {

  const handleGetSingleTemplate = async (id: any, index: number) => {


    try {
      // need to fix
      const resp = await getSingleTemplates(id)
      let preFillText = ''
      if (allData[index].question === 'Enter the Job Description') {
        preFillText = 'job_description'
      } else if (allData[index].question === 'Enter the Roles And Responsibilities') {
        preFillText = 'roles_and_responsibilities'
      } else if (allData[index].question === 'Enter About Company') {
        preFillText = 'about_company'
      } else if (allData[index].question === 'Enter the Skills Required') {
        preFillText = 'skills_required'
      }
      const newData = [...allData]
      newData[index] = {
        ...newData[index], value: resp?.templatedata[0]?.[preFillText], templateId: id,
      }

      handleAllDataChange(newData)

    } catch (e) {
      console.log('error while calling get single template api', e)
      toast.error('Something went wrong. Please try again!')
    }
  }

  switch (data?.questionType) {
    case "input": {
      return (
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            borderRadius: "5px",
            marginTop: "16px",
            width: "60%",
            paddingRight: "13px"
          }}
        >
          <Box sx={{ color: "#000000", fontWeight: 700, fontSize: "12px", marginBottom: '8px' }}>
            {index + 1}. {data.question}
          </Box>
          <InputField
            placeholder={data.placeholder}
            value={data.value}
            onChange={(value) => onChange(value, index)}
            errorMessage={data.error}
            size='14px'
          />
        </Box>
      );
    }
    case "Paragraph Text": {
      return (
        <Box
          sx={{
            display: "flex",
            gap: "22px"
          }}
        >
          <Box sx={{ backgroundColor: "#FFFFFF", marginTop: "16px", width: "60%" }}>

            <Box sx={{ color: "#000000", fontWeight: 700, fontSize: "12px", marginBottom: '8px' }}>
              {index + 1}. {data.question}
            </Box>
            <ChakraUITextarea
              // maxLength={200}
              value={data.value}
              placeholder={data?.placeholder}
              onChange={(value: string) => onChange(value, index)}
              errorMessage={data.error}
              size={'14px'}
            />
          </Box>
          <Box w="40%">
            <Box
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                color: '#667085',
                marginTop: "16px",
              }}
            >
              {data.preFillOptionsText}
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginTop: "10px"
              }}
            >
              {data?.preFillOptions && data?.preFillOptions.length > 0 ?
                data?.preFillOptions?.map((item: { name: string, id: number }, i: number) => {
                  return <Box
                    onClick={() => handleGetSingleTemplate(item?.id, index)}
                    key={i}
                    sx={{
                      padding: "6px 8px",
                      border: `1px solid ${data.templateId == item?.id ? '#2877EE' : '#C2C6CE'}`,
                      borderRadius: "4px",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: data.templateId == item?.id ? '#2877EE' : '#667085',
                      cursor: "pointer"
                    }}

                  >{item?.name}</Box>
                }) : <Box fontSize={'12px'} >No Templates</Box>}
            </Box>
          </Box>
        </Box>
      );
    }
    case "User Input Field": {
      return (
        <Box sx={{ backgroundColor: "#FFFFFF", marginTop: "16px", width: "60%", paddingRight: "13px" }}>

          <Box sx={{ color: "#000000", fontWeight: 700, fontSize: "12px", marginBottom: '8px' }}>
            {index + 1}. {data.question}
          </Box>
          <InputField
            type={data.type ?? 'text'}
            value={data.value}
            onChange={(value) => onChange(value, index)}
            errorMessage={data?.error}
            placeholder={data?.placeholder}
            size='14px'
          />
        </Box>
      );
    }
    case "MCQ Type": {
      return (
        <Box sx={{ backgroundColor: "#FFFFFF", marginTop: "16px", width: "60%" }}>
          <Box sx={{ color: "#000000", fontWeight: 700, fontSize: "12px", marginBottom: '8px' }}>
            {index + 1}. {data.question}
          </Box>
          <RadioButton
            options={data?.options}
            errorMessage={data?.error}
            value={data?.value}
            radioColor="#075FCC"
            onChange={(value) => onChange(value, index)}
            radioBorderColor="#075FCC"
          />
        </Box>
      );
    }
    default: {
      return null;
    }
  }
};

const CreateUserForm = ({
  handleNext,
  questions,
  setQuestions,
  setIsCopied,
  handleScrollToTop,
  isUpdate,
  setIsUpdate,
  customField,
  setCustomField,
  editId
}: {
  handleNext: (arg: number) => void,
  questions: any,
  setQuestions: any,
  setIsCopied: (arg: boolean) => void,
  handleScrollToTop: () => void,
  isUpdate: boolean,
  setIsUpdate: (arg: boolean) => void,
  customField: any,
  setCustomField: any,
  editId: any
}) => {
  const [loading, setLoading] = useState(false)
  const [customFieldInput, setCustomFieldInput] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [isTemplateGenerate, setIsTemplateGenerate] = useState(false)
  const [insufficientCredits, setInsufficientCredits] = useState(false);
  const { credits, setCredits, handleGetCredits } = useCredits();

  const handleChangeCustomField = () => {
    const question: any = {
      question: "",
      type: customFieldInput,
      mandatory: false,
      option: null
    }
    if (customFieldInput !== 'Text box') {
      question.option = [];
    }
    if (customFieldInput) {

      setCustomField((pre: any) => {
        return [...pre, question]
      })
    }
    setCustomFieldInput('')
  }

  const handleSaveAndGenerate = async () => {
    localStorage.removeItem('skills')
    const userId = localStorage.getItem('userId') ?? ''
    console.log('customField', customField)
    let flag = false;

    [...customField].map((item: any) => {
      if (!item.question && item.type === 'Text box') {
        flag = true;
      }
      if (!item.question && item.type !== 'Text box') {
        flag = true;
      }
      if (item.type !== 'Text box' && Array.isArray(item.option)
        && item?.option?.filter((optionItem: any) => !!optionItem)?.length === 0) {
        flag = true
      }
      return;
    });

    if (flag) {
      toast.error('Custom fields and options are required!');
      return;
    }

    if (isValidCreateFormDetails(questions, setQuestions)) {
      const obj: any = { organisation: Number(userId), custom_fields: customField };
      questions.map((item: any, i: number) => obj[fieldsName[i]] = item?.value)
      setLoading(true)
      try {
        if (isUpdate) {
          const id = localStorage.getItem('JDID') ?? ''
          const resp = await putRequiredSkills(id, obj)
          setIsUpdate(false)
        } else {
          const resp = await postJobListing(obj)
          localStorage.setItem('JDID', resp?.id)
          if (resp?.id) {
            handleGetCredits();
          }
        }
        handleNext(1);
        setIsCopied(false);
        handleScrollToTop()
        setLoading(false)
      } catch (e) {
        console.log("ERROR", e)
        setLoading(false)
        if (e?.response?.data?.message === "Subscribe Plan, Insufficient Credits!! ") {
          setInsufficientCredits(true);
          toast?.error("Insufficient Credits!! ")
          return
        }
        toast?.error("Something went wrong please try again!");
      }
    }

  };

  const handleChange = (value: string, index: number) => {
    const newArr = [...questions];
    newArr[index] = { ...newArr[index], value: value, error: "", templateId: '' };
    setQuestions(newArr);
  };

  const handleGetSaveTemplate = async () => {
    const userId = localStorage.getItem('userId') ?? ''
    try {
      const resp = await getSaveTemplates(userId)
      console.log('templates123', resp)
      console.log('templates123567', resp?.prefill_jobdescription)
      const newQuestions = [...questions];
      newQuestions[1] = { ...newQuestions[1], preFillOptions: resp?.prefill_jobdescription }
      newQuestions[2] = { ...newQuestions[2], preFillOptions: resp?.prefill_roles_responsibilities }
      newQuestions[3] = { ...newQuestions[3], preFillOptions: resp?.prefill_about_company }
      newQuestions[4] = { ...newQuestions[4], preFillOptions: resp?.prefill_skills }
      setQuestions(newQuestions);
    } catch (e) {
      console.log('error while calling save template api', e)
      toast.error('Something went wrong. Please try again!')
    }
  }

  useEffect(() => {
    handleGetSaveTemplate()
  }, [isTemplateGenerate])

  return (
    <Box sx={{ marginX: "40px" }}>

      <SaveTemplatePopup
        isOpen={isOpen} onClose={() => setIsOpen(false)}
        mandatoryData={questions}
        customData={customField}
        setIsTemplateGenerate={setIsTemplateGenerate}
      />
      {loading && <Backdrop open={true} style={{ zIndex: 999, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>}
      <Box sx={{
        color: "#003D86",
        fontWeight: 600,
        fontSize: '14px',
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#E8F2FF",
        borderBottom: "1px solid #E0E2E7",
        padding: "12px",
        borderRadius: "4px"
      }}>
        <Box>Mandatory Job Listing Fields</Box>
        <Box><IoIosArrowUp size={20} /></Box>
      </Box>
      <Box>
        {questions?.map((question: any, index: number) => {
          return <div key={index}>{getComponents(question, handleChange, index, questions, setQuestions)}</div>;
        })}
      </Box>
      <Box sx={{
        color: "#003D86",
        fontWeight: 600,
        fontSize: '14px',
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#E8F2FF",
        borderBottom: "1px solid #E0E2E7",
        padding: "12px",
        borderRadius: "4px"
      }}>
        <Box>Custom Interviewer Fields</Box>
        <Box><IoIosArrowUp size={20} /></Box>
      </Box>

      <Box
        fontSize={'14px'}
        fontWeight={600}
        color='#1D1F2C'
        mt='16px'
      >
        You can create your own custom field
      </Box>

      <Box>
        <Box sx={{ color: "#1D1F2C", fontWeight: 500, fontSize: "12px", marginBottom: '8px', marginTop: "14px" }}>
          Add Field Type
        </Box>
        <Box display={'flex'} justifyContent={'left'} gap='20px'>
          <Box width={'60%'} >
            <SelectTag
              onChange={(value) => {
                if (typeof value === 'string') {
                  setCustomFieldInput(value)
                }
              }}
              value={customFieldInput}
              placeholder="--Select--"
              options={customFieldOptions}
              menuPlacement="top"
            />
          </Box>

          {customFieldInput && <Button
            size="sm"
            _hover={'#E8F2FF'}
            _active={'#E8F2FF'}
            bg='#E8F2FF'
            onClick={handleChangeCustomField}
          >
            <HiPlus size={20} color='#003D86' /></Button>}
        </Box>
      </Box>


      {customField?.map((item: any, i: number) => {
        return <Box key={i}>{getCustomComponents(item, setCustomField, i, customField)}</Box>
      })}

      <Box sx={{ display: "flex", justifyContent: "start", marginY: "50px", gap: '10px' }}>
        {/* @ts-ignore */}
        <Button
          bg='#003D86'
          color='#FFFFFF'
          size="small"
          p='7px 20px'
          disabled={insufficientCredits}
          _hover={{ bg: "#003D86" }}  // Change this to your desired hover color
          _active={{ bg: "#003D86" }}
          sx={{ fontSize: "12px", fontWeight: 500 }}
          onClick={handleSaveAndGenerate}>
          Save And Generate Skill Set
        </Button>
        <Button
          bg='#B9D9FF'
          color='#003D86'
          size="small"
          p='7px 20px'
          _hover={{ bg: '#B9D9FF' }}  // Change this to your desired hover color
          _active={{ bg: "#B9D9FF" }}
          sx={{ fontSize: "12px", fontWeight: 500 }}
          onClick={() => setIsOpen(true)}>
          Save As A Template
        </Button>
        {insufficientCredits && <> <CreditsComponent borderColor="2px solid #E25247" credits={Math.abs(Math.round((credits - creditRequiredMapping.jobListing)))} />
          <Tooltip label="Insufficient Credits!!, Please purchase credits and refresh." width="170px" fontWeight="400" fontSize="8px" bg="#E4E4F0" color="#00000" placement="top-start">
            <img src={TooltipIcon.src} width="18px" alt="tooltip" />
          </Tooltip></>}
      </Box>
    </Box>
  );
};

export default CreateUserForm;
