
import { Box, Button } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { getJobDescription, getRequiredSkills, putRequiredSkills } from '../../services/jobListingApi'
import toast from "react-hot-toast";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { FaRegPenToSquare } from "react-icons/fa6";
import SkillField from "./SkillField";
import deleteIcon from "../../assets/svg/deleteIconsvg.svg"
import SkillDeletePopup from "./SkillDeletePopup";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from 'uuid';

const SelectRequiredSkillSet = ({
  handleBack,
  skills,
  setSkills,
  handleNext,
  setIsCopied,
  handleScrollToTop,
  questions,
  setIsUpdate
}: any) => {
  const [error, setError] = useState("");
  const [skillList, setSkillList] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef([]);
  const [inputParameters, setInputParameters] = useState({key: null, index: null, caret: null})
  const [isSkillDeletePopup, setIsSkillDeletePopup] = useState(false)
  const [deleteSkillData, setDeleteSkillData] = useState({id: "", skillName: ""});
  const [validationErrors, setValidationErrors] = useState([])
  const router = useRouter();

  const skillsDefinitionOptions = [
    {
      value: "Understanding",
      label: "Understanding",
    },
    {
      value: "Strategy",
      label: "Strategy"
    },
    {
      value: "Application",
      label: "Application"
    }
  ]

const newSkillCopy = {
  "skill": "",
  "definition": "",
  "approach": "",
  "followupapproach": "None",
  "difficulty_level": "Intermediate",
  "sentiment": [
  ]
}

  const handleUpdateSkillsData = (key, index, value) => {
    let updatedSkills = []
    if(key === "sentiment") {
      const updatedValue = value.split(", ");
      updatedSkills = skillList.map((skill, i) => index === i ? {...skill, [key]: updatedValue} : {...skill})
    } else {
      updatedSkills = skillList.map((skill, i) => index === i ? {...skill, [key]: value} : {...skill})
    }
    const updatedErrors = validationErrors.map((error, i) => index === i ? value.length === 120 ? {...error, [key]: "Charater limit exceeding"} : {...error, [key]: ""} : {...error})
    setValidationErrors(updatedErrors)
    if(key !== "definition") {
      setInputParameters({...inputParameters, key: key, index: index, caret: inputRef.current[index][key].selectionStart})
    }
    setSkillList(updatedSkills)
    setSkills(updatedSkills)
  }

  const handleAddSkill = () => {
    const updatedSkills = [{...newSkillCopy, id: uuidv4()}, ...skillList]
    const skillsListRefs = updatedSkills.map(() =>({"skill": null, "definition": null, "approach": null, "sentiment": null}))
    inputRef.current = skillsListRefs;
    const updatedErrors = updatedSkills.map(() =>({"skill": "", "definition": "", "approach": "", "sentiment": ""}))
    setValidationErrors(updatedErrors)
    setSkillList(updatedSkills);
    setSkills(updatedSkills);
    setTimeout(() => {
      inputRef.current[0]["skill"].focus()
    }, 0);
  }

  const handleDeleteSkill = (id) => {
    setIsSkillDeletePopup(false)
    const updatedSkill = skillList.filter((skill) => id !== skill?.id)
    const skillsListRefs = updatedSkill.map(() =>({"skill": null, "definition": null, "approach": null, "sentiment": null}))
    inputRef.current = skillsListRefs;
    const updatedErrors = updatedSkill.map(() =>({"skill": "", "definition": "", "approach": "", "sentiment": ""}))
    setValidationErrors(updatedErrors)
    setSkillList(updatedSkill)
    setSkills(updatedSkill)
    setDeleteSkillData({id: "", skillName: ""});
  }

  const handleOpenDeletePoppUp = (id, skill) => {
    setDeleteSkillData({...deleteSkillData, id: id, skillName: skill})
  }

  const handleUpdateErrors = (i, key) => {
    const updatedErrors = validationErrors.map((error, index) => index === i ? {...error, [key]: "This field can't be empty"} : {...error})
      setValidationErrors(updatedErrors)
  }

  const handleSaveAndGenerateLink = async () => {
    for(let i = 0; i < skillList.length; i++) {
      if(skillList[i]?.skill === "") {
        handleUpdateErrors(i, "skill")
        return
      } else if (skillList[i]?.definition === "") {
        handleUpdateErrors(i, "definition")
        return
      } else if(skillList[i]?.approach === "") {
        handleUpdateErrors(i, "approach")
        return
      } else if(skillList[i]?.sentiment.length === 0) {
        handleUpdateErrors(i, "sentiment")
        return
      }
    }
    const id = localStorage.getItem('JDID') ?? ''
  
    if (skills.length !== 0) {
      setLoading(true)
      try {
        const resp = await putRequiredSkills(id, { skills_mapping: skills })
        localStorage.setItem('skills', JSON.stringify(skills));
        handleNext(1);
        setIsCopied(false)
        handleScrollToTop()
        setLoading(false)
      } catch {
        setLoading(false)
        toast?.error("Something went wrong please try again!");
      }

    } else {
      setError("skills are required!");
    }
  };

  const handleEdit = () => {
    handleBack(1)
    setIsUpdate(true)
  }

  const handleFetchSkills = async () => {
    const jobId = localStorage.getItem("JDID") ?? ''
    setLoading(true)
    try {
      const resp = await getRequiredSkills(jobId);
      setLoading(false)
      const skillsListRefs = resp.map(() =>({"skill": null, "definition": null, "approach": null, "sentiment": null}))
      inputRef.current = skillsListRefs;
      const updatedErrors = resp.map(() =>({"skill": "", "definition": "", "approach": "", "sentiment": ""}))
      setValidationErrors(updatedErrors)
      setSkillList(resp);
      setSkills(resp);
    } catch (e) {
      console.log("error for get skills api:-", e)
      setLoading(false)
      toast?.error("Something went wrong please try again!");
    }
  }

  const handleUpdateRefs = (el, index, key) => {
    if(inputRef.current[index]) {
      inputRef.current[index][key] = el
    }
  }

  const handleCloseSkillDeletePopUp = () => {
    setIsSkillDeletePopup(false);
    setDeleteSkillData({id: "", skillName: ""});
  }

  const handleFetchSkillsFromDb = async (jobId) => {
    setLoading(true)
    try {
      const resp = await getJobDescription(jobId)
      setLoading(false);
      const skillsListRefs = resp?.skills_mapping?.map(() =>({"skill": null, "definition": null, "approach": null, "sentiment": null}))
      inputRef.current = skillsListRefs;
      const updatedErrors = resp?.skills_mapping?.map(() =>({"skill": "", "definition": "", "approach": "", "sentiment": ""}))
      setValidationErrors(updatedErrors)
      setSkillList(resp.skills_mapping);
      setSkills(resp.skills_mapping);
    } catch(error) {
      console.log(error, "job description api error")
      setLoading(false);
      toast?.error("Something went wrong please try again!");
    }
  }

  useEffect(() => {
    const { editId } = router.query;
    let existingSkills = localStorage.getItem('skills')
    if(existingSkills) {
      existingSkills = JSON.parse(existingSkills)
    }
    if((!editId) && existingSkills) {
      const skillsListRefs = existingSkills?.map(() =>({"skill": null, "definition": null, "approach": null, "sentiment": null}))
      inputRef.current = skillsListRefs;
      const updatedErrors = existingSkills?.map(() =>({"skill": "", "definition": "", "approach": "", "sentiment": ""}))
      setValidationErrors(updatedErrors)
      setSkillList(existingSkills)
      setSkills(existingSkills)
    } else if(!editId) {
      handleFetchSkills()
    } else if (editId) {
      handleFetchSkillsFromDb(editId)
    }
  }, [])

  useEffect(()=>{
    if((skillList) && (inputParameters.index !== null && inputParameters.key !== null)) {
      inputRef.current[inputParameters.index][inputParameters.key].setSelectionRange(inputParameters.caret, inputParameters.caret);
      inputRef.current[inputParameters.index][inputParameters.key].focus();
    }
  },[skillList])

  useEffect(() => {
    if(deleteSkillData.id !== "") {
      setIsSkillDeletePopup(true);
    }
  }, [deleteSkillData.id])

  return (
    <div>
      {loading && <Backdrop open={true} style={{ zIndex: 999, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>}
      <SkillDeletePopup 
          isOpen={isSkillDeletePopup}
          onClose={handleCloseSkillDeletePopUp}
          setIsSkillDeletePopup={setIsSkillDeletePopup}
          id={deleteSkillData?.id}
          skillName={deleteSkillData?.skillName}
          handleDeleteSkill={handleDeleteSkill}
          setDeleteSkillData={setDeleteSkillData}
        />
      <Box
        sx={{
          padding: "12px",
          backgroundColor: "#FFFFFF",
          borderRadius: "5px",
          marginTop: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginX: '20px',
          border: "1px solid #CFD6DC"
        }}
      >
        <Box sx={{ color: "#000000", fontWeight: 500, fontSize: "14px" }}>
          {questions[0]?.value}
        </Box>

        {/* @ts-ignore */}
        <Button leftIcon={<FaRegPenToSquare />}
          _hover={{ bg: "#EBF2FB" }}  
          _active={{ bg: "#EBF2FB" }}
          bg={'#EBF2FB'}
          color={'#003D86'}
          style={{ fontSize: "12px", fontWeight: 500 }}
          onClick={handleEdit}
          variant='solid'>
          Edit Job Listing
        </Button>
      </Box>
      <Box
        sx={{
          marginTop: "16px",
          marginX: '20px',
        }}>
          <Box
            sx={{
              backgroundColor: "#F9F9FC",
              padding: "12px 0px 16px 0px",
            }}
            >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignContent: "center",
                padding: "0px 12px",
                marginBottom: "14px"
              }}
            >
              <Box sx={{
                color: "#535353",
                fontWeight: 600,
                fontSize: "14px",
                backgroundColor: "#F9F9FC",
                borderRadius: "4px",
                }}>
                Select Required Skill For Resume Screening and AI Interview
              </Box>
              <Button
                style={{width: "86px",
                  height: "24px",
                  fontSize: "12px",
                  color: "#003D86",
                  padding: "4px 10px",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "6px",
                  border: "1px solid #003D86",
                  fontWeight: 500
                }}
                onClick={handleAddSkill}
              >
                <span style={{fontSize: "20px", marginTop: "-4.4px", marginRight: "5px"}}>+</span> Add Skill
              </Button>
            </Box>
            { skillList?.map((skill, index) => <React.Fragment key={skill.id}>
              <Box
                sx={{
                  display: "flex",
                  gap: "12px",
                  marginBottom: "16px",
                  marginTop: "12px",
                  padding: "0px 12px",
                  alignItems: "end",
                }}
              >
              <Box sx={{
                width: "18%",
                position: "relative",
              }}>
                <SkillField 
                  type="text"
                  label="Skill"
                  name="skill"
                  placeholder="eg: UI/UX"
                  value={skill?.skill}
                  index={index}
                  refs={(el) => handleUpdateRefs(el, index, "skill")}
                  onChangeFn={handleUpdateSkillsData}
                />
                <Box
                  sx={{
                    fontSize: "10px",
                    position: "absolute",
                    marginTop: "1px",
                    color: "red"
                    // bottom: 0
                  }}
                >{validationErrors[index]?.skill}</Box>
              </Box>
              <Box sx={{
                width: "18%",
                position: "relative",
              }}>
                <SkillField 
                  type="select"
                  label="Definition"
                  name="definition"
                  options={skillsDefinitionOptions}
                  value={skill?.definition}
                  index={index}
                  refs={(el) => handleUpdateRefs(el, index, "definition")}
                  onChangeFn={handleUpdateSkillsData}
                />
                <Box
                  sx={{
                    fontSize: "10px",
                    position: "absolute",
                    marginTop: "1px",
                    color: "red"
                    // bottom: 0
                  }}
                >{validationErrors[index]?.definition}</Box>
              </Box>
              <Box sx={{
                width: "45%",
                position: "relative",
              }}>
                <SkillField 
                  type="text"
                  label="Approach"
                  name="approach"
                  placeholder="eg: Ask the candidate fundamentals of UI"
                  value={skill?.approach}
                  index={index}
                  refs={(el) => handleUpdateRefs(el, index, "approach")}
                  onChangeFn={handleUpdateSkillsData}
                />
                <Box
                  sx={{
                    fontSize: "10px",
                    position: "absolute",
                    marginTop: "1px",
                    color: "red"
                  }}
                >{validationErrors[index]?.approach}</Box>
              </Box>
              <Box sx={{
                width: "18%",
                position: "relative",
              }}>
                <SkillField
                  type="text"
                  label="Sentiments"
                  name="sentiment"
                  placeholder="eg: Teamwork, Wireframing"
                  value={skill?.sentiment.join(", ")}
                  index={index}
                  refs={(el) => handleUpdateRefs(el, index, "sentiment")}
                  onChangeFn={handleUpdateSkillsData}
                />
                <Box
                  sx={{
                    fontSize: "10px",
                    position: "absolute",
                    marginTop: "1px",
                    color: "red"
                  }}
                >{validationErrors[index]?.sentiment}</Box>
              </Box>
                <img onClick={() => handleOpenDeletePoppUp(skill?.id, skill?.skill)} src={deleteIcon.src} style={{width: "32px", height: "32px", maxWidth: "none", cursor: "pointer"}} width="32px" height="32px" alt="Delete" />
            </Box>
              <Box
                sx={{border: "1px solid rgba(207, 214, 220, 0.5)", width: "100%"}}
              ></Box>
            </React.Fragment>)}
          </Box>
        <Box mt="50px">
          {/* @ts-ignore */}
          <Button
            _hover={{ bg: "#003D86" }} 
            _active={{ bg: "#003D86" }}
            color="#FFFFFF"
            bg='#003D86'
            style={{ fontSize: "12px", fontWeight: 500 }} onClick={handleSaveAndGenerateLink}>
            Save And Generate Link
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default SelectRequiredSkillSet;
