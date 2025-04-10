import { Box, Button } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import TextHeading from '../ui-components/TextHeading'
import InputField from '../ui-components/InputField'
import { useRouter } from 'next/router'
import { getJobDescription, parseResume, postCandidatesDetails } from '../../services/jobListingApi'
import toast from 'react-hot-toast'
import { isValidFormData, isValidResume } from '../../utils/validation'
import SelectTag from '../ui-components/SelectTag'
import DragDropFile from '../draganddrop/DragDropFile'
import FormRadioButton from '../../UiComponents/FormRadioButton'
import ResumePreview from '../ui-components/ResumePreview'
import * as pdfjsLib from "pdfjs-dist";
// @ts-ignore
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import FormCheckbox from '../../UiComponents/FormCheckbox'
import { Backdrop, CircularProgress } from '@material-ui/core'
import { truncate } from 'fs/promises'
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const experienceOptions = [
    { label: "0-2 Years", value: "0-2 Years" },
    { label: "2-5 Years", value: "2-5 Years" },
    { label: "5-7 Years", value: "5-7 Years" },
    { label: "10+ Years", value: "10+ Years" }
]

const getInitialDate = () => {
    return {
        name: "",
        email: "",
        phone: "",
        expected_CTC: '',
        years_of_experience: "",
        resume_file: null
    }
}


const getCustomComponents = (data: any, allData: any, onChange: any, i: number) => {

    const handleChange = (value: any, ind: number) => {
        const newData = [...allData];
        newData[ind] = { ...newData[ind], value: value, error: "" }
        onChange(newData);
    }


    switch (data?.type) {
        case 'Text box': {
            return (
                <Box
                    sx={{
                        marginY: "15px",
                        paddingBottom: "15px"
                    }}
                >
                    <TextHeading text={data?.question} required={true} />
                    <InputField
                        value={data?.value}
                        onChange={(value) => handleChange(value, i)}
                        errorMessage={data?.error}
                        placeholder=''
                        bgColor='#282C36'
                        isBorderBottom={true}
                        color='#FFFFFF'
                        size='14px'
                    />
                </Box>
            )
        }
        case 'Multiple choice question': {
            return (
                <Box
                    sx={{
                        marginY: "15px",
                        paddingBottom: "15px"
                    }}
                >
                    <TextHeading text={data?.question} required={true} />
                    <FormRadioButton
                        value={data?.value}
                        onChange={(value) => handleChange(value, i)}
                        options={data?.option ? data?.option?.map((item: string) => { return { label: item, value: item } }) : []}
                        errorMessage={data?.error}
                    />
                </Box>
            )
        }
        case 'Checkbox': {
            return (
                <Box
                    sx={{
                        marginY: "15px",
                        paddingBottom: "15px"
                    }}
                >
                    <TextHeading text={data?.question} required={true} />
                    <FormCheckbox
                        value={data?.value ?? []}
                        onChange={(value: string[]) => handleChange(value, i)}
                        options={data?.option ?? []}
                        errorMessage={data?.error}
                    />
                </Box>
            )
        }
        default: {
            return null
        }
    }
}


const UserForm = ({ setStep }: { setStep: (arg: string) => void }) => {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState(getInitialDate())
    const [formError, setFormError] = useState<any>(getInitialDate())
    const [resume, setResume] = useState<File>();
    const [isParseResume, setIsParseResume] = useState(false)
    const [jobDescriptionDetails, setJobDescriptionDetails] = useState<any>({})
    const [customField, setCustomField] = useState([])
    const [pdfPreview, setPdfPreview] = useState('');
    const router = useRouter();
    const { jobId } = router.query;


    console.log('customField', customField)

    const handleFileUpload = async (file: File) => {
        if (file && file.type === "application/pdf") {
            setResume(file);
            setFormError(getInitialDate())
            const fileReader = new FileReader();

            fileReader.onload = async function () {
                // @ts-ignore
                const typedArray = new Uint8Array(this.result);

                // Load the PDF document
                const pdf = await pdfjsLib.getDocument(typedArray).promise;

                // Get the first page
                const page = await pdf.getPage(1);

                // Set up the canvas
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render the page on the canvas
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport,
                };
                // @ts-ignore
                await page.render(renderContext).promise;

                // Convert the canvas to an image
                const imgData = canvas.toDataURL();
                setPdfPreview(imgData);
            };

            fileReader.readAsArrayBuffer(file);
        }
    };



    const handleChange = (key: string, value: string | File) => {
        if (formError[key]) {
            setFormError((pre: any) => {
                return {
                    ...pre, [key]: ''
                }
            })
        }

        setFormData((pre) => {
            return {
                ...pre, [key]: value
            }
        })
    }

    const handleParseResume = async () => {
        if (isValidResume(resume, setFormError)) {
            setLoading(true)
            const newFormData = new FormData();
            // @ts-ignore
            newFormData.append('resume', resume);
            try {
                const resp = await parseResume(newFormData)
                setFormData((pre) => {
                    return {
                        ...pre,
                        name: resp?.name,
                        email: resp?.email,
                        phone: resp?.phone,
                    }
                })
                console.log('parse api resp', resp)
                setIsParseResume(true)
                setLoading(false)
            } catch (e) {
                console.log('error while calling parse resume api:-', e)
                toast.error('Something went wrong. please try again.')
                setLoading(false)
            }
        }
    }

    const handleSubmit = async () => {
        console.log(formData, jobId)
        let flag = false;
        const newCustomField = customField?.map((item: any) => {
            // @ts-ignore
            if (item?.mandatory && !item?.value) {
                flag = true;
                return {
                    ...item, error: 'field is required',
                };
                // @ts-ignore
            } else if (item?.mandatory && item?.type === 'Checkbox' && Array.isArray(item?.value) && item?.value?.length === 0) {
                flag = true;
                return {
                    ...item, error: 'field is required',
                };
            } else {
                return item;
            }
        });

        if (flag) {
            console.log(flag, 'flag');
            // @ts-ignore
            setCustomField(newCustomField);
            return;
        }

        const custom_fields = customField?.map((item) => {
            // @ts-ignore
            if (item?.question && item?.value) {

                return {
                    // @ts-ignore
                    Question: item?.question,
                    // @ts-ignore
                    Answer: item?.value
                }
            }
        }).filter((item) => !!item)
        console.log(custom_fields, 'custom_fields')
        if (isValidFormData(formData, setFormError)) {
            setLoading(true)
            const newFormData = new FormData();
            // @ts-ignore
            newFormData.append('jobdescription', Number(jobId));
            newFormData.append('name', formData.name);
            newFormData.append('email', formData.email);
            newFormData.append('phone', formData.phone);
            newFormData.append('expected_CTC', formData.expected_CTC);
            newFormData.append('years_of_experience', formData.years_of_experience);
            // @ts-ignore
            newFormData.append('resume_file', resume);
            // @ts-ignore
            newFormData.append('custom_fields', JSON.stringify(custom_fields))
            try {
                const resp = await postCandidatesDetails(newFormData)
                localStorage.setItem('candidateId', resp.id)
                setStep('form-submitted')
                setFormData(getInitialDate())
                setLoading(false)
            } catch (e: any) {
                // @ts-ignore
                console.log('esdfds', e?.response)
                if (e?.response?.data?.non_field_errors && e?.response?.data?.non_field_errors.length > 0) {
                    if (e?.response?.data?.non_field_errors[0]?.includes('email must make a unique set.'))
                        setFormError((pre: any) => {
                            return {
                                ...pre, email: "This email has already been used!"
                            }
                        })
                    setLoading(false)
                    toast.error('This email has already been used!')
                    return
                }
                setLoading(false)
                console.log('error while posting candidate details:-', e)
                toast.error('Something went wrong. please try again!')
            }
        }

    }

    const fetchJobDescription = async () => {
        setLoading(true)
        try {
            const resp = await getJobDescription(jobId)
            setJobDescriptionDetails(resp)
            setCustomField(resp?.custom_fields)
            setLoading(false)
        } catch (e) {
            console.log('error for job description details api:-', e)
            toast.error('Something went wrong, please try again')
            setLoading(false)
        }
    }

    useEffect(() => {
        if (jobId) {
            fetchJobDescription()
        }
    }, [jobId])

    return (
        <Box
            sx={{ display: "flex" }}
        >
            {loading && <Backdrop open={true} style={{ zIndex: 999, color: "#fff" }}>
                <CircularProgress color="inherit" />
            </Backdrop>}
            <Box
                sx={{
                    paddingX: "24px",
                    paddingTop: "90px",
                    width: '50%',
                    height: "100vh",
                    overflow: "auto"
                }}
            >
                <Box
                    sx={{
                        fontSize: "20px",
                        fontWeight: 600,
                        color: "#E5E5E5"
                    }}>
                    {jobDescriptionDetails.job_title}
                </Box>
                <TextHeading text={'Job Description'} />
                <Box
                    sx={{
                        fontSize: '14px',
                        color: "#E5E5E5",
                        lineHeight: '24px',
                        marginBottom: "20px"
                    }}
                >
                    {jobDescriptionDetails?.job_description}
                </Box>
                <TextHeading text={'Roles And Responsibilities'} />
                <Box sx={{
                    fontSize: '14px',
                    color: '#E5E5E5',
                    lineHeight: '24px',
                    marginBottom: "20px"
                }}>

                    <Box > {jobDescriptionDetails?.roles_and_responsibilities}</Box>
                </Box>

                <TextHeading text={'About The Company'} />
                <Box
                    sx={{
                        color: "#E5E5E5",
                        fontSize: '14px',
                        lineHeight: '24px',
                        marginBottom: "20px"
                    }}
                >
                    {jobDescriptionDetails?.about_company}
                </Box>
                <TextHeading text={'Skills Required'} />
                <Box sx={{
                    color: "#E5E5E5",
                    fontSize: '14px',
                    lineHeight: '24px',
                    marginBottom: "20px"
                }}>
                    {jobDescriptionDetails?.skills_required}
                </Box>
            </Box>

            <Box
                sx={{
                    marginTop: "8px",
                    width: "50%",
                    border: "1px solid #2C313B",
                    paddingTop: "90px",
                    height: "100vh",
                    overflow: "auto"
                }}
            >

                {!isParseResume ? <Box>
                    <Box
                        sx={{
                            fontSize: "16px",
                            fontWeight: 500,
                            color: '#F3F3F3',
                            marginBottom: "24px",
                            textAlign: "center"
                        }}
                    >
                        Upload your resume & we will fill the job application
                    </Box>
                    <DragDropFile
                        value={resume}
                        onChange={(value) => handleFileUpload(value)}
                        errorMessage={formError?.resume_file}
                    />
                    <Box
                        sx={{
                            fontSize: "14px",
                            color: '#F3F3F3',
                            textAlign: "center",
                            marginTop: "13px",
                            opacity: 0.6
                        }}
                    >
                        You can edit the fields before submitting
                    </Box>
                    <Box
                        display={'flex'}
                        justifyContent={'center'}
                        mt='35px'
                    >
                        <Button
                            bg={resume ? '#2877EE' : '#B5BBC5'}
                            _active={resume ? '#2877EE' : '#B5BBC5'}
                            _hover={resume ? '#2877EE' : '#B5BBC5'}
                            color='#F3F3F3'
                            fontSize={'16px'}
                            fontWeight={500}
                            px='70px'
                            cursor={resume ? 'pointer' : "no-drop"}
                            onClick={resume ? handleParseResume : () => { }}
                        >
                            Continue
                        </Button>
                    </Box>
                </Box> :

                    <>
                        <Box
                            fontSize={'16px'}
                            fontWeight={500}
                            color='#F3F3F3'
                            px="24px"
                            mb="24px"

                        >
                            Uploaded Resume
                        </Box>
                        <ResumePreview
                            pdfPreview={pdfPreview}
                            /* @ts-ignore */
                            name={resume?.name}
                            handleParseResume={setIsParseResume}
                        />

                        <Box
                            sx={{
                                paddingX: "24px",
                                marginY: "20px",
                            }}
                        >
                            <TextHeading text={'Enter Your Name'} required={true} />
                            <InputField
                                value={formData.name}
                                onChange={(value) => handleChange('name', value)}
                                bgColor='#282C36'
                                errorMessage={formError?.name}
                                placeholder=''
                                isBorderBottom={true}
                                size='14px'
                                color='#FFFFFF'
                            />
                        </Box>
                        <Box
                            sx={{
                                paddingX: "24px",
                                marginY: "20px",
                            }}
                        >
                            <TextHeading text={'Enter Your Email ID'} required={true} />
                            <InputField
                                value={formData.email}
                                onChange={(value) => handleChange('email', value)}
                                errorMessage={formError?.email}
                                placeholder=''
                                bgColor='#282C36'
                                isBorderBottom={true}
                                color='#FFFFFF'
                                size='14px'
                            />
                        </Box>
                        <Box
                            sx={{
                                paddingX: "24px",
                                marginY: "20px",
                            }}
                        >
                            <TextHeading text={'Enter Your Phone Number'} required={true} />
                            <InputField
                                value={formData.phone}
                                onChange={(value) => handleChange('phone', value)}
                                errorMessage={formError.phone}
                                placeholder=''
                                bgColor='#282C36'
                                isBorderBottom={true}
                                color='#FFFFFF'
                                size='14px'
                            />
                        </Box>

                        <Box
                            sx={{
                                paddingX: "24px",
                                marginY: "20px",
                            }}
                        >
                            <TextHeading text={`What's Your Expected CTC? (In LPA)`} required={true} />
                            <InputField
                                value={formData.expected_CTC}
                                onChange={(value) => handleChange('expected_CTC', value)}
                                errorMessage={formError?.expected_CTC}
                                placeholder='In LPA'
                                bgColor='#282C36'
                                isBorderBottom={true}
                                color='#FFFFFF'
                                type='number'
                                size='14px'
                            />
                        </Box>
                        <Box
                            sx={{
                                paddingX: "24px",
                                marginY: "20px",       
                            }}
                        >
                            <TextHeading text={`What's Your Years Of Experience?`} required={true} />
                            <SelectTag
                                options={experienceOptions}
                                value={formData.years_of_experience}
                                onChange={(value) => {
                                    if (typeof value === 'string') {

                                        handleChange('years_of_experience', value)
                                    }
                                }
                                }
                                bgColor='#282C36'
                                borderColor='#282C36'
                                errorMessage={formError.years_of_experience}
                                placeholder=''
                                color="#FFFFFF"
                            />

                        </Box>
                        {customField && customField?.length > 0 && <Box
                            sx={{
                                paddingX: "24px",
                                paddingTop: "30px",
                                paddingBottom: "20px",
                                borderTop: "1px solid #2C313B"
                            }}
                        >
                            <Box
                                fontSize={'16px'}
                                fontWeight={500}
                                color={'#F3F3F3'}
                            >
                                Some additional fields to be filled as requested by the recruiter
                            </Box>

                            {customField?.map((item: any, i: number) => {
                                return <>
                                    {getCustomComponents(item, customField, setCustomField, i)}
                                </>
                            })}


                        </Box>}
                        <Box
                            display={'flex'}
                            justifyContent={'center'}
                            mt='35px'
                        >
                            {/* @ts-ignore */}
                            <Button
                                onClick={handleSubmit}
                                bg='#2877EE'
                                _active={'#2877EE'}
                                _hover={'#2877EE'}
                                color='#F3F3F3'
                                fontSize={'16px'}
                                fontWeight={500}
                                px='70px'

                            >Submit Application</Button>
                        </Box>
                        <Box
                            fontSize={'14px'}
                            mt='12px'
                            mb={'40px'}
                            color='#F3F3F3'
                            textAlign={'center'}
                            opacity={0.6}
                        >
                            All * fields are mandatory
                        </Box>
                    </>}
            </Box>
        </Box >
    )
}

export default UserForm